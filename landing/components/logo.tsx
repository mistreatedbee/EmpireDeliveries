import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span aria-hidden="true" className="relative flex size-9 shrink-0 overflow-hidden rounded-xl shadow-sm">
        {/* Black-bg logo: dark badge, reads clearly on light backgrounds */}
        <Image
          src="/brand/logo-black-bg.jpg"
          alt=""
          fill
          sizes="36px"
          className={cn("object-cover", onDark ? "hidden" : "block dark:hidden")}
        />
        {/* White-bg logo: light badge, reads clearly on dark backgrounds */}
        <Image
          src="/brand/logo-white-bg.jpg"
          alt=""
          fill
          sizes="36px"
          className={cn("object-cover", onDark ? "block" : "hidden dark:block")}
        />
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-base font-black tracking-tight", onDark ? "text-white" : "text-foreground")}>EMPIRE</span>
        <span className="block text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Deliveries</span>
      </span>
    </span>
  )
}
