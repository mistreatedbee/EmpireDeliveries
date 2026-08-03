import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Delete Your Account",
  description: "How to request deletion of your Empire Deliveries account and data.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

export default function DeleteAccountPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Delete Your Empire Deliveries Account
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: August 3, 2026</p>

        <p className="mt-8 leading-relaxed text-muted-foreground">
          You can request deletion of your Empire Deliveries account and associated data at any time.
          Follow the steps below.
        </p>

        <Section title="How to Request Deletion">
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              Send an email to{" "}
              <a href="mailto:support@empiredeliveries.co.za" className="font-medium text-primary underline underline-offset-4">
                support@empiredeliveries.co.za
              </a>{" "}
              from the email address registered to your account.
            </li>
            <li>Use the subject line "Account Deletion Request".</li>
            <li>Include the email address or phone number associated with your account, and your full name, so we can verify your identity.</li>
          </ol>
          <p>
            We will confirm your request by email and process the deletion within 30 days.
          </p>
        </Section>

        <Section title="What Gets Deleted">
          <ul className="list-disc space-y-2 pl-6">
            <li>Your account profile: name, email, phone number, password, and profile photo.</li>
            <li>Saved addresses and payment preferences.</li>
            <li>Device and push notification tokens.</li>
          </ul>
        </Section>

        <Section title="What We Retain, and For How Long">
          <p>
            Some information cannot be deleted immediately due to legal, tax, fraud-prevention, and
            accounting requirements. Specifically, we retain the following for up to 5 years after account
            deletion:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Order and transaction history (required for financial records and dispute resolution).</li>
            <li>Records needed to comply with tax, consumer-protection, or other applicable law.</li>
          </ul>
          <p>
            This retained data is kept solely for these purposes, is not used for marketing, and is deleted
            once the applicable retention period expires.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            For any questions about this process, contact{" "}
            <a href="mailto:support@empiredeliveries.co.za" className="font-medium text-primary underline underline-offset-4">
              support@empiredeliveries.co.za
            </a>
            .
          </p>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
