// Schema
import { superValidate } from 'sveltekit-superforms/server';
import { yup } from 'sveltekit-superforms/adapters';
import { FormData } from './schema';

// Data
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	const formData = await superValidate(yup(FormData));

	return {
		imagesPromise: parentData.imagesPromise,
		formData,
	};
};

export const actions: Actions = {
	default: async () => {
		redirect(301, '/clusters/create');
	},
};
