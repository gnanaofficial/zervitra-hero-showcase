import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurServices from "@/components/OurServices";
import Analytics from "@/components/Analytics";
import WavyFlow from "@/components/WavyFlow";
import CalComEmbed from "@/components/CalComEmbed";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Zervitra - Ship faster. Scale smarter. | Premium Development Services</title>
        <meta 
          name="description" 
          content="Zervitra builds conversion-first products—web apps, mobile apps, and MVPs—designed to grow your business. Get started today with our expert team." 
        />
        <meta name="keywords" content="web development, app development, UI UX design, MVP development, social media marketing" />
        <meta property="og:title" content="Zervitra - Ship faster. Scale smarter." />
        <meta property="og:description" content="Zervitra builds conversion-first products designed to grow your business." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://zervitra.com/" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <Navbar />

        {/* Single Screen Hero Section */}
        <div className="relative min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <Hero />
          </div>
        </div>

        {/* Our Services Section */}
        <section id="services" className="relative py-20">
          <OurServices />
        </section>

        {/* Analytics Section */}
        <Analytics />

        {/* Wavy Flow Section */}
        <div className="relative">
          <WavyFlow />
        </div>

        {/* Cal.com Embed Section */}
        <section className="relative py-20">
          <CalComEmbed />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Home;