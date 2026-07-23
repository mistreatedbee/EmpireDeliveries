"use client"

import Image from "next/image"
import { Target, Eye, HeartHandshake, CheckCircle2 } from "lucide-react"
import { Reveal, Stagger, StaggerItem } from "@/components/reveal"

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    body: "To make everyday deliveries simple, affordable, reliable, and accessible while empowering local businesses and creating earning opportunities.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "To become Africa's leading on-demand delivery ecosystem by connecting people, businesses, and communities through logistics technology.",
  },
  {
    icon: HeartHandshake,
    title: "Our Promise",
    body: "Customer first, always. We build trust through transparency, safety, and reliability on every single order.",
  },
]

const values = [
  "Customer First",
  "Innovation",
  "Trust",
  "Reliability",
  "Community",
  "Safety",
  "Transparency",
  "Sustainability",
  "Accessibility",
]

export function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal direction="right">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/community.png"
                alt="A local business owner using Empire Deliveries to reach more customers"
                width={720}
                height={720}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 max-w-[220px] rounded-2xl border border-border bg-card p-4 shadow-xl">
              <p className="font-display text-2xl font-bold text-foreground">1 platform</p>
              <p className="text-sm text-muted-foreground">connecting customers, businesses, drivers & communities</p>
            </div>
          </div>
        </Reveal>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            About Empire Deliveries
          </span>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
              More than deliveries — a technology company transforming local commerce
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              We exist to remove the barriers between what people need and getting it delivered. Our intelligent
              dispatch, real-time tracking, and secure payments help communities access food, groceries, medicine and
              more — while giving local businesses and drivers the tools to grow.
            </p>
          </Reveal>

          <Stagger className="mt-8 grid gap-4">
            {pillars.map((p) => (
              <StaggerItem key={p.title}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <p.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="mt-8">
            <div className="flex flex-wrap gap-2">
              {values.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  <CheckCircle2 className="size-3.5 text-accent" />
                  {v}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
