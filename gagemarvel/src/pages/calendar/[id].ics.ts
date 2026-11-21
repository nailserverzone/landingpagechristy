import type { APIRoute, GetStaticPaths } from 'astro';
import { getShows } from '@/lib/content';
import { showIcs, type Show } from '@/lib/shows';

/** One downloadable calendar file per upcoming show: /calendar/<id>.ics */
export const getStaticPaths = (async () => {
  const { upcoming } = await getShows();
  return upcoming.map((show) => ({ params: { id: show.id }, props: { show } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ show: Show }> = ({ props }) =>
  new Response(showIcs(props.show), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="gage-marvel-${props.show.id}.ics"`,
    },
  });
