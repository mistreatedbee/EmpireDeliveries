import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Admin Access",
  robots: { index: false, follow: false },
}

export default function AdminAccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-32 sm:px-6">
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Admin Access</h1>

        <p className="mt-8 leading-relaxed text-muted-foreground">
          There is no separate admin login on this website. The Empire Deliveries admin panel lives
          inside the mobile app — admin is simply a role on a regular account, not a different app or
          entry point.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-border bg-secondary/40 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">To sign in as admin</p>
          <ol className="list-decimal space-y-2 pl-5 text-foreground">
            <li>Open the Empire Deliveries mobile app.</li>
            <li>Go to the regular <span className="font-semibold">Sign In</span> screen.</li>
            <li>Log in with your assigned admin account's email and password.</li>
          </ol>
          <p className="text-sm text-muted-foreground">
            The app automatically detects the admin role after login and routes you into the admin
            dashboard — no separate button, code, or link required.
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Don't have admin credentials, or need a new admin account created? Contact your team lead or
          the person managing the Empire Deliveries backend.
        </p>
      </main>
      <Footer />
    </div>
  )
}
