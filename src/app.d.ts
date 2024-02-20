import type { Client } from 'edgedb'

import type ContainerForm from '$/routes/clusters/create/container/+page.svelte'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}

		interface Locals {
			client: Client;
			isSignedIn: boolean;
		}

		// interface PageData {}

		interface PageState {
			showContainerForm?: 'create' | 'edit',
			nodeId: string,
			containerId: string,
			containerFormData?: ContainerForm['$$prop_def']['data'],
		}

		// interface Platform {}
	}
}

export {}
