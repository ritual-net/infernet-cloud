// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	parent,
}) => {
	const { cluster } = await parent()

	const formData = await superValidate({
		config: {
			name: cluster.name,
			deploy_router: cluster.deploy_router,
			ip_allow_http: cluster.ip_allow_http,
			ip_allow_ssh: cluster.ip_allow_ssh,
		},	
	}, zod(FormData))

	return {
		cluster,
		formData,
	}
}
