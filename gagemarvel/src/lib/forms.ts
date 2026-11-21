/**
 * Shared behaviour for the contact forms (booking + fan message).
 *
 * - Validates in the browser with clear, specific messages tied to each field
 *   (aria-invalid + aria-describedby), and moves focus to the first problem.
 * - Submits with fetch so the visitor stays on the page and sees a success
 *   message, no redirect.
 * - Destination: Netlify Forms by default. If the form has data-endpoint (for
 *   example a Formspree URL from PUBLIC_*_FORM_ENDPOINT), it posts there
 *   instead. Swapping providers is a config change, not a code change.
 */
import { track } from './analytics';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function messageFor(f: Field): string {
  const v = f.validity;
  const label = f.dataset.label ?? 'This field';
  if (v.valueMissing) {
    if (f instanceof HTMLSelectElement) return `Choose your ${label.toLowerCase()}.`;
    return `Enter your ${label.toLowerCase()}.`;
  }
  if (v.typeMismatch && f.type === 'email') return 'Enter a valid email, like name@example.com.';
  if (v.rangeUnderflow && f.type === 'date') return 'Pick a date that is today or later.';
  if (v.patternMismatch) return f.dataset.patternMessage ?? `Check the ${label.toLowerCase()}.`;
  // Checked by hand: browsers only flag tooShort after the user edits a field.
  const min = Number(f.getAttribute('minlength') ?? 0);
  if (min && f.value.trim().length < min)
    return `Add a little more detail (at least ${min} characters).`;
  return '';
}

function setError(f: Field, msg: string) {
  const out = document.getElementById(`${f.id}-error`);
  if (!out) return;
  out.textContent = msg;
  out.hidden = !msg;
  if (msg) f.setAttribute('aria-invalid', 'true');
  else f.removeAttribute('aria-invalid');
}

export function initForm(form: HTMLFormElement) {
  const fields = [...form.querySelectorAll<Field>('input, select, textarea')].filter(
    (f) => f.name !== 'bot-field' && f.type !== 'hidden',
  );
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  fields.forEach((f) => {
    f.addEventListener('blur', () => {
      if (f.value || f.hasAttribute('aria-invalid')) setError(f, messageFor(f));
    });
    f.addEventListener('input', () => {
      if (f.hasAttribute('aria-invalid')) setError(f, messageFor(f));
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstBad: Field | undefined;
    for (const f of fields) {
      const msg = messageFor(f);
      setError(f, msg);
      if (msg && !firstBad) firstBad = f;
    }
    if (firstBad) {
      status.textContent = 'Please fix the highlighted fields.';
      firstBad.focus();
      return;
    }
    const data = new FormData(form);
    if (data.get('bot-field')) return; // honeypot: quietly drop bots

    button.disabled = true;
    status.textContent = 'Sending...';
    try {
      const endpoint = form.dataset.endpoint;
      const res = endpoint
        ? await fetch(endpoint, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' },
          })
        : await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
          });
      if (!res.ok) throw new Error(String(res.status));
      if (form.dataset.event) track(form.dataset.event);
      form.querySelector<HTMLElement>('[data-fields]')!.hidden = true;
      const ok = form.querySelector<HTMLElement>('[data-success]')!;
      ok.hidden = false;
      ok.focus();
    } catch {
      status.textContent = 'Sorry, that did not go through. Please try again in a moment.';
      button.disabled = false;
    }
  });
}
