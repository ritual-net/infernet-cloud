import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	fetch,
}) => {
	const serviceAccounts = await fetch(`/api/service_account`)
		.then(response => response.json())

	return {
		serviceAccounts
	}
}
