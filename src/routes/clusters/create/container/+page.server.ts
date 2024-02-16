// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	request,
}) => {
	const formData = await superValidate(request, zod(FormData))
		
	return {
		formData,
	}
}
