import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Partners } from "@/components/partners"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { WhyChoose } from "@/components/why-choose"
import { HowItWorks } from "@/components/how-it-works"
import { LiveTracking } from "@/components/live-tracking"
import { Audience } from "@/components/audience"
import { Technology } from "@/components/technology"
import { MobileApps } from "@/components/mobile-apps"
import { SafetySustainability } from "@/components/safety-sustainability"
import { CommunityImpact } from "@/components/community-impact"
import { Testimonials } from "@/components/testimonials"
import { News } from "@/components/news"
import { Careers } from "@/components/careers"
import { Faq } from "@/components/faq"
import { CtaBanner } from "@/components/cta-banner"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <About />
        <Services />
        <WhyChoose />
        <HowItWorks />
        <LiveTracking />
        <Audience />
        <Technology />
        <MobileApps />
        <SafetySustainability />
        <CommunityImpact />
        <Testimonials />
        <News />
        <Careers />
        <Faq />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
