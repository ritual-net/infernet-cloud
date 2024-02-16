<script lang="ts">
	// Types
	import type { Table } from 'svelte-headless-table'
	type Datum = $$Generic<any>

	import type { MenuItems } from '$/lib/menus'
	type MenuItemValue = $$Generic<any>


	// Imports
	export let data: Datum[]
	export let getId: (_: Datum) => any
	export let columns: Parameters<Table<Datum>['column']>[0][]
	export let contextMenu: ((_: Datum) => MenuItems<MenuItemValue>[]) | undefined


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


	// Events
	export let onRowClick: ((_: Datum) => void) | undefined


	// Components
	import { melt } from '@melt-ui/svelte'
	import ContextMenu from './ContextMenu.svelte'


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
			{#each $rows as row (getId?.(data[row.dataId]) ?? row.dataId)}
				{@const datum = data[row.dataId]}

				<Subscribe
					rowAttrs={row.attrs()} let:rowAttrs
				>
					<ContextMenu
						items={contextMenu?.(datum)}
						let:trigger
						let:labelText
					>
						<tr
							{...rowAttrs}
							transition:scale={{ opacity: 0, start: 0.8 }}
							use:melt={trigger}
							aria-label={labelText}
							tabIndex={onRowClick ? 0 : undefined}
							on:click={() => onRowClick?.(datum)}
							on:keydown={e => ['Enter', 'Space'].includes(e.code) && onRowClick?.(datum)}
						>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<td {...attrs}>
										<Render of={cell.render()} />
									</td>
								</Subscribe>
							{/each}
						</tr>
					</ContextMenu>
				</Subscribe>
			{:else}
				<div class="placeholder">
					<slot />
				</div>
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

		&:nth-of-type(odd) {
			background-color: rgba(0, 0, 0, 0.03);
		}
	}

	th, td {
		padding: 1em;
	}

	thead th {
		opacity: 0.5;
	}

	.placeholder {
		padding: 0.5rem 1rem;
		opacity: 0.5;
	}
</style>
