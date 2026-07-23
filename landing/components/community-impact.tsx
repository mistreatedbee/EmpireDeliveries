"use client"

import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { CountUp } from "@/components/count-up"

const counters = [
  { value: 8500, suffix: "+", label: "Jobs Created" },
  { value: 500, suffix: "+", label: "Businesses Supported" },
  { value: 24, suffix: "", label: "Communities Served" },
  { value: 50000, suffix: "+", label: "Deliveries Completed" },
]

const impacts = [
  "Supporting local businesses",
  "Creating employment",
  "Helping entrepreneurs grow",
  "Improving access to food",
  "Improving healthcare access",
  "Helping elderly customers",
  "Supporting people with disabilities",
  "Empowering township businesses",
  "Helping small restaurants compete",
  "Encouraging digital transformation",
]

export function CommunityImpact() {
  return (
    <section id="community" className="scroll-mt-20 bg-brand-dark py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Community Impact
            </span>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Technology that lifts entire communities
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-lg leading-relaxed text-white/70 text-pretty">
                Empire Deliveries is more than convenience. We reduce barriers to commerce, create opportunities, and
                help communities across Africa thrive through smarter logistics.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {impacts.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal direction="left">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/images/customer.png"
                alt="A customer happily receiving an Empire Deliveries order at home"
                width={720}
                height={560}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-12 lg:grid-cols-4">
          {counters.map((c) => (
            <div key={c.label} className="text-center">
              <div className="font-display text-4xl font-bold text-white sm:text-5xl">
                <CountUp to={c.value} suffix={c.suffix} />
              </div>
              <p className="mt-2 text-sm text-white/60">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
