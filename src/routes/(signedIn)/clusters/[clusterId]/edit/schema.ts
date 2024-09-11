import * as z from 'yup'
import { ClusterConfig, RouterConfig } from '../../create/schema'

export const FormData = z
	.object({
		'config': ClusterConfig,

		'router': RouterConfig
			.when(
				'config',
				([config], _) => (
					config?.deploy_router
						? _.required()
						: _.shape(
							Object.fromEntries(
								Object.entries(RouterConfig.fields)
									.map(([key, value]) => (
										[
											key,
											value.optional(),
										]
									))
							)
						)
							.notRequired()
				),
			),
	})
