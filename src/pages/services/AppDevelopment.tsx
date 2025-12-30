import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Smartphone, Zap, Shield, Cloud, Cpu, Layers, Phone, Calendar } from "lucide-react";

const AppDevelopment = () => {
  const features = [
    {
      icon: Zap,
      title: "Native Performance",
      description: "Smooth 60fps animations and instant response times"
    },
    {
      icon: Shield,
      title: "Secure by Design",
      description: "End-to-end encryption and secure data storage"
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Seamless sync with cloud services and APIs"
    },
    {
      icon: Cpu,
      title: "Offline First",
      description: "Works perfectly even without internet connection"
    },
    {
      icon: Layers,
      title: "Cross Platform",
      description: "Single codebase for iOS and Android"
    },
    {
      icon: Smartphone,
      title: "Push Notifications",
      description: "Engage users with timely, relevant notifications"
    }
  ];

  const platforms = [
    "iOS (iPhone & iPad)", "Android", "Cross-Platform (React Native)", "Flutter Apps"
  ];

  const services = [
    "Consumer Mobile Apps",
    "Enterprise Solutions",
    "E-commerce Apps",
    "Social & Community Apps",
    "Health & Fitness Apps",
    "On-Demand Service Apps"
  ];

  return (
    <>
      <Helmet>
        <title>App Development Services - Zervitra</title>
        <meta name="description" content="iOS/Android apps with robust CI/CD pipelines and comprehensive analytics integration." />
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
                <Smartphone className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                App Development
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                We build iOS and Android apps with robust CI/CD pipelines, comprehensive analytics, and seamless user experiences.
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
                  onClick={() => window.open("https://app.cal.eu/zervitra", "_blank")}
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
              <h2 className="text-4xl font-bold text-foreground mb-4">App Features</h2>
              <p className="text-xl text-muted-foreground">What makes our apps exceptional</p>
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

        {/* Platforms & Services */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold text-foreground mb-6">Platforms We Build For</h2>
                <div className="space-y-4">
                  {platforms.map((platform) => (
                    <div key={platform} className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-4" />
                      <span className="text-lg text-muted-foreground">{platform}</span>
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
                <h2 className="text-4xl font-bold text-foreground mb-6">What We Build</h2>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service} className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-success mr-4" />
                      <span className="text-lg text-muted-foreground">{service}</span>
                    </div>
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
              Ready to Launch Your App?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss your app idea and bring it to life.
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

export default AppDevelopment;