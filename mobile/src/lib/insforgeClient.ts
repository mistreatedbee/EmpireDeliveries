import { createClient } from '@insforge/sdk';
import { Config } from '@/constants/config';

export const insforge = createClient({
  baseUrl: Config.INSFORGE_URL,
  anonKey: Config.INSFORGE_ANON_KEY,
});

export function setInsforgeSessionToken(token: string | null) {
  insforge.setAccessToken(token);
}
