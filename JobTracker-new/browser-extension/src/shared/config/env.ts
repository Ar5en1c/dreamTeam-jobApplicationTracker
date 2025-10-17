export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://your-project.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'your-anon-key';

const normalizeUrl = (value: string) => value.replace(/\/+$/, '');

const rawWebAppUrl = import.meta.env.VITE_WEB_APP_URL?.trim();
const defaultWebAppUrl = import.meta.env.DEV ? 'http://localhost:5173' : 'https://jobtracker.app';

export const WEB_APP_URL = normalizeUrl(rawWebAppUrl && rawWebAppUrl.length > 0 ? rawWebAppUrl : defaultWebAppUrl);

export const SESSION_STORAGE_KEY = 'jobtracker.supabase.session';
