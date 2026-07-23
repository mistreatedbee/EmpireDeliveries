import Link from "next/link"
import { Logo } from "@/components/logo"
import { Send, Instagram, Linkedin, Facebook, Youtube } from "@/components/social-icons"

const columns = [
  {
    title: "Services",
    links: ["Food Delivery", "Grocery", "Pharmacy", "Retail", "Courier", "Enterprise Logistics"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Newsroom", "Community Impact", "Sustainability", "Contact"],
  },
  {
    title: "For Partners",
    links: ["Become a Driver", "List Your Business", "Enterprise", "API & Developers", "Partner Support"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Safety", "Trust & Security", "Blog", "Press Kit"],
  },
]

const socials = [
  { icon: Send, label: "X (Twitter)" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo className="text-white" />
            <p className="mt-5 text-pretty leading-relaxed text-white/60">
              Empire Deliveries is building Africa&apos;s most trusted on-demand delivery network — connecting
              customers, businesses, drivers, and communities through world-class technology.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-brand-blue hover:text-white"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Empire Deliveries. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
