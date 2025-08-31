import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code, Smartphone, Palette, Rocket, Share2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  index: number;
}

const ServiceCard = ({ title, description, icon, route, index }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="group relative premium-glass rounded-3xl p-8 cursor-pointer
                 shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.1)]
                 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.25)]
                 border border-white/5 hover:border-primary/20
                 transition-all duration-500 ease-out"
      onClick={() => navigate(route)}
    >
      {/* Icon */}
      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 
                      flex items-center justify-center mb-6
                      group-hover:scale-110 transition-all duration-300">
        <div className="text-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>

      {/* Features List */}
      <ul className="space-y-2 mb-6">
        <li className="text-sm text-muted-foreground flex items-center">
          <span className="w-2 h-2 rounded-full bg-success mr-3"></span>
          Modern Tech Stack
        </li>
        <li className="text-sm text-muted-foreground flex items-center">
          <span className="w-2 h-2 rounded-full bg-success mr-3"></span>
          Scalable Architecture
        </li>
        <li className="text-sm text-muted-foreground flex items-center">
          <span className="w-2 h-2 rounded-full bg-success mr-3"></span>
          Performance Focused
        </li>
      </ul>

      {/* CTA Button */}
      <Button
        variant="ghost"
        className="w-full text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        Learn More
      </Button>

      {/* Glossy overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br 
                      from-white/10 via-transparent to-primary/5 
                      pointer-events-none group-hover:from-white/15 
                      transition-all duration-500"></div>
    </motion.div>
  );
};

const OurServices = () => {
  const services = [
    {
      title: "Web Development",
      description: "SEO-ready, scalable web apps with modern stacks that drive conversions and grow your business.",
      icon: <Code className="w-8 h-8" />,
      route: "/services/web-development"
    },
    {
      title: "App Development",
      description: "iOS/Android apps with robust CI/CD pipelines and comprehensive analytics integration.",
      icon: <Smartphone className="w-8 h-8" />,
      route: "/services/app-development"
    },
    {
      title: "UI/UX Design",
      description: "Research-driven, accessible interfaces that convert visitors into customers effectively.",
      icon: <Palette className="w-8 h-8" />,
      route: "/services/ui-ux-design"
    },
    {
      title: "MVP Product",
      description: "Validate ideas fast with investor-ready MVPs that minimize risk and maximize learning.",
      icon: <Rocket className="w-8 h-8" />,
      route: "/services/mvp-product"
    },
    {
      title: "Social Media Marketing",
      description: "Content and performance marketing strategies that grow your pipeline and brand awareness.",
      icon: <Share2 className="w-8 h-8" />,
      route: "/services/social-media-marketing"
    },
    {
      title: "And More",
      description: "Custom integrations, automation workflows, and strategic consulting for your unique needs.",
      icon: <Plus className="w-8 h-8" />,
      route: "/services/more"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Our Services
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          From concept to scale, we deliver solutions that drive real business results. 
          Choose from our proven service offerings or let us create a custom solution for your needs.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            {...service}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default OurServices;