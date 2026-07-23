"use client"

import Image from "next/image"
import { Lightbulb, TrendingUp, GraduationCap, Users, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

const culture = [
  { icon: Lightbulb, title: "Innovation", body: "We move fast and build boldly." },
  { icon: TrendingUp, title: "Growth", body: "Grow your career as we scale." },
  { icon: GraduationCap, title: "Learning", body: "Always be learning something new." },
  { icon: Users, title: "Community", body: "Impact real lives, every day." },
]

const roles = [
  { title: "Senior Software Engineer", team: "Engineering", type: "Remote" },
  { title: "Operations Manager", team: "Operations", type: "On-site" },
  { title: "Product Designer", team: "Design", type: "Hybrid" },
  { title: "Business Development Lead", team: "Growth", type: "On-site" },
]

export function Careers() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-border">
                <Image
                  src="/images/driver.png"
                  alt="An Empire Deliveries team member ready to make an impact"
                  width={640}
                  height={640}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Careers
            </span>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
                Build the future of delivery with us
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
                We&apos;re a team of builders, dreamers and doers on a mission to transform commerce across Africa. Join
                us.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {culture.map((c) => (
                <Reveal key={c.title} delay={0.1}>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <c.icon className="size-5 text-primary" />
                    <h3 className="mt-3 font-semibold text-foreground">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h3 className="font-display text-xl font-semibold text-foreground">Open positions</h3>
          <div className="mt-5 grid gap-3">
            {roles.map((r) => (
              <a
                key={r.title}
                href="#"
                className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-6 py-4 transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-foreground">{r.title}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground group-hover:bg-card">
                    {r.team}
                  </span>
                </div>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {r.type}
                  <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
