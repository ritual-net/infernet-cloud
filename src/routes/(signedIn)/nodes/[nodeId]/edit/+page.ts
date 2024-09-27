// Types
import type { getClusterByNodeIds } from '$/lib/db/queries'


// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageLoad } from './$types'
import { resolveRoute } from '$app/paths'

export const load: PageLoad = async ({
	params: { nodeId },
	parent,
	fetch,
}) => {
	const {
		node,
	} = await parent()

	if(!node)
		throw new Error(`Node was not found.`)

	const [
		formData,
		cluster,
		dockerAccounts,
	] = await Promise.all([
		superValidate(
			{
				node: {
					config: {
						region: node.region,
						zone: node.zone,
						machine_type: node.machine_type,
						machine_image: node.machine_image,
						chain_enabled: node.chain_enabled,
						trail_head_blocks: node.trail_head_blocks,
						rpc_url: node.rpc_url,
						chain_id: node.chain_id,
						registry_address: node.registry_address,
						max_gas_limit: node.max_gas_limit,
						private_key: node.private_key,
						payment_address: node.payment_address,
						allowed_sim_errors: node.allowed_sim_errors,
						forward_stats: node.forward_stats,
						snapshot_sync_sleep: node.snapshot_sync_sleep,
						snapshot_sync_batch_size: node.snapshot_sync_batch_size,
					},
					dockerAccountUsername: node.docker_account?.username,
					containers: node.containers,
				},
			},
			yup(FormData),
		),

		(
			fetch(
				resolveRoute('/api/node/[nodeId]/cluster', {
					nodeId,
				})
			)
				.then(response => response.json() as ReturnType<typeof getClusterByNodeIds>)
		),

		(	
			fetch('/api/docker-accounts')
				.then(result => result.json())
		),
	])

	return {
		formData,
		cluster,
		dockerAccounts,
	}
}
