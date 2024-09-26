<script lang="ts" context="module">
	// Types/constants
	export type Theme = 'light' | 'dark' | 'auto'
</script>

<script lang="ts">
	// Types/constants
	const themeOverrideKey = 'themeOverride'


	// Context
	import { browser } from '$app/environment'

	import { readable } from 'svelte/store'

	const prefersDark = readable(false, set => {
		if(!browser) return

		const mediaQuery = globalThis.matchMedia?.('(prefers-color-scheme: dark)')
		set(mediaQuery.matches)

		const controller = new AbortController()

		mediaQuery.addEventListener(
			'change',
			(event) => { set(event.matches) },
			{ signal: controller.signal },
		)

		return () => controller.abort()
	})

	const themeOverride = readable(
		globalThis.localStorage?.getItem(themeOverrideKey) as Theme,

		set => {
			if(!browser) return

			const controller = new AbortController()

			globalThis.addEventListener(
				'storage',
				(event) => {
					if (event instanceof StorageEvent && event.key === themeOverrideKey)
						set(event.newValue as Theme)
				},
				{ signal: controller.signal },
			)

			return () => controller.abort()
		},
	)


	// Outputs
	export let currentTheme: Theme = $themeOverride || ($prefersDark ? 'dark' : 'light')


	// Components
	import Switch from '$/components/Switch.svelte'
</script>


<Switch
	checked={currentTheme === 'dark'}
	onChange={({ next: checked }) => {
		const theme = checked ? 'dark' : 'light'
		currentTheme = theme
		globalThis.localStorage?.setItem(themeOverrideKey, theme)
		return checked
	}}
/>
