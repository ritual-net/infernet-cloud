// Data
import { schema } from './schema'
import { superValidate } from 'sveltekit-superforms/server'


// Server functions
import { fail, type Actions, type Load } from '@sveltejs/kit'

import { POST as createCluster } from '../../api/cluster/+server'

export const load: Load = async () => {
	const form = await superValidate(schema)
  
	return { form }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, schema)

		if (!form.valid) {
			return fail(400, { form })
		}

		const result = await createCluster(event)

		console.log({result})

		return {
			form,
			result,
		}
	},
}
