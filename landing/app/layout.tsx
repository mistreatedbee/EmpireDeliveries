import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const siteUrl = "https://empire-deliveries-psi.vercel.app"
const ogImageUrl = `${siteUrl}/og-preview.svg`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Empire Deliveries — Everything You Need. Delivered.",
    template: "%s | Empire Deliveries",
  },
  description:
    "Empire Deliveries connects customers, businesses, and drivers through one intelligent platform for food delivery, groceries, pharmacy, retail, and courier logistics across Africa.",
  applicationName: "Empire Deliveries",
  generator: "v0.app",
  keywords: [
    "Empire Deliveries",
    "delivery app",
    "food delivery",
    "grocery delivery",
    "pharmacy delivery",
    "courier",
    "logistics",
    "Africa delivery platform",
  ],
  authors: [{ name: "Empire Deliveries" }],
  creator: "Empire Deliveries",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Empire Deliveries — Everything You Need. Delivered.",
    description:
      "One intelligent delivery ecosystem connecting customers, businesses, drivers, and communities across Africa.",
    siteName: "Empire Deliveries",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Empire Deliveries social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empire Deliveries — Everything You Need. Delivered.",
    description:
      "One intelligent delivery ecosystem connecting customers, businesses, drivers, and communities across Africa.",
    site: "@empiredeliveries",
    creator: "@empiredeliveries",
    images: [ogImageUrl],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/apple-icon.png", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
