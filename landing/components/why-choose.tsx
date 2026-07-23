"use client"

import { Zap, Radar, ShieldCheck, CreditCard, Wallet, Route, Headphones, Cpu } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Stagger, StaggerItem } from "@/components/reveal"

const features = [
  { icon: Zap, title: "Fast Delivery", body: "Optimised dispatch gets orders moving in seconds." },
  { icon: Radar, title: "Real-Time Tracking", body: "Follow every order live from pickup to your door." },
  { icon: ShieldCheck, title: "Trusted Drivers", body: "Verified, trained and rated on every trip." },
  { icon: CreditCard, title: "Secure Payments", body: "Encrypted checkout with multiple payment methods." },
  { icon: Wallet, title: "Affordable Prices", body: "Transparent pricing with no hidden surprises." },
  { icon: Route, title: "Smart Routing", body: "AI plots the fastest, most efficient route." },
  { icon: Headphones, title: "Reliable Support", body: "Real people ready to help, whenever you need." },
  { icon: Cpu, title: "AI-Powered Dispatch", body: "Machine learning matches the right driver instantly." },
]

export function WhyChoose() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Empire"
          title="Built to be fast, reliable and effortless"
          description="Every feature is engineered to give customers, businesses and drivers a delivery experience they can depend on."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-xl">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary-foreground/15 group-hover:text-primary-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold text-foreground transition-colors group-hover:text-primary-foreground">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-primary-foreground/80">
                  {f.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
