import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span aria-hidden="true" className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
        <Crown className="size-5 text-primary-foreground" strokeWidth={1.8} />
      </span>
      <span className="leading-none">
        <span className="block font-display text-base font-black tracking-tight text-foreground">EMPIRE</span>
        <span className="block text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Deliveries</span>
      </span>
    </span>
  )
}
