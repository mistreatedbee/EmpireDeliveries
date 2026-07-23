"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Plus } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const faqs = [
  {
    q: "How do I order?",
    a: "Download the Empire Deliveries app, browse restaurants, shops and services near you, add items to your cart and check out securely. You can track your order live from the moment it's confirmed.",
  },
  {
    q: "How do businesses join?",
    a: "Tap 'Partner With Us' or visit our partner portal. Once approved, you'll get a merchant dashboard to manage your menu, orders, promotions and payouts — plus marketing support to reach more customers.",
  },
  {
    q: "How much does delivery cost?",
    a: "Delivery fees are transparent and calculated based on distance and demand, shown clearly before you pay. There are no hidden charges, and we run regular promotions and free-delivery offers.",
  },
  {
    q: "How do drivers earn?",
    a: "Drivers earn per delivery with daily earnings visibility and reliable weekly payouts, plus performance bonuses during peak times. You choose your own hours and the app sends you the closest orders.",
  },
  {
    q: "Where do you operate?",
    a: "Empire Deliveries currently serves 24 communities and is expanding rapidly across the region. Enter your address in the app to see live availability near you.",
  },
  {
    q: "How do I track my order?",
    a: "Every order includes live GPS tracking. You'll see your driver's real-time location, the delivery route and an accurate estimated arrival time, with updates at every stage.",
  },
  {
    q: "Can I schedule deliveries?",
    a: "Yes. You can order on-demand or schedule deliveries for a later time or date — ideal for groceries, recurring orders and business logistics.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support cards, mobile wallets and other secure local payment methods. All transactions are encrypted and processed through our secure checkout.",
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-lg font-semibold text-foreground">{q}</span>
        <span
          className={
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-transform " +
            (open ? "rotate-45" : "")
          }
        >
          <Plus className="size-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about ordering, partnering and driving with Empire Deliveries."
        />
        <div className="mt-12 grid gap-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  )
}
