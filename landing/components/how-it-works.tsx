"use client"

import { Search, ShoppingBag, UserCheck, Navigation, PackageCheck } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Stagger, StaggerItem } from "@/components/reveal"

const steps = [
  { icon: Search, title: "Browse", body: "Discover restaurants, shops and services near you." },
  { icon: ShoppingBag, title: "Order", body: "Add items to your cart and check out securely." },
  { icon: UserCheck, title: "Driver Assigned", body: "Our AI matches the closest verified driver." },
  { icon: Navigation, title: "Track Live", body: "Watch your order move in real time on the map." },
  { icon: PackageCheck, title: "Delivered", body: "Receive your order with proof of delivery." },
]

export function HowItWorks() {
  return (
    <section className="scroll-mt-20 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="From craving to doorstep in five simple steps"
          description="A seamless journey designed to be effortless for every customer, every time."
        />

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
          <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                    <step.icon className="size-6" />
                    <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 max-w-[14rem] text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
