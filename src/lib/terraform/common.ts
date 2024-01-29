import { ProviderTerraform } from '$lib';
import { QueryByProvider, client, e } from '$lib/db';
import type { CloudProvider } from '$schema/interfaces';
import type { TerraformAction } from '$types/terraform';

/**
 * Applies the given action to a cluster, and persists the resulting Terraform state
 * in the database.
 *
 * @param clusterId The id of the Cluster
 * @param provider The cloud provider
 * @param action The Terraform action
 * @returns An object with the success status and (optional) error message
 */
export async function clusterAction(
	clusterId: string,
	provider: CloudProvider,
	action: TerraformAction
) {
	const cluster = await QueryByProvider[provider].getClusterById(clusterId);
	if (!cluster) {
		return { error: 'Cluster not found', success: false };
	}

	const serviceAccount = await QueryByProvider[provider].getServiceAccountById(
		cluster.service_account.id
	);
	if (!serviceAccount) {
		return { error: 'Service Account not found', success: false };
	}

	const { error, state, success } = await ProviderTerraform[provider].action(
		cluster,
		serviceAccount,
		action
	);

	// Store state in the database
	await e
		.update(e.Cluster, () => ({
			filter_single: { id: clusterId },
			set: {
				tfstate: JSON.stringify(state),
			},
		}))
		.run(client);

	return { error, success };
}
