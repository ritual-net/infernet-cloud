// Types
import type { ProviderCluster } from '$/types/provider'


// Actions
import { type Actions } from '@sveltejs/kit'
import { redirect as flashRedirect } from 'sveltekit-flash-message/server'
import { resolveRoute } from '$app/paths'
import { message } from 'sveltekit-superforms/server'

export const actions: Actions = {
	apply: async ({
		fetch,
		params: { clusterId },
	}) => {
		const response = await fetch(
			resolveRoute('/api/cluster/[clusterId]', { clusterId }),
			{
				method: 'POST',
			},
		)

		if(!response.ok){
			const result = await response.json()

			return message(
				{},
				{
					title: `Couldn't apply changes to cluster.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		const updatedCluster = await response.json() as ProviderCluster

		return message(
			{},
			{
				title: `Applied changes to cluster "${updatedCluster.name}".`,
			},
			{
				status: response.status,
			},
		)
	},

	destroy: async ({
		fetch,
		params: { clusterId },
	}) => {
		const response = await fetch(
			`${resolveRoute('/api/cluster/[clusterId]', { clusterId })}?destroy`,
			{
				method: 'POST',
			},
		)

		if (!response.ok) {
			const result = await response.json()

			return message(
				{},
				{
					title: `Couldn't destroy cluster.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		const result = await response.json()

		return message(
			{},
			{
				title: `Destroyed cluster "${result.name}".`,
				description: `You can choose to recreate the cluster at a later time or delete it from your account.`,
			},
			{
				status: response.status,
			},
		)
	},

	delete: async ({
		fetch,
		params: { clusterId },
		cookies,
	}) => {
		const response = await fetch(
			resolveRoute('/api/cluster/[clusterId]', { clusterId }),
			{
				method: 'DELETE',
			},
		)

		if (!response.ok) {
			const result = await response.json()

			return message(
				{},
				{
					title: `Couldn't delete cluster.`,
					description: result.message,
				},
				{
					status: response.status,
				},
			)
		}

		const result = await response.json()

		return flashRedirect(
			303,
			`/clusters`,
			{
				type: 'success',
				message: {
					title: `Cluster deleted.`,
				},
			},
			cookies,
		)
	},
}
