import type { APIRoute } from 'astro';
import { defaultOg } from '@/lib/og';

/** The site-wide default share image: /og-default.png */
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await defaultOg()), { headers: { 'Content-Type': 'image/png' } });
