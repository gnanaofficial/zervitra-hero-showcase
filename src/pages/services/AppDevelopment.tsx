import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

const AppDevelopment = () => {
  return (
    <>
      <Helmet>
        <title>App Development Services - Zervitra</title>
        <meta name="description" content="iOS/Android apps with robust CI/CD pipelines and comprehensive analytics integration." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Smartphone className="w-20 h-20 text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                App Development
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                iOS/Android apps with robust CI/CD pipelines and comprehensive analytics integration.
              </p>
              <Button
                size="lg"
                onClick={() => window.open("mailto:hello@zervitra.com?subject=App Development Inquiry", "_blank")}
                className="px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AppDevelopment;