import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Process from "@/components/Process";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Statement from "@/components/Statement";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Statement />
        <Services />
        <CaseStudies />
        <Process />
        <Testimonial />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
