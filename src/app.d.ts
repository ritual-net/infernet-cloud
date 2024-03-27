import type { Client } from 'edgedb'

import type { User } from '$schema/interfaces'
import type ContainerForm from '$/routes/clusters/create/container/+page.svelte'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}

		interface Locals {
			client: Client;
			user: User;
		}

		interface PageData {
			flash?: {
				type: 'success' | 'error',
				message: {
					title?: string,
					description?: string,
				},
			};
		}

		interface PageState {
			showContainerForm?: 'create' | 'edit',
			nodeId: string,
			containerId: string,
			containerFormData?: ContainerForm['$$prop_def']['data'],
		}

		// interface Platform {}

		namespace Superforms {
			type Message = {
				title?: string,
				description?: string,
			}
		}
	}
}

export {}
