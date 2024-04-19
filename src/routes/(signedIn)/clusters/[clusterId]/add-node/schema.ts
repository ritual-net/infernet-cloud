import * as z from 'yup'


import { Node } from '$/routes/(signedIn)/clusters/create/schema'

export const FormData = z
	.object({
		'clusterId': z.
			string()
			.required(),

		'node': Node
			.required(),
    })
