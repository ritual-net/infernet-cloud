<script lang="ts">
	// Types
	import type { Table } from 'svelte-headless-table'
	type Datum = $$Generic<any>


	// Imports
	export let data: Datum[]
	export let columns: Parameters<Table<Datum>['column']>[0][]
	export let contextMenu: ((_: Datum) => MenuItems<MenuItemValue>[]) | undefined
	export let getRowLink: ((_: Datum) => string | undefined) | undefined
	export let showMenuColumn = Boolean(contextMenu)


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
	import { goto } from '$app/navigation'

	export let onRowClick: ((_: Datum) => void) | undefined
		= datum => {
			const link = getRowLink?.(datum)
			if(link)
				goto(link)
		}


	// Components
	import { melt } from '@melt-ui/svelte'
	import ContextMenu from './ContextMenu.svelte'
	import DropdownMenu from './DropdownMenu.svelte'


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
								<th
									data-align="start"
									{...attrs}
								>
									<Render of={cell.render()} />
								</th>
							</Subscribe>
						{/each}

						{#if showMenuColumn}
							<th
								class="sticky"
								data-align="end"
							>
								Actions
							</th>
						{/if}
					</tr>
				</Subscribe>
			{/each}
		</thead>

		<tbody {...$tableBodyAttrs}>
			{#each $rows as row (getId?.(data[row.dataId]) ?? row.dataId)}
				{@const datum = data[row.dataId]}
				{@const link = getRowLink?.(data[row.dataId])}

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
							tabIndex={onRowClick || link ? 0 : undefined}
							on:click={() => onRowClick?.(datum)}
							on:keydown={e => ['Enter', 'Space'].includes(e.code) && onRowClick?.(datum)}
						>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<td
										{...attrs}
										data-align="start"
									>
										{#if link}
											<a href={link}>
												<Render of={cell.render()} />
											</a>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</td>
								</Subscribe>
							{/each}

							{#if contextMenu && showMenuColumn}
								<td
									class="sticky"
									data-align="end"
								>
									<DropdownMenu
										items={contextMenu(datum)}
									>
										• • •
									</DropdownMenu>
								</td>
							{/if}
						</tr>
					</ContextMenu>
				</Subscribe>
			{/each}
		</tbody>
	</table>
</div>


<style>
	div {
		overflow-x: auto;
		scroll-padding: var(--borderWidth);
	}

	table {
		width: 100%;
		margin-inline: calc(-1 * var(--borderWidth));

		border-collapse: separate;
		border-spacing: var(--borderWidth);
	}

	thead {
		font-size: 0.85em;

		& th {
			opacity: 0.5;
		}

		& tr {
			box-shadow: 0 var(--borderWidth) var(--borderColor);
		}
	}

	tbody {
		& tr {
			--table-row-backgroundColor: rgba(0, 0, 0, 0.03);

			box-shadow: 0 var(--borderWidth) var(--borderColor), 0 calc(-1 * var(--borderWidth)) var(--borderColor);

			&:nth-of-type(odd) {
				background-color: var(--table-row-backgroundColor);

				> td {
					box-shadow: var(--borderWidth) 0 var(--table-row-backgroundColor);
				}
			}

			&[tabIndex="0"] {
				cursor: pointer;

				transition: var(--active-transitionOutDuration) var(--transition-easeOutExpo);

				& td.sticky {
					transition: var(--active-transitionOutDuration) var(--transition-easeOutExpo);
				}

				&:hover {
					--table-row-backgroundColor: rgba(0, 0, 0, 0.05);
				}

				&:active:not(:has([tabindex="0"]:active)) {
					transition-duration: var(--active-transitionInDuration);
					opacity: var(--active-opacity);
					scale: var(--active-scale);

					box-shadow: none;

					& td.sticky {
						backdrop-filter: none;
						opacity: 0;
						scale: 0.5;
					}
				}
			}
		}
	}

	th, td {
		padding: 1em;

		&.sticky {
			position: sticky;
			backdrop-filter: blur(20px);

			&:last-child {
				inset-inline-end: 0;
			}
		}

		&[data-align="start"] {
			text-align: start;
			align-items: start;
			transform-origin: left;
		}
		&[data-align="end"] {
			text-align: end;
			align-items: end;
			transform-origin: right;
		}
	}
</style>
