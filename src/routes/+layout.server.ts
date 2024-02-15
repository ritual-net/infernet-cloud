import type { ServerLoad } from "@sveltejs/kit"

export const load: ServerLoad = ({
	locals: { isSignedIn },
}) => {
	return {
		isSignedIn,
	}
}
