<script lang="ts">
	// Constants
	enum FormAction {
		SignOut = '?/signOut'
	}


	// Context
	import { page } from '$app/stores'


	// Internal state
	import { superForm } from 'sveltekit-superforms/client'

	const {
		formId: signOutFormId,
		form: signOutForm,
		errors: signOutErrors,
		enhance: signOutEnhance,
		constraints: signOutConstraints,
		submitting: signOutSubmitting,
	} = superForm({}, {
		dataType: 'json',
		customValidity: true,
	})
</script>


<div class="container column">
	<header>
		<h2>Account</h2>
	</header>

	<form
		method="POST"
		use:signOutEnhance
		action={FormAction.SignOut}
		class="card column"
	>
		<section class="row wrap">
			<h3>Name</h3>

			{$page.data.user?.name}
		</section>

		<section class="row wrap">
			<h3>Email</h3>

			{$page.data.user?.email}
		</section>

		<section class="row wrap">
			<h3>Sign out</h3>

			<button
				class="destructive"
				type="submit"
			>Sign out</button>
		</section>
	</form>
</div>


<style>
	.container {
		display: grid;
		grid-template-columns: minmax(0, 30rem);
    	justify-content: center;
	}
</style>
