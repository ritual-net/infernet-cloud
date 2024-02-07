// Schema
import { FormData } from './schema'
import { superValidate } from 'sveltekit-superforms/server'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	request,
}) => {
	const formData = await superValidate(request, FormData)
		
	return {
		formData,
	}
}
