<script lang="ts">
	// Context
	import { page } from '$app/stores'


	// Actions
	$: console.error($page.error)
</script>


<main>
	<h3>There was a problem loading the page.</h3>

	<div class="card column inine">
		<p><code>{$page.error?.message}</code></p>

		<p>Status: {JSON.stringify($page.status)}</p>
	</div>
</main>
