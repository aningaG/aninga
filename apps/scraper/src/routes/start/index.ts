import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
    console.log(data);
	return {status: 201};
};