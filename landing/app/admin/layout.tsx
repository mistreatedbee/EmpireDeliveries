import type { Metadata } from "next"
import { AdminProviders } from "./providers"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>
}
