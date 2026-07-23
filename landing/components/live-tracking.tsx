"use client"

import { motion } from "motion/react"
import { MapPin, Navigation, Clock, CheckCircle2, Bike } from "lucide-react"
import { Reveal } from "@/components/reveal"

const stages = [
  { label: "Order confirmed", done: true },
  { label: "Preparing your order", done: true },
  { label: "Driver on the way", done: true, active: true },
  { label: "Delivered", done: false },
]

const features = [
  { icon: Navigation, title: "Live GPS", body: "See your driver move on the map in real time." },
  { icon: Clock, title: "Accurate ETAs", body: "Smart predictions update as conditions change." },
  { icon: MapPin, title: "Route animation", body: "Follow the optimised path from pickup to drop-off." },
]

export function LiveTracking() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Real-Time Tracking
          </span>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
              Always know exactly where your order is
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              Our live dashboard shows driver movement, estimated arrival and every delivery stage — so you&apos;re never
              left guessing.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={0.1 + i * 0.08}>
                <div className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal direction="left">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Order #EMP-2048</p>
                <p className="text-xs text-muted-foreground">Estimated arrival · 8:42 PM</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" /> On the way
              </span>
            </div>

            <div className="relative mt-5 h-52 overflow-hidden rounded-2xl bg-secondary">
              <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-40" />
              <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full" fill="none">
                <path
                  d="M40 180 C 120 180, 130 70, 210 90 S 320 170, 360 50"
                  stroke="var(--border)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M40 180 C 120 180, 130 70, 210 90 S 320 170, 360 50"
                  stroke="var(--brand-blue)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 0.72 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.4, ease: "easeInOut" }}
                />
                <circle cx="40" cy="180" r="8" fill="var(--brand-emerald)" />
                <g>
                  <circle cx="360" cy="50" r="8" fill="var(--brand-orange)" />
                </g>
                <motion.g
                  initial={{ offsetDistance: "0%" }}
                  whileInView={{ offsetDistance: "72%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.4, ease: "easeInOut" }}
                  style={{ offsetPath: "path('M40 180 C 120 180, 130 70, 210 90 S 320 170, 360 50')" } as React.CSSProperties}
                >
                  <circle r="14" fill="var(--brand-blue)" opacity="0.2" />
                  <circle r="9" fill="var(--brand-blue)" />
                </motion.g>
              </svg>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 backdrop-blur">
                <Bike className="size-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Thabo · 4 min away</span>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {stages.map((stage) => (
                <li key={stage.label} className="flex items-center gap-3">
                  <span
                    className={
                      "flex size-6 items-center justify-center rounded-full " +
                      (stage.done ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground")
                    }
                  >
                    {stage.done ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <span className="size-2 rounded-full bg-muted-foreground/50" />
                    )}
                  </span>
                  <span
                    className={
                      "text-sm " +
                      (stage.active
                        ? "font-semibold text-foreground"
                        : stage.done
                          ? "text-foreground"
                          : "text-muted-foreground")
                    }
                  >
                    {stage.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
