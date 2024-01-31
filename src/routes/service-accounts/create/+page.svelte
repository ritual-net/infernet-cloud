<script lang="ts">
	// Data
	import { AwsCredentials, GcpCredentials } from './schema'


	// Context
	import type { PageData } from './$types'

	const {
		form: formData,
	} = $page.data as PageData


	// Internal state
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'

	const { form, enhance, errors, constraints } = superForm(formData, {
		dataType: 'json',
	})


	// Components
	import Select from '$components/Select.svelte'


	// Transitions/animations
	import { fly } from 'svelte/transition'
</script>


<form
	method="POST"
	use:enhance
	class="stack"
>
	<fieldset
		class="column"
		in:fly={{ x: 40, duration: 200 }}
		out:fly={{ x: -40, duration: 200 }}
	>
		<header class="row">
			<legend>
				<h2>Connect Service Account</h2>
			</legend>
		</header>

		<div class="card column">
			<section class="row wrap">
				<div class="column inline">
					<h3>
						<label for="provider">
							Provider
						</label>
					</h3>

					<p></p>
				</div>

				<Select
					required
					name="provider"
					bind:value={$form.provider}
					placeholder="Select provider..."
					items={[
						{
							label: 'Amazon Web Services',
							value: 'AWS',
						},
						{
							label: 'Google Cloud Platform',
							value: 'GCP',
						},
					]}
				/>
			</section>

			<section class="row wrap">
				<div class="column inline">
					<h3>
						<label for="name">
							Name
						</label>
					</h3>

					<p></p>
				</div>

				<input
					type="text"
					name="name"
					placeholder="My First Infernet Cluster"
					bind:value={$form.name}
					{...$constraints.name}
				/>
			</section>

			<section class="row wrap">
				<div class="column inline">
					<h3>
						<label for="credentials">
							Credentials
						</label>
					</h3>

					<p></p>
				</div>

				<textarea
					name="credentials"
					rows="13"
					placeholder={
						JSON.stringify(
							{
								['GCP']: GcpCredentials,
								['AWS']: AwsCredentials,
							}[$form.provider]
							.parse({}),
							null,
							'\t'
						)
					}
					bind:value={$form.credentials}
					{...$constraints.credentials}
				/>
			</section>
		</div>

		<footer class="row">
			<a href=".">
				<button type="button">
					Cancel
				</button>
			</a>
	
			<div class="row">
				<button
					type="submit"
					class="primary"
				>
					Connect
				</button>
			</div>
		</footer>
	</fieldset>
</form>
