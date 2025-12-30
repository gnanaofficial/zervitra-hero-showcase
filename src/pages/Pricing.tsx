import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Phone, Calendar, MessageCircle } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      tagline: "Perfect for small businesses",
      priceRange: "₹25,000 - ₹75,000",
      description: "Basic website or landing page with essential features",
      features: [
        "Custom website (up to 5 pages)",
        "Mobile-responsive design",
        "Basic SEO optimization",
        "Contact form integration",
        "1 month free support",
        "Hosting setup assistance"
      ],
      ideal: "Small businesses, personal brands, portfolio sites"
    },
    {
      name: "Growth",
      tagline: "Most popular for startups",
      priceRange: "₹75,000 - ₹2,00,000",
      description: "Full-featured web or mobile application",
      popular: true,
      features: [
        "Everything in Starter",
        "Custom web/mobile app",
        "User authentication",
        "Admin dashboard",
        "Payment integration",
        "API integrations",
        "3 months free support",
        "Analytics setup"
      ],
      ideal: "Startups, growing businesses, e-commerce"
    },
    {
      name: "Enterprise",
      tagline: "For established businesses",
      priceRange: "₹2,00,000+",
      description: "Complex systems with custom requirements",
      features: [
        "Everything in Growth",
        "Multi-platform apps",
        "Advanced integrations",
        "Custom CRM/ERP features",
        "Advanced security",
        "6 months support",
        "Dedicated project manager",
        "Priority support"
      ],
      ideal: "Large businesses, enterprises, complex systems"
    }
  ];

  const transparencyPoints = [
    "No hidden fees - what we quote is what you pay",
    "Milestone-based payments for your comfort",
    "Free consultation to understand your needs",
    "Detailed proposal before any commitment",
    "Flexible payment plans available"
  ];

  return (
    <>
      <Helmet>
        <title>Transparent Pricing - Zervitra | Affordable Development Costs</title>
        <meta 
          name="description" 
          content="Affordable and transparent pricing for web development, app development, and digital solutions. No hidden fees. Free consultation available." 
        />
        <meta name="keywords" content="affordable web development, cheap app development, startup friendly pricing, transparent development costs" />
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
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                Transparent Pricing
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                Affordable development solutions for startups and businesses. 
                No hidden fees, no surprises. Just honest pricing.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-success/10 text-success font-medium">
                <MessageCircle className="w-5 h-5" />
                We're startup-friendly - contact us for custom quotes!
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative premium-glass rounded-3xl p-8 border transition-all duration-300 ${
                    plan.popular 
                      ? 'border-primary/50 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.3)] scale-105' 
                      : 'border-white/10 hover:border-primary/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.tagline}</p>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-primary">
                        {plan.priceRange}
                      </div>
                      <div className="text-muted-foreground text-sm mt-1">
                        project-based
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start">
                        <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 p-3 rounded-xl bg-muted/50">
                    <div className="text-xs text-muted-foreground">
                      <strong>Ideal for:</strong> {plan.ideal}
                    </div>
                  </div>

                  <Button
                    className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    onClick={() => window.open("tel:+918608608665", "_self")}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call for Quote
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Why Our Pricing Works for You
              </h2>
              <p className="text-xl text-muted-foreground">
                We believe in complete transparency
              </p>
            </motion.div>

            <div className="space-y-4">
              {transparencyPoints.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 premium-glass rounded-xl p-4 border border-white/10"
                >
                  <Check className="w-6 h-6 text-success flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </motion.div>
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
              Let's Discuss Your Project
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get a free consultation and custom quote tailored to your needs. No obligations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => window.open("tel:+918608608665", "_self")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us: +91 86086 08665
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold rounded-full border-2 border-primary/30"
                onClick={() => window.open("https://cal.com/zervitra/30min", "_blank")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Call
              </Button>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;