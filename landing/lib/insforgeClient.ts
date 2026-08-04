import { createClient } from '@insforge/sdk'

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
})

export function setInsforgeSessionToken(token: string | null) {
  insforge.setAccessToken(token)
}
