// Data
import type { PageServerLoad } from './$types'
import { FormData } from './schema'
import { superValidate } from 'sveltekit-superforms/server'


// Server functions
import { fail, type Actions, type Load } from '@sveltejs/kit'

// import { POST as createCluster } from '../../api/cluster/+server'

export const load: PageServerLoad = async () => {
	const form = await superValidate(FormData)
  
	return { form }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, FormData)

		console.log({form})

		if (!form.valid) {
			return fail(400, { form })
		}

		// const result = await createCluster(event)
		const result = await event.fetch('/api/cluster', {
			method: 'POST',
			body: JSON.stringify(form.data),
		})
			.then(response => response.json())

		console.log({result})

		return {
			form,
			result,
		}
	},
}
