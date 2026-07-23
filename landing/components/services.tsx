"use client"

import { UtensilsCrossed, ShoppingCart, Pill, Store, Package, Truck, ArrowUpRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Stagger, StaggerItem } from "@/components/reveal"

const services = [
  {
    icon: UtensilsCrossed,
    title: "Food Delivery",
    body: "Fresh meals from your favourite local restaurants delivered quickly and hot.",
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ShoppingCart,
    title: "Groceries",
    body: "Everything from supermarkets and township stores, at your door in minutes.",
    accent: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    body: "Safe, discreet healthcare and medicine deliveries when you need them most.",
    accent: "text-brand-orange",
    bg: "bg-brand-orange/10",
  },
  {
    icon: Store,
    title: "Retail Shopping",
    body: "Shop local stores and boutiques and get your purchases delivered same-day.",
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Package,
    title: "Courier",
    body: "Send documents and parcels across town with live tracking and proof of delivery.",
    accent: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Truck,
    title: "Business Logistics",
    body: "Scalable delivery solutions and fleet support built for growing businesses.",
    accent: "text-brand-orange",
    bg: "bg-brand-orange/10",
  },
]

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="One app for everything you need delivered"
          description="From meals to medicine, Empire Deliveries powers every category of on-demand delivery on a single intelligent platform."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.title}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <span className={`flex size-12 items-center justify-center rounded-2xl ${s.bg} ${s.accent}`}>
                  <s.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowUpRight className="size-4" />
                </span>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
