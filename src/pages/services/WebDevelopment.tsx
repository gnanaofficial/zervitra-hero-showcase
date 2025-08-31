import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Code, Zap, Shield, TrendingUp } from "lucide-react";

const WebDevelopment = () => {
  return (
    <>
      <Helmet>
        <title>Web Development Services - Zervitra</title>
        <meta name="description" content="Professional web development services. SEO-ready, scalable web apps with modern stacks that drive conversions." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Code className="w-20 h-20 text-primary mx-auto mb-6" />
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                Web Development
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                SEO-ready, scalable web apps with modern stacks that drive conversions and grow your business.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <div className="premium-glass rounded-3xl p-6 border border-white/10">
                <Zap className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Optimized for speed and performance</p>
              </div>
              <div className="premium-glass rounded-3xl p-6 border border-white/10">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-muted-foreground">Enterprise-grade security built-in</p>
              </div>
              <div className="premium-glass rounded-3xl p-6 border border-white/10">
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Growth Focused</h3>
                <p className="text-muted-foreground">Designed to scale with your business</p>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => window.open("mailto:hello@zervitra.com?subject=Web Development Inquiry", "_blank")}
                className="px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default WebDevelopment;