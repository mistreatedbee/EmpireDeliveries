"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Users, Store, Bike, Building2, Check, ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const tabs = [
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    headline: "Order what you need, track it live, pay securely",
    body: "A delightful experience from browse to doorstep, with everything saved and ready for next time.",
    cta: "Download the app",
    points: [
      "Fast ordering",
      "Live tracking",
      "Secure checkout",
      "Rewards & loyalty",
      "Saved addresses",
      "Multiple payment methods",
      "Order history",
      "Smart notifications",
    ],
  },
  {
    id: "businesses",
    label: "Businesses",
    icon: Store,
    headline: "Reach thousands of new customers and grow sales",
    body: "Everything you need to sell more, manage orders, and get paid quickly — with marketing built in.",
    cta: "Partner with us",
    points: [
      "Increase sales",
      "Reach more customers",
      "Marketing support",
      "Inventory management",
      "Analytics dashboard",
      "Order management",
      "Promotions & offers",
      "Fast payouts",
    ],
  },
  {
    id: "drivers",
    label: "Drivers",
    icon: Bike,
    headline: "Earn on your schedule with reliable weekly payouts",
    body: "Flexible work with the support, safety and navigation tools to help you earn more on every trip.",
    cta: "Become a driver",
    points: [
      "Flexible work",
      "Daily earnings",
      "Weekly payouts",
      "Performance bonuses",
      "Safety features",
      "In-app navigation",
      "Driver training",
      "Dedicated support",
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    icon: Building2,
    headline: "Scalable logistics built for serious operations",
    body: "Corporate-grade delivery infrastructure with the controls, integrations and support enterprises expect.",
    cta: "Talk to sales",
    points: [
      "Corporate logistics",
      "Scheduled deliveries",
      "Fleet management",
      "Business analytics",
      "Dedicated support",
      "Bulk deliveries",
      "API integrations",
      "SLA guarantees",
    ],
  },
]

export function Audience() {
  const [active, setActive] = useState(tabs[0].id)
  const current = tabs.find((t) => t.id === active)!

  return (
    <section id="audience" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Built For Everyone"
          title="One ecosystem, four powerful experiences"
          description="Whether you're ordering, selling, driving or scaling a fleet, Empire Deliveries is designed around you."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === active
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors " +
                  (isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-foreground hover:bg-secondary")
                }
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2 lg:p-12"
            >
              <div>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <current.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-foreground text-balance sm:text-3xl">
                  {current.headline}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground text-pretty">{current.body}</p>
                <a
                  href="#download"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  {current.cta} <ArrowRight className="size-4" />
                </a>
              </div>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {current.points.map((point, i) => (
                  <motion.li
                    key={point}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
