import { Store, UtensilsCrossed, ShoppingCart, Pill, Building2, Coffee, Beef, Croissant, Fuel, Gift } from "lucide-react"

const partners = [
  { icon: UtensilsCrossed, name: "Urban Eats" },
  { icon: ShoppingCart, name: "FreshMart" },
  { icon: Pill, name: "CareRx Pharmacy" },
  { icon: Coffee, name: "Bean & Co" },
  { icon: Beef, name: "Prime Grill" },
  { icon: Croissant, name: "Golden Bakery" },
  { icon: Store, name: "Township Traders" },
  { icon: Building2, name: "MetroCorp" },
  { icon: Fuel, name: "QuickStop" },
  { icon: Gift, name: "GiftHub" },
]

export function Partners() {
  const row = [...partners, ...partners]
  return (
    <section className="border-y border-border bg-secondary/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Trusted by 500+ restaurants, retailers, supermarkets, pharmacies and corporate partners
        </p>
      </div>
      <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-4" style={{ "--marquee-duration": "38s" } as React.CSSProperties}>
          {row.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-6 py-3.5"
            >
              <p.icon className="size-5 text-primary" />
              <span className="whitespace-nowrap font-display text-base font-semibold text-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
