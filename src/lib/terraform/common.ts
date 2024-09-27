import { e } from '$/lib/db'
import { getClusterById } from '../db/queries'
import { restartRouter } from '$/lib/clients/node/common'
import { ProviderTerraform } from '$/lib'
import type { Client } from 'edgedb'
import type { ProviderServiceAccount } from '$/types/provider'
import { TFAction } from '$/types/terraform'
import { addCleanupListener, removeCleanupListener } from 'async-cleanup'

/**
 * Locks the given cluster to prevent concurrent mutations.
 *
 * @param client The database client
 * @param clusterId The id of the Cluster
 */
const lockCluster = async (client: Client, clusterId: string) => {
	await e
		.update(e.Cluster, () => ({
			filter_single: { id: clusterId },
			set: {
				locked: true,
			},
		}))
		.run(client)
}

/**
 * Unlocks the given cluster.
 *
 * @param client The database client
 * @param clusterId The id of the Cluster
 */
const unlockCluster = async (client: Client, clusterId: string) => {
	await e
		.update(e.Cluster, () => ({
			filter_single: { id: clusterId },
			set: {
				locked: false,
			},
		}))
		.run(client)
}

/**
 * Applies the given action to a cluster, and persists the resulting Terraform state
 * in the database.
 *
 * @param client The database client
 * @param clusterId The id of the Cluster
 * @param action The Terraform action
 * @returns An object with the success status and (optional) error message
 */
export const clusterAction = async (client: Client, clusterId: string, action: TFAction) => {
	const cluster = await getClusterById(client, clusterId, {
		includeServiceAccountCredentials: true,
		includeNodeDetails: true,
		includeDockerAccountCredentials: true,
		includeTerraformDeploymentDetails: true,
	})

	if (!cluster)
		throw new Error(`Cluster not found.`)

	if (/*action === TFAction.Apply &&*/ cluster.locked)
		throw new Error(`The cluster is already in the process of being updated. Please wait and try again.`)

	const cleanUp = async () => {
		await unlockCluster(client, clusterId)
	}

	try {
		addCleanupListener(cleanUp)

		await lockCluster(client, clusterId)

		// Perform Terraform action
		const results = await (
			ProviderTerraform[cluster.service_account.provider]
				.action(
					cluster,
					cluster.service_account as ProviderServiceAccount,
					action
				)
		)

		const snapshots = (
			results
				.map(result => ({
					action: result.action,
					tfvars: result.tfvars,
					timestamp: new Date(result.timestamp).toISOString(),
					command: result.command,
					error: result.output.error,
					tfstate: result.output.tfstate,
					stdout: result.output.stdout,
					stderr: result.output.stderr,
				}))
		)

		// Store state in the database

		// https://github.com/edgedb/edgedb-js/issues/554

		/*
		const snapshots = (
			await e
				.params(
					{
						snapshots: e.array(
							e.tuple({
								action: e.TerraformAction,
								error: e.str,
								tfstate: e.json,
								stdout: e.array(e.json),
								stderr: e.array(e.json),
							})
						), 
					},
					({ snapshots }) => (
						e.for(e.array_unpack(snapshots), (snapshot) =>
							e.insert(
								e.TerraformDeployment,
								{
									cluster: e.select(e.Cluster, () => ({
										filter_single: { id: clusterId },
									})),
									action: e.cast(e.TerraformAction, action),
									error: snapshot.error,
									tfstate: snapshot.tfstate,
									stdout: snapshot.stdout,
									stderr: snapshot.stderr,
								}
							)
						)
					)
				)
				.run(client, {
					snapshots: (
						results
							.map(result => ({
								action: result.action,
								error: result.output.error ?? '',
								tfstate: result.output.tfstate,
								stdout: result.output.stdout,
								stderr: result.output.stderr,
							}))
					),
				})
		)
		*/

		// InvalidValueError: JSON index 'error' is out of bounds
		/*
		const insertedSnapshots = (
			await e
				.params(
					{
						snapshots: e.json,
					},
					({ snapshots }) => (
						e.for(e.json_array_unpack(snapshots), (snapshot) => (
							e.insert(
								e.TerraformDeployment,
								{
									action: e.cast(e.TerraformAction, snapshot['action']),
									timestamp: e.cast(e.datetime, snapshot['timestamp']),
									cluster: e.select(e.Cluster, () => ({
										filter_single: { id: clusterId },
									})),
									command: e.cast(e.str, snapshot['command']),
									error: e.cast(e.str, snapshot['error']),
									tfstate: e.cast(e.json, snapshot['tfstate']),
									stdout: e.cast(e.array(e.json), snapshot['stdout']),
									stderr: e.cast(e.array(e.json), snapshot['stderr']),
								}
							)
						)
					)
				)
				.run(client, {
					snapshots,
				})
		)
		*/

		// Insert snapshots individually
		const insertedSnapshots = []

		for (const snapshot of snapshots) {
			const insertedSnapshot = await e
				.insert(
					e.TerraformDeployment,
					{
						action: e.cast(e.TerraformAction, snapshot.action),
						timestamp: e.cast(e.datetime, snapshot.timestamp),
						cluster: e.select(e.Cluster, () => ({
							filter_single: { id: clusterId },
						})),
						command: snapshot.command,
						...snapshot.tfvars && { tfvars: snapshot.tfvars },
						...snapshot.error && { error: snapshot.error },
						...snapshot.tfstate && { tfstate: snapshot.tfstate },
						...snapshot.stdout && { stdout: snapshot.stdout },
						...snapshot.stderr && { stderr: snapshot.stderr }, 
					}
				)
				.run(client)

			insertedSnapshots.push(insertedSnapshot)
		}

		const {
			output: {
				error,
				tfstate,
				stdout,
				stderr,
			},
		} = results[results.length - 1]

		// Restart router to apply any changes to IP address list
		if (cluster.router && action == TFAction.Apply && tfstate?.outputs?.router?.value)
			await restartRouter(client, tfstate.outputs.router.value.id)

		return {
			snapshots: insertedSnapshots,
			error,
		}
	} finally {
		await cleanUp()
		removeCleanupListener(cleanUp)
	}
}
