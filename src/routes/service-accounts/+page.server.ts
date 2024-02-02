import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	locals,
	fetch,
}) => {
	const { userId } = locals.getSession()

	const serviceAccounts = await fetch(`/api/service_account?${new URLSearchParams({
		user: userId,
	})}`)
		.then(response => response.json())

	return {
		serviceAccounts
	}
}
