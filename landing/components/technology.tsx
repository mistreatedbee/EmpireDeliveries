"use client"

import { Cloud, Cpu, Route, BarChart3, ShieldCheck, Layers, Zap, Activity } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Stagger, StaggerItem } from "@/components/reveal"

const tech = [
  { icon: Cloud, title: "Cloud infrastructure", body: "Elastic, globally distributed and always available." },
  { icon: Cpu, title: "AI dispatching", body: "Machine learning matches orders to the ideal driver." },
  { icon: Route, title: "Smart routing", body: "Real-time route optimisation cuts delivery times." },
  { icon: BarChart3, title: "Real-time analytics", body: "Live insights for businesses and operations teams." },
  { icon: ShieldCheck, title: "Secure APIs", body: "Encrypted, authenticated and rate-limited by design." },
  { icon: Layers, title: "Scalable architecture", body: "Built to handle millions of orders without breaking." },
  { icon: Activity, title: "High availability", body: "Resilient systems engineered for 99.9% uptime." },
  { icon: Zap, title: "Reliable infrastructure", body: "Monitored around the clock for peak performance." },
]

export function Technology() {
  return (
    <section className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Technology"
          title="The intelligent engine behind every delivery"
          description="A modern, secure and scalable platform designed to power delivery across an entire continent."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tech.map((t) => (
            <StaggerItem key={t.title}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <t.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold text-foreground">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
