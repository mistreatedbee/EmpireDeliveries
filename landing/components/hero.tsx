"use client"

import { motion } from "motion/react"
import { ArrowRight, MapPin, Bike, ShoppingBag, Pill, Package, Star, ChevronDown } from "lucide-react"
import { CountUp } from "@/components/count-up"

const floatingCards = [
  { icon: ShoppingBag, label: "Groceries", sub: "Fresh & fast", color: "text-primary", pos: "left-0 top-10", delay: 0 },
  { icon: Pill, label: "Pharmacy", sub: "Delivered safely", color: "text-accent", pos: "right-2 top-0", delay: 0.6 },
  { icon: Package, label: "Courier", sub: "Same-day parcels", color: "text-brand-orange", pos: "right-6 bottom-6", delay: 1.1 },
]

const stats = [
  { value: 50000, suffix: "+", label: "Deliveries" },
  { value: 500, suffix: "+", label: "Businesses" },
  { value: 10000, suffix: "+", label: "Customers" },
  { value: 99, suffix: "%", label: "On-Time Delivery" },
]

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping-slow rounded-full bg-accent" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Africa&apos;s intelligent delivery ecosystem
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl"
          >
            Everything You Need.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Delivered.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            Empire Deliveries connects customers, businesses, and drivers through one intelligent platform for food
            delivery, grocery shopping, pharmacy services, retail purchases, and courier logistics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#download"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              Order Now <ArrowRight className="size-4" />
            </a>
            <a
              href="#audience"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <Bike className="size-4" /> Become a Driver
            </a>
            <a
              href="#audience"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Partner With Us
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-7 flex items-center gap-3 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {["bg-primary", "bg-accent", "bg-brand-orange", "bg-foreground"].map((c, i) => (
                <span key={i} className={`size-7 rounded-full border-2 border-background ${c}`} />
              ))}
            </div>
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-brand-orange text-brand-orange" />
              <strong className="text-foreground">4.9</strong> from 12,000+ reviews
            </span>
          </motion.div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto h-[440px] w-full max-w-md lg:h-[520px]">
          {/* Main tracking card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-primary/10"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Live order</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                <span className="size-1.5 rounded-full bg-accent" /> On the way
              </span>
            </div>
            <div className="mt-4 flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
              <svg viewBox="0 0 240 120" className="h-full w-full" fill="none">
                <motion.path
                  d="M12 96 C 60 96, 70 30, 120 40 S 190 88, 228 28"
                  stroke="var(--brand-blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.6 }}
                />
                <circle cx="12" cy="96" r="5" fill="var(--brand-emerald)" />
                <motion.circle
                  r="6"
                  fill="var(--brand-blue)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ offsetPath: "path('M12 96 C 60 96, 70 30, 120 40 S 190 88, 228 28')" } as React.CSSProperties}
                />
                <circle cx="228" cy="28" r="5" fill="var(--brand-orange)" />
              </svg>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bike className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">Thabo is 4 min away</p>
                <p className="text-xs text-muted-foreground">Order #EMP-2048 · 3 items</p>
              </div>
            </div>
          </motion.div>

          {floatingCards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + card.delay * 0.2 }}
              className={`animate-float absolute ${card.pos} flex items-center gap-2.5 rounded-2xl border border-border bg-card/90 p-3 shadow-xl backdrop-blur`}
              style={{ animationDelay: `${card.delay}s` }}
            >
              <span className={`flex size-9 items-center justify-center rounded-xl bg-secondary ${card.color}`}>
                <card.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{card.label}</p>
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="animate-float absolute bottom-16 left-0 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-lg"
            style={{ animationDelay: "1.6s" }}
          >
            <MapPin className="size-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Tracking live in 24 cities</span>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-secondary/50 p-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-10 flex justify-center">
        <a href="#about" aria-label="Scroll to learn more" className="text-muted-foreground">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="flex flex-col items-center gap-1 text-xs"
          >
            Scroll to explore
            <ChevronDown className="size-4" />
          </motion.span>
        </a>
      </div>
    </section>
  )
}
