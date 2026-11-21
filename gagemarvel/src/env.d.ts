/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BOOKING_EMAIL?: string;
  readonly PUBLIC_FAN_EMAIL?: string;
  readonly PUBLIC_BOOKING_FORM_ENDPOINT?: string;
  readonly PUBLIC_FAN_FORM_ENDPOINT?: string;
  readonly PUBLIC_EMAIL_PROVIDER?: 'kit' | 'mailchimp' | 'netlify' | '';
  readonly PUBLIC_EMAIL_FORM_ACTION?: string;
  readonly PUBLIC_ANALYTICS_PROVIDER?: 'plausible' | 'ga4' | 'none' | '';
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_PLAUSIBLE_SCRIPT_SRC?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_BANDSINTOWN_ARTIST?: string;
  readonly SHOW_MERCH?: string;
  readonly ENABLE_CMS?: string;
  readonly ENABLE_BANDSINTOWN?: string;
  readonly SHOW_SAMPLE_CONTENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
