import { ProviderTerraform } from '$/lib';
import { client, e } from '$/lib/db';
import type { TFAction } from '$/types/terraform';
import { getClusterById } from '../db/queries';
import type { ProviderServiceAccount } from '$/types/provider';

/**
 * Applies the given action to a cluster, and persists the resulting Terraform state
 * in the database.
 *
 * @param clusterId The id of the Cluster
 * @param action The Terraform action
 * @returns An object with the success status and (optional) error message
 */
export const clusterAction = async (clusterId: string, action: TFAction) => {
	const cluster = await getClusterById(clusterId, true);
	if (!cluster) {
		return { error: 'Cluster not found', success: false };
	}

	const { error, state, success } = await ProviderTerraform[
		cluster.service_account.provider
	].action(cluster, cluster.service_account as ProviderServiceAccount, action);

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
};
