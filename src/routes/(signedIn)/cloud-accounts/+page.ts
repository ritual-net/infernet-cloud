import type { ServiceAccount } from '$schema/interfaces'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	data,
	fetch,
}) => {
	const serviceAccountsPromise = (
		fetch(`/api/service_account`)
			.then(response => response.json()) as Promise<ServiceAccount[]>
	)

	return {
		...data,
		serviceAccountsPromise,
	}
}
