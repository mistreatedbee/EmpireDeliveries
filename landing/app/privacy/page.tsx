import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Empire Deliveries collects, uses, and protects your data.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: August 3, 2026</p>

        <p className="mt-8 leading-relaxed text-muted-foreground">
          Empire Deliveries ("we", "us", "our") operates the Empire Deliveries mobile app and website
          (together, the "Service"), connecting customers, drivers, restaurants, and businesses for food,
          grocery, pharmacy, retail, and courier delivery. This policy explains what data we collect, how we
          use it, and the choices you have.
        </p>

        <Section title="Information We Collect">
          <p>We collect the following categories of information when you use the Service:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Account information:</strong> name, email address, phone number, password, and profile photo.</li>
            <li><strong>Location data:</strong> precise (fine) and approximate (coarse) location, used to find nearby restaurants/stores, match you with drivers, and provide live order tracking. Drivers' location is shared with the customer during an active delivery.</li>
            <li><strong>Camera and photos:</strong> used only when you choose to upload a photo, such as proof of delivery or a profile picture.</li>
            <li><strong>Order and transaction data:</strong> order history, delivery addresses, order contents, and payment status (payment card details are processed directly by our payment provider and are not stored on our servers).</li>
            <li><strong>Device and usage data:</strong> device type, app version, push notification tokens, and crash/diagnostic logs.</li>
          </ul>
        </Section>

        <Section title="How We Use Your Information">
          <ul className="list-disc space-y-2 pl-6">
            <li>To create and manage your account, and verify your identity via email/OTP.</li>
            <li>To process and fulfil orders, and connect customers, drivers, and restaurants for delivery.</li>
            <li>To provide real-time order tracking and delivery notifications.</li>
            <li>To provide customer support and respond to enquiries.</li>
            <li>To maintain the security and integrity of the Service, and prevent fraud or abuse.</li>
            <li>To improve the Service and understand how it is used.</li>
          </ul>
        </Section>

        <Section title="How We Share Your Information">
          <p>We share data only as needed to operate the Service:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>With drivers and restaurants/businesses, to the extent necessary to fulfil an order (e.g. delivery address, order contents, contact details).</li>
            <li>With service providers who host our infrastructure, database, authentication, and payment processing on our behalf, under contractual confidentiality obligations.</li>
            <li>When required by law, or to protect the rights, safety, or property of Empire Deliveries, our users, or the public.</li>
          </ul>
          <p>We do not sell your personal information.</p>
        </Section>

        <Section title="Your Choices and Rights">
          <ul className="list-disc space-y-2 pl-6">
            <li>You can access, update, or delete your account information from within the app, or by contacting us.</li>
            <li>You can disable location permissions or camera/photo access at any time in your device settings, though this may limit certain features (e.g. live tracking, proof-of-delivery photos).</li>
            <li>You can opt out of push notifications in your device settings.</li>
            <li>You can request a copy of, or deletion of, your personal data by contacting us at the email below.</li>
          </ul>
        </Section>

        <Section title="Data Retention">
          <p>
            We retain personal data for as long as your account is active, or as needed to provide the
            Service, comply with legal obligations, resolve disputes, and enforce our agreements. You may
            request deletion of your account and associated data at any time.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p>
            The Service is not directed to children under 16, and we do not knowingly collect personal
            information from children under 16. If you believe a child has provided us with personal
            information, please contact us so we can delete it.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We use reasonable technical and organisational measures to protect your data, including
            encryption in transit. However, no method of transmission or storage is 100% secure, and we
            cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will post any changes on this page and
            update the "Last updated" date above.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            If you have questions about this Privacy Policy or your data, contact us at{" "}
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
