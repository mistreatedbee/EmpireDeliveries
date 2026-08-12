"use client"

import { useState } from "react"
import { Mail, Phone, Headphones, Store, Bike, MapPin, Send, CheckCircle2 } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"

const channels = [
  { icon: Mail, label: "Email", value: "hello@empiredeliveries.com" },
  { icon: Phone, label: "Phone", value: "+27 10 555 0199" },
  { icon: Headphones, label: "Support", value: "support@empiredeliveries.com" },
  { icon: Store, label: "Business enquiries", value: "partners@empiredeliveries.com" },
  { icon: Bike, label: "Driver enquiries", value: "drivers@empiredeliveries.com" },
]

export function Contact() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState("A customer")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.")
      return
    }
    const subject = encodeURIComponent(`Empire Deliveries enquiry — ${topic}`)
    const body = encodeURIComponent(`Name: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${topic}\n\n${message.trim()}`)
    window.location.href = `mailto:hello@empiredeliveries.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" className="scroll-mt-20 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk"
          description="Whether you want to order, partner, drive or just say hello — we'd love to hear from you."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="flex h-full flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {channels.map((c) => (
                  <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <c.icon className="size-5" />
                    </span>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</p>
                    <a href={`mailto:${c.value}`} className="mt-0.5 block text-sm font-semibold text-foreground break-words hover:text-primary">
                      {c.value}
                    </a>
                  </div>
                ))}
              </div>

              <div className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-card">
                <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-50" />
                <svg viewBox="0 0 400 200" className="h-full min-h-40 w-full" fill="none">
                  <path d="M40 150 C 120 150, 140 60, 220 80 S 340 140, 370 50" stroke="var(--brand-blue)" strokeWidth="3" strokeDasharray="5 7" strokeLinecap="round" />
                  <circle cx="40" cy="150" r="6" fill="var(--brand-emerald)" />
                  <circle cx="220" cy="80" r="6" fill="var(--brand-blue)" />
                  <circle cx="370" cy="50" r="6" fill="var(--brand-orange)" />
                </svg>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 backdrop-blur">
                  <MapPin className="size-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">HQ · Johannesburg, South Africa</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left">
            <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-7 sm:p-8">
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 className="size-7" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Ready to send!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your email app should open with your message. Send it to complete your enquiry.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" id="name" placeholder="Naledi Mokoena" value={name} onChange={setName} />
                    <Field label="Email" id="email" type="email" placeholder="you@email.com" value={email} onChange={setEmail} />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="topic" className="text-sm font-medium text-foreground">
                      I&apos;m enquiring as
                    </label>
                    <select
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option>A customer</option>
                      <option>A business / partner</option>
                      <option>A driver</option>
                      <option>Enterprise / logistics</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help?"
                      className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Send message <Send className="size-4" />
                  </button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string
  id: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}
