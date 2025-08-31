import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Award, Shield, Zap, Target, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Results-Driven",
      description: "Every project we take on is designed to deliver measurable business outcomes and ROI."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Speed & Quality",
      description: "We move fast without compromising on quality, delivering exceptional products on time."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security First",
      description: "Built-in security practices ensure your data and users are always protected."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Perspective",
      description: "Our remote-first team brings diverse perspectives from around the world."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "We deep-dive into your business goals, user needs, and technical requirements."
    },
    {
      step: "02", 
      title: "Design",
      description: "Research-driven design process that prioritizes user experience and conversion."
    },
    {
      step: "03",
      title: "Build",
      description: "Agile development with modern tech stacks and continuous integration."
    },
    {
      step: "04",
      title: "Launch",
      description: "Seamless deployment with monitoring, analytics, and performance optimization."
    },
    {
      step: "05",
      title: "Optimize",
      description: "Continuous improvement based on real user data and business metrics."
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Zervitra - Ship faster. Scale smarter.</title>
        <meta 
          name="description" 
          content="Learn about Zervitra's mission, values, and process. We build conversion-first products that help businesses grow faster and scale smarter." 
        />
        <meta name="keywords" content="about zervitra, company mission, development process, business values" />
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
                About Zervitra
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We're a team of passionate builders who believe that great products 
                can transform businesses and change lives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  At Zervitra, we believe that every business deserves access to world-class 
                  digital products. Our mission is to democratize innovation by making 
                  premium development services accessible, affordable, and results-driven.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're not just building software—we're building the future of how 
                  businesses connect with their customers, streamline their operations, 
                  and achieve their most ambitious goals.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="premium-glass rounded-3xl p-8 border border-white/10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">50+</div>
                      <div className="text-sm text-muted-foreground">Projects Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">98%</div>
                      <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                      <div className="text-sm text-muted-foreground">Support Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">5★</div>
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Values
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                These principles guide every decision we make and every project we deliver.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="premium-glass rounded-3xl p-6 text-center border border-white/10 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 
                                  flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Process
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A proven methodology that ensures successful outcomes for every project.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent 
                                    flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Connecting line */}
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                  )}
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
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss your project and see how we can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open("mailto:hello@zervitra.com?subject=Project Inquiry", "_blank")}
                className="px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_25px_-8px_hsl(var(--primary)/0.4)]"
              >
                Start a Project
              </button>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;