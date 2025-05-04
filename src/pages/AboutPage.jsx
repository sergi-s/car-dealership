// AboutPage.jsx
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import AboutStory from '../components/AboutStory';
import ValuesGrid from '../components/ValuesGrid';
import TeamGrid from '../components/TeamGrid';
import ContactSection from '../components/ContactSection';
import MapSection from '../components/MapSection';

const AboutPage = () => {
  return (
    <>
      <Header />
      <main>
        <PageHero 
          title="About Premium Motors" 
          subtitle="Your trusted partner in luxury automotive excellence since 1985"
          className="about-hero"
        />
        <AboutStory />
        <ValuesGrid />
        <TeamGrid />
        <ContactSection />
        <MapSection />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;