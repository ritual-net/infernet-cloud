// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
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
			deploy_router: Boolean(cluster.router),
			ip_allow_http: cluster.ip_allow_http,
			ip_allow_ssh: cluster.ip_allow_ssh,
			region: cluster.region,
			zone: cluster.zone,
		},
		router: {
			region: cluster.router?.region,
			zone: cluster.router?.zone,
			machine_type: cluster.router?.machine_type,
		}
	}, yup(FormData))

	return {
		cluster,
		formData,
	}
}
