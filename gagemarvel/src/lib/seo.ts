import { site, social, streaming, activeLinks } from '@/config/site';

/** JSON-LD describing Gage as a music act, for the home and about pages. */
export function musicGroupLd() {
  const sameAs = [...activeLinks(social), ...activeLinks(streaming)]
    .map(([, url]) => url)
    .filter((u) => !u.includes('#todo-content'));
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: site.name,
    url: site.url,
    genre: 'Country',
    ...(sameAs.length ? { sameAs: [...new Set(sameAs)] } : {}),
  };
}
