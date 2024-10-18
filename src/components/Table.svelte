<script lang="ts">
	// Types
	import type { Table } from 'svelte-headless-table'
	type Datum = $$Generic<any>

	import type { MenuItems } from '$/lib/menus'
	type MenuItemValue = $$Generic<any>


	// Inputs
	export let data: Datum[] | Promise<Datum[]> | undefined
	export let getId: (_: Datum) => any
	export let columns: Parameters<Table<Datum>['column']>[0][]
	export let contextMenu: ((_: Datum) => MenuItems<MenuItemValue>[]) | undefined
	export let getRowLink: ((_: Datum) => string | undefined) | undefined
	export let showMenuColumn = Boolean(contextMenu)
	export let showMenuColumnLabel = false

	// (View options)
	export let layout: 'default' | 'card' = 'default'


	// Internal state
	import { writable } from 'svelte/store'
	import { createTable, Subscribe, Render } from 'svelte-headless-table'

	let resolvedData: Datum[] | undefined = undefined
	$: Promise.resolve(data).then(data => { resolvedData = data })

	const _data = writable<Datum[]>([])
	$: $_data = resolvedData ?? []

	const table = createTable(_data)

	const { headerRows, rows, tableAttrs, tableBodyAttrs } = table.createViewModel(
		table.createColumns(
			columns.map(table.column)
		)
	)


	// Events
	import { goto, preloadData } from '$app/navigation'

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
	import SizeTransition from './SizeTransition.svelte'


	// Transitions/animations
	import { scale } from 'svelte/transition'
</script>


<div data-layout={layout}>
	<table {...$tableAttrs}>
		{#if !resolvedData || !$rows.length}
			<caption class="placeholder">
				<SizeTransition>
					<div class="stack">
						{#await data}
							<div class="card loading" transition:scale>
								<slot name="loading">
									<p>Loading data...</p>
								</slot>
							</div>
						{:then}
							<slot name="empty">
								No data found.
							</slot>
						{:catch error}
							<div class="card error" transition:scale>
								<slot name="error" {error}>
									<p>Error loading data: {error.message}</p>
								</slot>

								<pre><output><code>{error}</code></output></pre>
							</div>
						{/await}
					</div>
				</SizeTransition>
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
								<span hidden={!showMenuColumnLabel}>Actions</span>
							</th>
						{/if}
					</tr>
				</Subscribe>
			{/each}
		</thead>

		<tbody {...$tableBodyAttrs}>
			{#each $rows as row (getId?.($_data[row.dataId]) ?? row.dataId)}
				{@const datum = $_data[row.dataId]}
				{@const link = getRowLink?.($_data[row.dataId])}

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
							on:mouseenter={link && (() => preloadData(link))}
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
									/>
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
	:root {
		--table-layoutDefault-backgroundColor: transparent;
		--table-layoutDefault-outerBorderColor: transparent;

		--table-layoutCard-backgroundColor: light-dark(#fff, #1a1a1a);
		--table-layoutCard-outerBorderColor: var(--borderColor);
	}

	div {
		--table-backgroundColor: var(--table-layoutDefault-backgroundColor);
		--table-outerBorderColor: var(--table-layoutDefault-outerBorderColor);
		--table-borderWidth: var(--borderWidth);
		--table-cornerRadius: 0.33em;

		&[data-layout="card"] {
			--table-backgroundColor: var(--table-layoutCard-backgroundColor);
			--table-outerBorderColor: var(--table-layoutCard-outerBorderColor);
		}

		overflow-x: auto;
		scroll-padding: var(--borderWidth);

		background-color: var(--table-backgroundColor);
		box-shadow: 0 0 0 var(--table-borderWidth) var(--table-outerBorderColor) inset;
		border-radius: var(--table-cornerRadius);
	}

	table {
		min-width: 100%;
		width: max-content;
		margin-inline: calc(-1 * var(--borderWidth));

		border-collapse: separate;
		border-spacing: var(--borderWidth);
	}

	thead {
		font-size: 0.85em;
		text-wrap: nowrap;

		& th {
			color: color-mix(in oklch, currentColor 50%, transparent);
		}

		& tr {
			box-shadow: 0 var(--borderWidth) var(--borderColor);
		}
	}

	tbody {
		& tr {
			--table-row-backgroundColor: light-dark(rgba(0, 0, 0, 0.03), rgba(255, 255, 255, 0.03));

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
					--table-row-backgroundColor: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.05));
				}

				&:active:not(:has([tabindex="0"]:active)) {
					transition-duration: var(--active-transitionInDuration);
					opacity: var(--active-opacity);
					scale: var(--active-scale);

					&:active {
						--borderColor: transparent;
					}

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

	th,
	td {
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

			&:is(th:not(:has(> :not([hidden])))) {
				opacity: 0;
			}

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

		> :global(button) {
			--button-backgroundColor: transparent;
			--button-borderWidth: 0;
			--button-paddingY: 1em;
			--button-paddingX: 1em;
			width: 100%;
			height: 100%;
			text-align: end;
		}
	}

	caption.placeholder {
		caption-side: bottom;
		padding: 1.5rem 1rem;

		text-align: center;
	}
</style>
