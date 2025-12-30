import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Code, Zap, Shield, TrendingUp, Globe, Server, Smartphone, Phone, Calendar } from "lucide-react";

const WebDevelopment = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Optimized for speed with modern frameworks and CDN delivery"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SSL certificates, secure authentication, and data protection"
    },
    {
      icon: TrendingUp,
      title: "SEO Optimized",
      description: "Built for search engines to maximize your organic reach"
    },
    {
      icon: Smartphone,
      title: "Fully Responsive",
      description: "Perfect experience across all devices and screen sizes"
    },
    {
      icon: Server,
      title: "Scalable Architecture",
      description: "Built to grow with your business needs"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Multi-language support and international deployment"
    }
  ];

  const techStack = [
    "React", "Next.js", "Vue.js", "Node.js", "Python", "PostgreSQL", "MongoDB", "AWS", "Vercel"
  ];

  const services = [
    "Custom Web Applications",
    "E-commerce Platforms",
    "Progressive Web Apps (PWA)",
    "API Development & Integration",
    "CMS Implementation",
    "Web Portal Development"
  ];

  return (
    <>
      <Helmet>
        <title>Web Development Services - Zervitra</title>
        <meta name="description" content="Professional web development services. SEO-ready, scalable web apps with modern stacks that drive conversions." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 mb-8">
                <Code className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                Web Development
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                We build SEO-ready, scalable web applications with modern technology stacks that drive conversions and grow your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => window.open("tel:+918608608665", "_self")}
                  className="px-8 py-6 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us: +91 86086 08665
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open("https://cal.com/zervitra/30min", "_blank")}
                  className="px-8 py-6 text-lg font-semibold rounded-full border-2 border-primary/30"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule a Call
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Us?</h2>
              <p className="text-xl text-muted-foreground">What makes our web development stand out</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="premium-glass rounded-3xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300"
                >
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold text-foreground mb-6">What We Build</h2>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={service} className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-4" />
                      <span className="text-lg text-muted-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold text-foreground mb-6">Tech Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center premium-glass rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Build Your Web Presence?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss your project and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => window.open("tel:+918608608665", "_self")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold rounded-full border-2 border-primary/30"
                onClick={() => window.location.href = "/contact"}
              >
                Contact Page
              </Button>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default WebDevelopment;