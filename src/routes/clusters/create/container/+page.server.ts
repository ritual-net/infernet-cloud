// Schema
import { superValidate } from 'sveltekit-superforms/server'
import { yup } from 'sveltekit-superforms/adapters'
import { FormData } from './schema'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	parent,
}) => {
	const data = await parent()

	const formData = await superValidate(yup(FormData))
		
	return {
		images: data.images,
		formData,
	}
}
