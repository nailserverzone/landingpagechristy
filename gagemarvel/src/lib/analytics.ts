/**
 * One tiny wrapper so components never care which analytics tool is active.
 * Works with Plausible (window.plausible) or GA4 (window.gtag) and silently
 * does nothing when neither is loaded (local dev, ad blockers).
 * Full event list: README.md > Analytics event glossary.
 */
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: ((event: string, opts?: { props?: Props; callback?: () => void }) => void) & {
      q?: unknown[];
    };
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Props = {}) {
  try {
    if (typeof window.plausible === 'function') window.plausible(event, { props });
    else if (typeof window.gtag === 'function') window.gtag('event', event, props);
    if (import.meta.env.DEV) console.info('[analytics]', event, props);
  } catch {
    /* analytics must never break the page */
  }
}
