import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bot, Workflow, Zap, Brain, Settings, BarChart3 } from "lucide-react";

const AIAutomations = () => {
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Chatbots",
      description: "Intelligent chatbots that handle customer inquiries, support tickets, and lead qualification 24/7."
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Workflow Automation",
      description: "Automate repetitive tasks and business processes with smart workflows that save time and reduce errors."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Process Optimization",
      description: "Identify bottlenecks and optimize your business processes with AI-powered analytics and suggestions."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Machine Learning",
      description: "Custom ML models for predictive analytics, demand forecasting, and personalized recommendations."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "System Integration",
      description: "Seamlessly connect your existing tools and platforms with AI-powered integrations."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Smart Analytics",
      description: "AI-driven insights and reports that help you make data-informed business decisions."
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI Automations | Zervitra - Smart Automation Solutions for Business</title>
        <meta 
          name="description" 
          content="Transform your business with AI-powered automation. From chatbots to workflow automation, we help you streamline operations and boost productivity." 
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
                <Bot className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-primary">AI</span>{" "}
                <span className="text-foreground">Automations</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Harness the power of artificial intelligence to automate your business processes. 
                From intelligent chatbots to complex workflow automation, we build solutions that work for you.
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
              <h2 className="text-3xl font-bold mb-4">Ready to Automate?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's explore how AI automation can transform your business operations and unlock new possibilities.
              </p>
              <a
                href="mailto:hello@zervitra.com?subject=AI Automation Inquiry"
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

export default AIAutomations;
