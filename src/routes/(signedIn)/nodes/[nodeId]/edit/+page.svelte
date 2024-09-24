<script lang="ts">
	// Types/constants
	import { providers, ProviderTypeEnum } from '$/types/provider'


	// Schema
	import { FormData } from './schema'


	// Context
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	const {
		cluster,
		formData,
		dockerAccounts,
	} = $page.data as PageData


	// Actions
	import { type Toast, addToast, removeToast } from '$/components/Toaster.svelte'


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		form,
		enhance,
		allErrors,
		constraints,

		capture,
		restore,

		submitting,
		delayed,
	} = superForm(formData, {
		dataType: 'json',
		customValidity: true,
		validators: yupClient(FormData),
	})

	export const snapshot = { capture, restore }


	// Actions
	let delayedToast: Toast
	$: if($delayed){
		delayedToast = addToast({
			closeDelay: 0,
			data: {
				type: 'loading',
				title: `Saving node configuration...`,
			},
		})
	}else{
		if(delayedToast)
			removeToast(delayedToast.id)
	}

	import { onDestroy } from 'svelte'

	onDestroy(() => {
		if(delayedToast)
			removeToast(delayedToast.id)
	})


	// Components
	import FormSubmitButton from '$/components/FormSubmitButton.svelte'
	import NodeFormFields from '$/routes/(signedIn)/clusters/create/NodeFormFields.svelte'
</script>


<svelte:head>
	<title>Edit node configuration | Infernet Cloud</title>
</svelte:head>


<form
	class="column"
	method="POST"
	use:enhance
>
	<header>
		<h2>Edit node configuration</h2>
	</header>

	<fieldset class="card column">
		<NodeFormFields
			defaultRegionId={cluster.region}
			defaultZoneId={cluster.zone}
			bind:node={$form.node}
			namePrefix="node"
			constraints={$constraints.node}
			serviceAccount={cluster.service_account}
			{dockerAccounts}
		/>
	</fieldset>

	<footer class="row">
		<a
			class="button"
			href="."
		>
			Cancel
		</a>

		<FormSubmitButton
			submitting={$submitting}
			allErrors={$allErrors}
			submitLabel="Save and apply changes"
		/>
	</footer>
</form>
