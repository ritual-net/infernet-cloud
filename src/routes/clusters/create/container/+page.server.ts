// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	parent,
	request,
}) => {
	const data = await parent()

	const formData = await superValidate(request, zod(FormData))
		
	return {
		images: data.images,
		formData,
	}
}
