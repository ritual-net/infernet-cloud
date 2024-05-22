<script lang="ts">
	// Context
	import { page } from '$app/stores'

	$: ({
		containerTemplates,
	} = $page.data)


	// Actions
	import { invalidate } from '$app/navigation'
	import { addToast, removeToast } from '$/components/Toaster.svelte'


	// Components
	import DropdownMenu from '$/components/DropdownMenu.svelte'
	import ContainerTemplatesTable from './ContainerTemplatesTable.svelte'
</script>


<div class="column">
	<header class="row">
		<h2>Container Templates</h2>

		<div class="row">
			<a
				class="button primary"
				href="/templates/create"
			>
				Create Container Template
			</a>

			<DropdownMenu
				labelText="Actions"
				items={[
					{
						value: 'refresh',
						label: 'Refresh data',
						onClick: async () => {
							const toast = addToast({
								data: {
									type: 'default',
									title: `Refreshing data...`,
								},
							})

							await invalidate(`/api/container_template`)

							removeToast(toast.id)
						},
					},
				]}
			/>
		</div>
	</header>

	<section>
		<ContainerTemplatesTable
			{containerTemplates}
		/>
	</section>
</div>
