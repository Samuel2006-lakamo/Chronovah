// import AboutSection from "../components/AboutUs";
import Footer from "../components/Footer";
import CTAComponent from "../features/Hopepage/CTA";
import Features from "../features/Hopepage/Feature";
import Hero from "../features/Hopepage/Hero";
import SecuritySection from "../features/Hopepage/SecuritySection";
import UserFeedback from "../features/Hopepage/UserFeedback";
import HowItWorks from "../features/HowItWork";
import Faq from "../ui/Faq";
import FaqButton from "../ui/FaqButton";

function Homepage() {
  return (
    <>
      <Hero />

      <Features />
      <HowItWorks />

      <SecuritySection />
      <UserFeedback />
      <Faq />
      <CTAComponent />
      <Footer />
      <FaqButton />
    </>
  );
}

export default Homepage;