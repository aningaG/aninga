import type { RequestHandler } from './$type';

export const POST: RequestHandler = async ({request}) =>{
    const { interval, starter, current } = await request.json();
}