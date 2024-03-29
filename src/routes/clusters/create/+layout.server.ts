import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
	request,
	fetch,
}) => {
	const images = [
		'ritualnet/llm-inference:0.0.1',
	]

	return {
		images,
	}
}
