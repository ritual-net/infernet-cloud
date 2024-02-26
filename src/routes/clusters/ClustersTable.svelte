<script lang="ts">
	// Types
	import type { getClustersForUser } from '$/lib/db/queries'
	import { resolveRoute } from '$app/paths';


	// Inputs
	export let clusters: Awaited<ReturnType<typeof getClustersForUser>>


	// Components
	import Table from '$components/Table.svelte'
</script>


<Table
	data={clusters}
	columns={[
		{
			header: 'Id',
			accessor: d => d.id,
		},
		{
			header: 'Name',
			accessor: d => d.name,
		},
	]}
	getRowLink={cluster => (
		resolveRoute(`/clusters/[clusterId]`, { clusterId: cluster.id })
	)}
/>
