<script lang="ts">
	// Context
	let clusters = [
		{ id: '1', name: 'Cluster A' },
		{ id: '2', name: 'Cluster B' },
	]


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
/>
