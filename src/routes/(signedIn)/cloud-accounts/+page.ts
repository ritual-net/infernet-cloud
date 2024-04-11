import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	data,
	fetch,
	parent,
}) => {
	const [
		parentData,
		serviceAccounts,
	] = await Promise.all([
		parent(),

		fetch(`/api/service_account`)
			.then(response => response.json())
	])

	return {
		...parentData,
		...data,
		serviceAccounts,
	}
}
