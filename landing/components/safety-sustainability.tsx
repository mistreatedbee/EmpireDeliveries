"use client"

import {
  ShieldCheck,
  BadgeCheck,
  Lock,
  MapPin,
  Camera,
  Headphones,
  Siren,
  EyeOff,
  Leaf,
  Route,
  Recycle,
  Handshake,
} from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Stagger, StaggerItem } from "@/components/reveal"

const safety = [
  { icon: BadgeCheck, label: "Driver verification" },
  { icon: ShieldCheck, label: "Identity checks" },
  { icon: Lock, label: "Secure payments" },
  { icon: MapPin, label: "Live tracking" },
  { icon: Camera, label: "Proof of delivery" },
  { icon: Headphones, label: "Customer support" },
  { icon: Siren, label: "Emergency reporting" },
  { icon: EyeOff, label: "Privacy protection" },
]

const sustainability = [
  { icon: Route, label: "Smart route optimization" },
  { icon: Leaf, label: "Reduced unnecessary travel" },
  { icon: Recycle, label: "Eco-friendly initiatives" },
  { icon: Handshake, label: "Community partnerships" },
]

export function SafetySustainability() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Safety & Trust"
              title="Safety built into every delivery"
              description="From verified drivers to secure payments and emergency support, trust is engineered into the entire experience."
            />
            <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {safety.map((s) => (
                <StaggerItem key={s.label}>
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <s.icon className="size-5" />
                    </span>
                    <span className="font-medium text-foreground">{s.label}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="rounded-3xl border border-border bg-accent/5 p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Leaf className="size-6" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold text-foreground">Sustainability</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We&apos;re building a more efficient, greener delivery network for the future.
            </p>
            <ul className="mt-6 space-y-3">
              {sustainability.map((s) => (
                <li key={s.label} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <s.icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
