import { z } from 'zod'
import { superValidate } from 'sveltekit-superforms/server'
import type { Load } from '@sveltejs/kit'

const schema = z.object({
	'email': z
		.string()
		.email(),
})

export const load: Load = async () => {
	const form = await superValidate(schema)
  
	return { form }
}
