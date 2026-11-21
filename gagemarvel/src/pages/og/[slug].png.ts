import type { APIRoute, GetStaticPaths } from 'astro';
import { getSongs } from '@/lib/content';
import { songOg } from '@/lib/og';
import type { Song } from '@/lib/music';

/** Share image for each release: /og/<slug>.png */
export const getStaticPaths = (async () =>
  (await getSongs()).map((song) => ({
    params: { slug: song.id },
    props: { song },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ song: Song }> = async ({ props }) =>
  new Response(new Uint8Array(await songOg(props.song)), {
    headers: { 'Content-Type': 'image/png' },
  });
