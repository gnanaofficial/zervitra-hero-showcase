import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Share2, TrendingUp, Users, PenTool, BarChart3, Target } from "lucide-react";

const DigitalMarketing = () => {
  const features = [
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Social Media Management",
      description: "Complete management of your social profiles across all platforms with consistent branding and engagement."
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Content Creation",
      description: "Professional content creation including graphics, videos, and copywriting tailored to your brand voice."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Marketing",
      description: "Data-driven advertising campaigns on Google, Meta, and LinkedIn to maximize your ROI."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Building",
      description: "Build and nurture an engaged community around your brand with authentic interactions."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Reporting",
      description: "Comprehensive analytics and monthly reports to track growth and optimize strategies."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Brand Strategy",
      description: "Develop a cohesive brand strategy that resonates with your target audience."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Digital Marketing Services | Zervitra - Complete Social Media & Marketing Solutions</title>
        <meta 
          name="description" 
          content="Complete digital marketing solutions including social media management, content creation, performance marketing, and brand strategy. Let us grow your online presence." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        <main className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 mb-6">
                <Share2 className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-primary">Digital</span>{" "}
                <span className="text-foreground">Marketing</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Complete social media management and digital marketing solutions. We handle everything from 
                content creation to performance marketing, letting you focus on your business while we grow your brand.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="premium-glass rounded-3xl p-8 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-6 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center premium-glass rounded-3xl p-12"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Brand?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss how we can elevate your digital presence and drive real results for your business.
              </p>
              <a
                href="mailto:hello@zervitra.com?subject=Digital Marketing Inquiry"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </a>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DigitalMarketing;
