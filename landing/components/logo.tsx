import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="relative flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17h2l1.5-9h9L18 17h3" />
          <circle cx="7.5" cy="18.5" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="18.5" r="1.8" fill="currentColor" stroke="none" />
          <path d="M9 4l6 0" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-accent ring-2 ring-background" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Empire<span className="text-primary">.</span>
      </span>
    </span>
  )
}
