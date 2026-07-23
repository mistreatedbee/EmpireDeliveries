"use client"

import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone } from "lucide-react"

export function CtaBanner() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-6 py-16 text-center md:px-16 md:py-24">
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute -left-24 -top-24 size-72 rounded-full bg-brand-blue/40 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-brand-emerald/40 blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80">
                <Smartphone className="size-4 text-brand-emerald" />
                Available across major African cities
              </p>
              <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                Ready to move your world, faster?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/70">
                Join millions of customers, thousands of businesses, and a growing fleet of drivers building the future
                of delivery across Africa.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" className="group h-12 bg-brand-blue px-7 text-base text-white hover:bg-brand-blue/90">
                  Download the app
                  <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/20 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
                >
                  Partner with us
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
