import * as z from 'yup'
import { ClusterConfig, RouterConfig } from '../../create/schema'

export const FormData = z
	.object({
		'config': ClusterConfig,

		'router': RouterConfig,
	})
