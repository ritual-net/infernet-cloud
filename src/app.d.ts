import type { Client } from 'edgedb';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			client: Client;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
