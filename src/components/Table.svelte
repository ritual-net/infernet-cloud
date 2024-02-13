<script lang="ts">
	// Types
	import type { Table } from 'svelte-headless-table'
	type Datum = $$Generic<any>


	// Imports
	export let data: Datum[]
	export let columns: Parameters<Table<Datum>['column']>[0][]


	// Internal state
	import { writable } from 'svelte/store'
	import { createTable, Subscribe, Render } from 'svelte-headless-table'
	
	const _data = writable(data)
	$: $_data = data

	const table = createTable(_data)

	const { headerRows, rows, tableAttrs, tableBodyAttrs } = table.createViewModel(
		table.createColumns(
			columns.map(table.column)
		)
	)


	// Transitions/animations
	import { scale } from 'svelte/transition'
</script>


<div>
	<table {...$tableAttrs}>
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<th {...attrs}>
									<Render of={cell.render()} />
								</th>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</thead>

		<tbody {...$tableBodyAttrs}>
			{#each $rows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<tr {...rowAttrs} transition:scale={{ opacity: 0, start: 0.8 }}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<td {...attrs}>
									<Render of={cell.render()} />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>
</div>


<style>
	div {
		overflow-x: auto;
	}

	table {
		border-spacing: var(--border-width);
		width: 100%;
	}

	thead {
		font-size: 0.85em;
	}

	tbody tr {
		box-shadow: 0 var(--border-width) var(--border-color), 0 calc(-1 * var(--border-width)) var(--border-color);

		&:nth-child(odd) {
			background-color: rgba(0, 0, 0, 0.03);
		}
	}

	th, td {
		padding: 1em;
	}

	thead th {
		opacity: 0.5;
	}
</style>
