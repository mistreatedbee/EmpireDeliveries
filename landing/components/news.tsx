"use client"

import { ArrowUpRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Stagger, StaggerItem } from "@/components/reveal"

const posts = [
  {
    tag: "Expansion",
    date: "Jun 2026",
    title: "Empire Deliveries launches in 6 new cities across the region",
    body: "Our fastest expansion yet brings on-demand delivery to thousands more customers and local businesses.",
  },
  {
    tag: "Technology",
    date: "May 2026",
    title: "New AI dispatch engine cuts average delivery times by 22%",
    body: "Smarter driver matching and route optimisation are making every order faster and more efficient.",
  },
  {
    tag: "Community",
    date: "Apr 2026",
    title: "8,500+ earning opportunities created for local drivers",
    body: "A milestone in our mission to build economic opportunity across the communities we serve.",
  },
]

export function News() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Latest News"
            title="What's happening at Empire"
            description="Company updates, technology milestones and community stories."
          />
          <a
            href="#"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            View all news <ArrowUpRight className="size-4" />
          </a>
        </div>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <StaggerItem key={p.title}>
              <article className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">{p.tag}</span>
                  <span className="text-muted-foreground">{p.date}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-foreground text-balance">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read more
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
