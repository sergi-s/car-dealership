// HomePage.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeHero from "../components/HomeHero";
import QuickSearchForm from "../components/QuickSearchForm";
import FeaturedVehicles from "../components/FeaturedVehicles";
import ServicesGrid from "../components/ServicesGrid";
import TestimonialsSlider from "../components/TestimonialsSlider";
import CTASection from "../components/CTASection";

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <HomeHero />
        <QuickSearchForm />
        <FeaturedVehicles />
        <ServicesGrid />
        <TestimonialsSlider />
        <CTASection
          title="Ready for a Test Drive?"
          description="Experience the luxury and performance of your dream car today."
          buttonText="Contact Us"
          buttonLink="/about#contact"
        />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
