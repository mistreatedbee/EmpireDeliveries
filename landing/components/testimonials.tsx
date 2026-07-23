"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const testimonials = [
  {
    quote:
      "Empire Deliveries doubled our weekly orders. The merchant dashboard makes managing everything effortless and payouts are fast.",
    name: "Naledi Mokoena",
    role: "Owner, Naledi's Kitchen",
    tag: "Business",
    initials: "NM",
  },
  {
    quote:
      "I drive on my own schedule and the app always sends me the closest orders. The weekly payouts and bonuses are a game changer.",
    name: "Thabo Dlamini",
    role: "Empire Driver",
    tag: "Driver",
    initials: "TD",
  },
  {
    quote:
      "Groceries, pharmacy, dinner — all from one app with live tracking. It's honestly the most reliable delivery I've used.",
    name: "Aisha Bello",
    role: "Customer",
    tag: "Customer",
    initials: "AB",
  },
  {
    quote:
      "Empire has brought real economic opportunity to our township. Small businesses can finally compete and reach new customers.",
    name: "Sipho Ndlovu",
    role: "Community Leader",
    tag: "Community",
    initials: "SN",
  },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const t = testimonials[index]

  const go = (dir: number) => setIndex((v) => (v + dir + testimonials.length) % testimonials.length)

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by customers, drivers and businesses"
          description="Real stories from the people building the Empire Deliveries community."
        />

        <div className="relative mt-14 rounded-3xl border border-border bg-card p-8 sm:p-12">
          <Quote className="size-10 text-primary/20" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <p className="font-display text-xl font-medium leading-relaxed text-foreground text-balance sm:text-2xl">
                {t.quote}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {t.initials}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
                <span className="ml-auto rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  {t.tag}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={
                    "h-2 rounded-full transition-all " + (i === index ? "w-6 bg-primary" : "w-2 bg-border")
                  }
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => go(-1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => go(1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
