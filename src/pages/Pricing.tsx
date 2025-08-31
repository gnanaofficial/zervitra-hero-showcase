import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, X, Star, Zap, Calendar } from "lucide-react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "project">("project");

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses and startups",
      monthlyPrice: 2999,
      projectPrice: 15000,
      popular: false,
      features: [
        "Custom website or web app",
        "Mobile-responsive design",
        "Basic SEO optimization",
        "3 months support",
        "Basic analytics setup",
        "Contact form integration",
        "Social media integration"
      ],
      notIncluded: [
        "Mobile app development",
        "Advanced integrations",
        "Custom CMS",
        "E-commerce features"
      ]
    },
    {
      name: "Growth",
      description: "Ideal for growing businesses that need more features",
      monthlyPrice: 4999,
      projectPrice: 35000,
      popular: true,
      features: [
        "Everything in Starter",
        "Mobile app (iOS/Android)",
        "Advanced SEO & performance",
        "6 months support",
        "Advanced analytics",
        "Payment integration",
        "Custom CMS",
        "API integrations",
        "User authentication",
        "Dashboard/admin panel"
      ],
      notIncluded: [
        "Enterprise integrations",
        "Advanced AI features",
        "Custom reporting"
      ]
    },
    {
      name: "Scale",
      description: "For established businesses needing premium solutions",
      monthlyPrice: 9999,
      projectPrice: 75000,
      popular: false,
      features: [
        "Everything in Growth",
        "Enterprise integrations",
        "Advanced AI features",
        "12 months support",
        "Custom reporting",
        "Multi-platform deployment",
        "Advanced security features",
        "Performance optimization",
        "Custom workflows",
        "Priority support",
        "Dedicated project manager",
        "Regular strategy calls"
      ],
      notIncluded: []
    }
  ];

  const addOns = [
    {
      name: "Social Media Marketing",
      description: "Content creation and performance marketing",
      price: 1999
    },
    {
      name: "Additional Platform",
      description: "Extra mobile platform or web portal",
      price: 8999
    },
    {
      name: "Advanced Integrations",
      description: "CRM, ERP, or custom API integrations",
      price: 4999
    },
    {
      name: "Ongoing Maintenance",
      description: "Monthly maintenance and updates",
      price: 999
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Zervitra | Transparent Development Costs</title>
        <meta 
          name="description" 
          content="Transparent pricing for web development, app development, and digital solutions. Choose from Starter, Growth, or Scale plans. Free consultation available." 
        />
        <meta name="keywords" content="web development pricing, app development cost, digital agency pricing, project quotes" />
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
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                Choose the plan that fits your needs. No hidden fees, no surprises. 
                Just honest pricing for exceptional results.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className={`text-sm font-medium ${billingCycle === 'project' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Project-Based
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'project' : 'monthly')}
                  className="relative w-16 h-8 bg-muted rounded-full transition-all duration-300"
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-primary rounded-full transition-all duration-300 ${
                      billingCycle === 'monthly' ? 'left-1' : 'left-9'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Monthly Retainer
                </span>
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
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-foreground">
                        ${billingCycle === 'monthly' 
                          ? plan.monthlyPrice.toLocaleString() 
                          : plan.projectPrice.toLocaleString()
                        }
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {billingCycle === 'monthly' ? '/month' : 'per project'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start">
                        <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div key={feature} className="flex items-start opacity-50">
                        <X className="w-5 h-5 text-muted-foreground mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm line-through">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_25px_-8px_hsl(var(--primary)/0.4)]'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    onClick={() => window.open(`mailto:hello@zervitra.com?subject=Interested in ${plan.name} Plan`, "_blank")}
                  >
                    Get Started
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Add-ons & Extensions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Enhance your project with additional services and features.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="premium-glass rounded-2xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300"
                >
                  <h3 className="font-semibold text-foreground mb-2">{addon.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{addon.description}</p>
                  <div className="text-2xl font-bold text-primary">
                    ${addon.price.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {[
                {
                  q: "What's included in the support period?",
                  a: "Bug fixes, minor updates, performance monitoring, and technical support via email and calls."
                },
                {
                  q: "Can I upgrade my plan later?",
                  a: "Absolutely! You can upgrade at any time. We'll credit your current plan towards the upgrade cost."
                },
                {
                  q: "Do you offer custom pricing for enterprise clients?",
                  a: "Yes, we offer custom solutions for larger organizations with specific requirements. Contact us for a tailored quote."
                },
                {
                  q: "What if I'm not satisfied with the results?",
                  a: "We offer a 30-day satisfaction guarantee. If you're not happy, we'll work to make it right or provide a full refund."
                }
              ].map((faq, index) => (
                <div key={index} className="premium-glass rounded-2xl p-6 border border-white/10">
                  <h3 className="font-semibold text-foreground mb-3">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </motion.div>
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
            <Zap className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Schedule a free consultation to discuss your project and get a detailed proposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_25px_-8px_hsl(var(--primary)/0.4)]"
                onClick={() => window.open("mailto:hello@zervitra.com?subject=Free Consultation Request", "_blank")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free Consultation
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