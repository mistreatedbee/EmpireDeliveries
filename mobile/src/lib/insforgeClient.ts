import { createClient } from '@insforge/sdk';
import { Config } from '@/constants/config';

const anonKey = Config.INSFORGE_ANON_KEY?.trim();

export const insforge = createClient({
  baseUrl: Config.INSFORGE_URL,
  anonKey: anonKey || '',
});

export function setInsforgeSessionToken(token: string | null) {
  insforge.setAccessToken(token);
}
