<script lang="ts">
	// Types
	import type { PageServerData } from './$types'


	// Inputs
	export let dockerAccounts: PageServerData['dockerAccounts']


	// Context
	import { page } from '$app/stores'


	// Actions
	import { addToast, removeToast } from '$/components/Toaster.svelte'
	import { applyAction } from '$app/forms'
	import { invalidate } from '$app/navigation'


	// Functions
	import { resolveRoute } from '$app/paths'


	// Components
	import Table from '$/components/Table.svelte'
</script>


<Table
	data={dockerAccounts}
	columns={[
		{
			header: 'Docker Hub Username',
			accessor: dockerAccount => dockerAccount.username,
		},
	]}
	contextMenu={dockerAccount => {
		const dockerAccountRoute = resolveRoute(`/cloud-accounts/docker/[dockerAccountId]`, {
			dockerAccountId: dockerAccount.id,
		})

		return [
			{
				value: 'delete',
				label: 'Disconnect Docker Account',
				formAction: `${dockerAccountRoute}?/delete`,
				formSubmit: async (e) => {
					const toast = addToast({
						data: {
							type: 'default',
							title: 'Disconnecting Docker account...',
						},
					})

					return async ({ result }) => {
						await applyAction(result)

						if(result.type === 'success')
							await invalidate($page.url)

						removeToast(toast.id)
					}
				},
			},
		]
	}}
>
	<p>No Docker accounts connected.</p>
</Table>
