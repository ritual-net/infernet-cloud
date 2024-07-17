<script lang="ts">
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
	// (Form)
	import { superForm } from 'sveltekit-superforms/client'
	import { yupClient } from 'sveltekit-superforms/adapters'

	const {
		form,
		enhance,
		errors,
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

	let delayedToast: Toast
	$: if($delayed){
		delayedToast = addToast({
			data: {
				type: 'default',
				title: `Adding node to cluster "${cluster.name}"...`,
			},
		})
	}else{
		if(delayedToast)
			removeToast(delayedToast.id)
	}


	// Components
	import NodeFormFields from '../../create/NodeFormFields.svelte'
	import FormSubmitButton from '$/components/FormSubmitButton.svelte'
</script>


<form
	method="POST"
	use:enhance
	class="column"
>
	<header>
		<h2>Add Node to Cluster "{cluster.name}"</h2>
	</header>

	<article
		class="card column"
	>
		<NodeFormFields
			bind:node={$form.node}
			constraints={$constraints.node}
			{dockerAccounts}
		/>
	</article>

	<footer class="row">
		<a
			class="button"
			href="."
		>
			Cancel
		</a>
				
		<div class="row">
			<FormSubmitButton
				submitting={$submitting}
				allErrors={$allErrors}
				submitLabel="Add Node"
			/>
		</div>
	</footer>
</form>
