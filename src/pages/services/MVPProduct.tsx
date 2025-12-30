import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Rocket, Clock, Target, Lightbulb, TrendingUp, Users, Phone, Calendar } from "lucide-react";

const MVPProduct = () => {
  const features = [
    {
      icon: Clock,
      title: "Fast to Market",
      description: "Launch in weeks, not months, to validate your idea quickly"
    },
    {
      icon: Target,
      title: "Focused Features",
      description: "Only the essential features that matter to your users"
    },
    {
      icon: Lightbulb,
      title: "Validate Ideas",
      description: "Test assumptions with real users before scaling"
    },
    {
      icon: TrendingUp,
      title: "Investor Ready",
      description: "Professional MVP to impress investors and stakeholders"
    },
    {
      icon: Users,
      title: "User Feedback",
      description: "Built-in analytics to gather valuable user insights"
    },
    {
      icon: Rocket,
      title: "Scale Ready",
      description: "Architecture that grows with your success"
    }
  ];

  const process = [
    { week: "Week 1-2", title: "Discovery & Planning", description: "Define core features and user stories" },
    { week: "Week 3-4", title: "Design Sprint", description: "UI/UX design and prototyping" },
    { week: "Week 5-8", title: "Development", description: "Build, test, and iterate" },
    { week: "Week 9-10", title: "Launch & Learn", description: "Deploy and gather feedback" }
  ];

  const whyMvp = [
    "Reduce development costs by 60-80%",
    "Get user feedback before full investment",
    "Prove market demand to investors",
    "Iterate based on real data, not assumptions",
    "Launch faster than competitors",
    "Minimize risk of building wrong features"
  ];

  return (
    <>
      <Helmet>
        <title>MVP Development Services - Zervitra</title>
        <meta name="description" content="Validate ideas fast with investor-ready MVPs that minimize risk and maximize learning." />
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
                <Rocket className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                MVP Development
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                Validate your ideas fast with investor-ready MVPs that minimize risk and maximize learning.
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
              <h2 className="text-4xl font-bold text-foreground mb-4">MVP Benefits</h2>
              <p className="text-xl text-muted-foreground">Why smart startups build MVPs first</p>
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

        {/* Timeline */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">10-Week MVP Timeline</h2>
              <p className="text-xl text-muted-foreground">From idea to launch in record time</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, index) => (
                <motion.div
                  key={item.week}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="premium-glass rounded-2xl p-6 border border-white/10"
                >
                  <div className="text-primary font-bold text-sm mb-2">{item.week}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why MVP */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">Why Build an MVP?</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {whyMvp.map((reason, index) => (
                <motion.div
                  key={reason}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-muted-foreground">{reason}</span>
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
              Ready to Build Your MVP?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's validate your idea and get you to market fast.
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

export default MVPProduct;