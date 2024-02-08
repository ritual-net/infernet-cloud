<script lang="ts">
	// Inputs
	export let data
	const {
		formData,
	} = data

	// (View options)
	export let placement: 'standalone' | 'in-modal' = 'standalone'


	// Context
	// import { page } from '$app/stores'
	// import type { PageData } from './$types'

	// const {
	// 	formData,
	// } = $page.data as PageData


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'

	const {
		form,
		enhance,
		errors,
		constraints,
		submitting,
	} = superForm(formData, {
		dataType: 'json',
	})

	let allowIps: 'all' | 'restricted' = 'all'


	// Events
	import { goto } from '$app/navigation'

	export let onSubmit: (_: typeof $form) => void = () => {
		goto('/clusters/create/#/nodes')
	}


	// Components
	import Switch from '$components/Switch.svelte'
	import Select from '$components/Select.svelte'
	import Tabs from '$components/Tabs.svelte'
</script>


<form
	class="card column"
	on:submit|preventDefault={e => {
		console.log({e, $form})
		onSubmit?.($form)
	}}
>
	{#if placement !== 'in-modal'}
		<header>
			Customize container
		</header>
	{/if}

	<fieldset class="column">
		<section class="row wrap">
			<div class="column inline">
				<h3>
					<label for="serviceAccount">
						Image
					</label>
				</h3>

				<p>Choose the image this container is deployed with.</p>
			</div>

			<Select
				required
				name="image"
				labelText="Service Account"
				bind:value={$form.container.image}
				items={[
					{
						value: 'ritualnet/llm-inference:0.0.1',
						label: 'ritualnet/llm-inference:0.0.1',
					}
				]}
			/>
		</section>

		<!-- <section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="image_id">
						Image ID
					</label>
				</h3>

				<p>Enter an ID for the image to be used.</p>
			</div>

			<input
				type="text"
				bind:value={$form.container.container_id}
				placeholder={`ritualnet/llm-inference`}
				{...$constraints.container.container_id ?? {}}
			/>
		</section> -->

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="description">
						Description
					</label>
				</h3>

				<p>Add a description for this container.</p>
			</div>

			<input
				type="text"
				bind:value={$form.container.description}
				placeholder={`Enter a description here...`}
				{...$constraints.container?.description ?? {}}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3>
					<label for="serviceAccount">
						Visibility
					</label>
				</h3>

				<p>Determine if container is publicly accessible.</p>
			</div>

			<Select
				required
				name="image"
				labelText="Visibility"
				bind:value={$form.container.external}
				items={[
					{
						value: true,
						label: 'External',
					},
					{
						value: false,
						label: 'Internal',
					},
				]}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3>
					<label for="gpu">
						Has GPU?
					</label>
				</h3>

				<p>Determine if GPU-enabled.</p>
			</div>

			<Switch
				bind:checked={$form.container.gpu}
				labelText="Has GPU?"
			/>
		</section>

		{#if allowIps !== 'all'}
			<Tabs
				value={0}
				items={[
					{
						id: 0,
						label: 'HTTP',
					},
					{
						id: 1,
						label: 'SSH',
					},
				]}
			>
				<svelte:fragment slot="content"
					let:item
				>
					{#if item.id === 0}
						<textarea
							name="allowed_addresses"
							rows="2"
							placeholder={`Enter a comma-separated list of Ethereum addresses...\n0xabcd...6789`}
							bind:value={$form.container.allowed_addresses}
							{...$constraints.container?.allowed_addresses}
							disabled={allowIps === 'all'}
						/>

					{:else if item.id === 1}
						<textarea
							name="allowed_delegate_addresses"
							rows="2"
							placeholder={`Enter a comma-separated list of Ethereum addresses...\n0xabcd...6789`}
							bind:value={$form.container.allowed_delegate_addresses}
							{...$constraints.container?.allowed_delegate_addresses}
							disabled={allowIps === 'all'}
						/>

					{:else if item.id === 2}
						<textarea
							name="allowed_ips"
							rows="2"
							placeholder={`Enter a comma-separated list of IP addresses...\n0.0.0.0/1, 0.0.0.0/2`}
							bind:value={$form.container.allowed_ips}
							{...$constraints.container?.allowed_ips}
							disabled={allowIps === 'all'}
						/>
					{/if}
				</svelte:fragment>
			</Tabs>
		{/if}

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="command">
						Start Command
					</label>
				</h3>

				<p>Enter the start command for this container below.</p>
			</div>

			<input
				type="text"
				bind:value={$form.container.command}
				placeholder={`Enter start command here...`}
				{...$constraints.container?.command}
			/>
		</section>

		<section class="row wrap">
			<div class="column inline">
				<h3 class="row inline">
					<label for="command">
						Environment Variables
					</label>
				</h3>

				<p>Please enter the contents of the .env file for this container.</p>
			</div>

			<textarea
				name="allowed_addresses"
				rows="2"
				placeholder={`Add environment variables here...`}
				bind:value={$form.container.env}
				{...$constraints.container?.env}
			/>
		</section>
	</fieldset>

	<footer class="row">
		<div class="row">
			<button
				type="button"
				on:click={() => history.back()}
			>
				Cancel
			</button>
		</div>

		<div class="row">
			<button
				type="submit"
				class="primary"
				disabled={$submitting}
			>
				Add Container
			</button>
		</div>
	</footer>
</form>
