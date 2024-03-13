<script lang="ts">
	// Types
	import type { Table } from 'svelte-headless-table'
	type Datum = $$Generic<any>

	import type { MenuItems } from '$/lib/menus'
	type MenuItemValue = $$Generic<any>


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
		{#if !$rows.length}
			<caption class="placeholder">
				<slot />
			</caption>
		{/if}

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
								data-column="menu"
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
							on:keydown|self={e => ['Enter', 'Space'].includes(e.code) && onRowClick?.(datum)}
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
									data-column="menu"
								>
									<DropdownMenu
										items={contextMenu(datum)}
									>
										<svg width="14" height="14" viewBox="-5 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M2 0C2.39782 0 2.77936 0.158035 3.06066 0.43934C3.34196 0.720644 3.5 1.10218 3.5 1.5C3.5 1.89782 3.34196 2.27936 3.06066 2.56066C2.77936 2.84196 2.39782 3 2 3C1.60218 3 1.22064 2.84196 0.93934 2.56066C0.658035 2.27936 0.5 1.89782 0.5 1.5C0.5 1.10218 0.658035 0.720644 0.93934 0.43934C1.22064 0.158035 1.60218 0 2 0ZM2 5.5C2.39782 5.5 2.77936 5.65804 3.06066 5.93934C3.34196 6.22064 3.5 6.60218 3.5 7C3.5 7.39782 3.34196 7.77936 3.06066 8.06066C2.77936 8.34196 2.39782 8.5 2 8.5C1.60218 8.5 1.22064 8.34196 0.93934 8.06066C0.658035 7.77936 0.5 7.39782 0.5 7C0.5 6.60218 0.658035 6.22064 0.93934 5.93934C1.22064 5.65804 1.60218 5.5 2 5.5ZM3.5 12.5C3.5 12.1022 3.34196 11.7206 3.06066 11.4393C2.77936 11.158 2.39782 11 2 11C1.60218 11 1.22064 11.158 0.93934 11.4393C0.658035 11.7206 0.5 12.1022 0.5 12.5C0.5 12.8978 0.658035 13.2794 0.93934 13.5607C1.22064 13.842 1.60218 14 2 14C2.39782 14 2.77936 13.842 3.06066 13.5607C3.34196 13.2794 3.5 12.8978 3.5 12.5Z" fill="black"/>
										</svg>
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
					transition: var(--active-transitionOutDuration) var(--active-transitionOutDuration) var(--transition-easeOutExpo);
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
						transition: all var(--active-transitionInDuration), backdrop-filter none;
						opacity: 0;
						scale: 0.9;
					}
				}
			}
		}
	}

	th, td {
		padding: 1em;

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

		&.sticky {
			position: sticky;
			backdrop-filter: blur(20px);

			&:last-child {
				inset-inline-end: 0;
			}
		}
	}

	th[data-column="menu"] {
		width: 0;
	}
	td[data-column="menu"] {
		padding: 0;

		> :global(*) {
			padding: 1em;
			height: 100%;
		}
	}

	caption.placeholder {
		caption-side: bottom;
		padding: 1.5rem 1rem;

		text-align: center;
	}
</style>
