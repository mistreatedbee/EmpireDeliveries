"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Apple, Play, Home, Navigation, CreditCard, Star, Bike, Search } from "lucide-react"
import { Reveal } from "@/components/reveal"

const screens = [
  {
    id: "home",
    name: "Home",
    render: () => (
      <div className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs text-muted-foreground">
          <Search className="size-3.5" /> Search restaurants & shops
        </div>
        <div className="grid grid-cols-4 gap-2">
          {["Food", "Grocery", "Pharmacy", "Courier"].map((c) => (
            <div key={c} className="flex flex-col items-center gap-1 rounded-xl bg-secondary py-2 text-[10px] text-foreground">
              <span className="size-6 rounded-full bg-primary/15" />
              {c}
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-primary to-accent p-3 text-primary-foreground">
          <p className="text-xs font-semibold">50% off first order</p>
          <p className="text-[10px] opacity-90">Use code EMPIRE50</p>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-border p-2">
            <span className="size-10 rounded-xl bg-secondary" />
            <div className="flex-1">
              <div className="h-2 w-20 rounded bg-secondary" />
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Star className="size-3 fill-brand-orange text-brand-orange" /> 4.8 · 20 min
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "tracking",
    name: "Tracking",
    render: () => (
      <div className="flex h-full flex-col">
        <div className="relative h-1/2 bg-secondary">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full" fill="none">
            <path d="M20 100 C 70 100, 80 30, 120 45 S 170 90, 180 30" stroke="var(--brand-blue)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="20" cy="100" r="5" fill="var(--brand-emerald)" />
            <circle cx="120" cy="45" r="6" fill="var(--brand-blue)" />
            <circle cx="180" cy="30" r="5" fill="var(--brand-orange)" />
          </svg>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[10px] font-semibold text-accent">
            <Bike className="size-3.5" /> Arriving in 4 minutes
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Bike className="size-4" />
            </span>
            <div>
              <div className="h-2 w-16 rounded bg-secondary" />
              <div className="mt-1.5 h-1.5 w-24 rounded bg-secondary" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "checkout",
    name: "Checkout",
    render: () => (
      <div className="flex h-full flex-col gap-3 p-4">
        <p className="text-sm font-semibold text-foreground">Checkout</p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border p-2.5">
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-lg bg-secondary" />
              <div className="h-2 w-16 rounded bg-secondary" />
            </div>
            <div className="h-2 w-8 rounded bg-secondary" />
          </div>
        ))}
        <div className="mt-auto rounded-2xl bg-secondary p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total</span>
            <span className="font-semibold text-foreground">R248.00</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
            <CreditCard className="size-3.5" /> Pay securely
          </div>
        </div>
      </div>
    ),
  },
]

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "tracking", label: "Track", icon: Navigation },
  { id: "checkout", label: "Pay", icon: CreditCard },
]

export function MobileApps() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive((v) => (v + 1) % screens.length), 3500)
    return () => clearInterval(timer)
  }, [])

  const current = screens[active]

  return (
    <section id="download" className="scroll-mt-20 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Mobile Apps
          </span>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
              The whole ecosystem, in your pocket
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              Order, track and pay in seconds with the customer app. Drivers and merchants get purpose-built apps too —
              all connected on one intelligent platform.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#download"
                className="inline-flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
              >
                <Apple className="size-6" />
                <span className="text-left">
                  <span className="block text-[10px] leading-none opacity-70">Download on the</span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#download"
                className="inline-flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
              >
                <Play className="size-6" />
                <span className="text-left">
                  <span className="block text-[10px] leading-none opacity-70">Get it on</span>
                  <span className="block text-sm font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </Reveal>

          <div className="mt-8 flex gap-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(i)}
                className={
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                  (active === i
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground hover:bg-secondary")
                }
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 mx-auto h-full w-56 rounded-full bg-primary/15 blur-3xl"
            />
            <div className="relative h-[560px] w-[280px] rounded-[2.75rem] border-[10px] border-brand-dark bg-brand-dark shadow-2xl">
              <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-brand-dark" />
              <div className="h-full w-full overflow-hidden rounded-[2rem] bg-card">
                <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-medium text-foreground">
                  <span>9:41</span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-full bg-accent" /> Empire
                  </span>
                </div>
                <div className="h-[calc(100%-1.5rem)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.35 }}
                      className="h-full"
                    >
                      {current.render()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
