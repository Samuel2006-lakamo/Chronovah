import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../features/Hopepage/Hero";
import Features from "../features/Hopepage/Feature";
import HowItWorks from "../features/Hopepage/HowItWork";
import PricingSection from "../features/Hopepage/PricingSection";
import UserFeedback from "../features/Hopepage/UserFeedback";
import Faq from "../features/Hopepage/Faq";
import CTAComponent from "../features/Hopepage/CTA";
import { useSEO } from "../hooks/useSEO";
import { useEffect } from "react";

/**
 * Section order:
 * Hero → Features (what) → How it works (how) → Pricing (cost)
 * → Testimonials (social proof) → FAQ → CTA (final push)
 */
function Homepage() {
  useSEO({
    title: "Offline-First Personal Workspace — Notes, Journal, People & Places",
    description:
      "Chronovah is an offline-first app to store and organise your notes, journal entries, people contacts, and places — all in one private workspace. Works without internet. Free to start.",
    canonical: "/",
  });

  // Force the ocean (cool) theme AND cool surface on the landing page
  // regardless of the user's saved preferences. Restore everything on leave.
  useEffect(() => {
    const root = document.documentElement;

    // Capture theme-* classes (e.g. theme-midnight, theme-forest)
    const existingThemeClasses = Array.from(root.classList).filter((c) =>
      c.startsWith("theme-")
    );

    // Capture surface-* classes (e.g. surface-warm)
    const existingSurfaceClasses = Array.from(root.classList).filter((c) =>
      c.startsWith("surface-")
    );

    // Strip both — ocean + cool surface are the defaults (no classes needed)
    [...existingThemeClasses, ...existingSurfaceClasses].forEach((c) =>
      root.classList.remove(c)
    );

    return () => {
      // Restore the user's classes when leaving the landing page
      [...existingThemeClasses, ...existingSurfaceClasses].forEach((c) =>
        root.classList.add(c)
      );
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PricingSection />
        <UserFeedback />
        <Faq />
        <CTAComponent />
      </main>
      <Footer />
    </>
  );
}

export default Homepage;
