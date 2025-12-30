import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Palette, Eye, Users, Sparkles, Layout, MousePointer, Phone, Calendar } from "lucide-react";

const UIUXDesign = () => {
  const features = [
    {
      icon: Eye,
      title: "User Research",
      description: "Deep understanding of your users' needs and behaviors"
    },
    {
      icon: Users,
      title: "User Personas",
      description: "Detailed user profiles to guide design decisions"
    },
    {
      icon: Layout,
      title: "Wireframing",
      description: "Low-fidelity prototypes to validate concepts early"
    },
    {
      icon: Sparkles,
      title: "Visual Design",
      description: "Beautiful, on-brand interfaces that delight users"
    },
    {
      icon: MousePointer,
      title: "Interaction Design",
      description: "Intuitive micro-interactions and animations"
    },
    {
      icon: Palette,
      title: "Design Systems",
      description: "Scalable component libraries for consistency"
    }
  ];

  const process = [
    { step: "01", title: "Discovery", description: "Understanding your business and users" },
    { step: "02", title: "Research", description: "User interviews and competitive analysis" },
    { step: "03", title: "Wireframes", description: "Structure and layout planning" },
    { step: "04", title: "Design", description: "High-fidelity visual design" },
    { step: "05", title: "Prototype", description: "Interactive clickable prototypes" },
    { step: "06", title: "Handoff", description: "Developer-ready assets and specs" }
  ];

  const services = [
    "Mobile App UI/UX",
    "Web Application Design",
    "Dashboard & Admin Panels",
    "E-commerce UX",
    "SaaS Product Design",
    "Design System Creation"
  ];

  return (
    <>
      <Helmet>
        <title>UI/UX Design Services - Zervitra</title>
        <meta name="description" content="Research-driven, accessible interfaces that convert visitors into customers effectively." />
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
                <Palette className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                UI/UX Design
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                Research-driven, accessible interfaces that convert visitors into customers and keep them coming back.
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
              <h2 className="text-4xl font-bold text-foreground mb-4">Our Design Expertise</h2>
              <p className="text-xl text-muted-foreground">Comprehensive design services for digital products</p>
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

        {/* Design Process */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">Our Design Process</h2>
              <p className="text-xl text-muted-foreground">A proven methodology for design success</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">What We Design</h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {services.map((service) => (
                <span
                  key={service}
                  className="px-6 py-3 rounded-full bg-primary/10 text-primary font-medium text-lg"
                >
                  {service}
                </span>
              ))}
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
              Ready to Transform Your User Experience?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's create designs that users love and businesses profit from.
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

export default UIUXDesign;