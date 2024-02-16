import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	fetch,
}) => {
	const serviceAccounts = await fetch(`/api/service_account`)
		.then(response => response.json())

	return {
		serviceAccounts
	}
}
