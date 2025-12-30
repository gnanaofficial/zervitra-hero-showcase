import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, X } from "lucide-react";
import { useState, useEffect } from "react";

const CAL_BASE_URL = "https://app.cal.eu";
const CAL_LINK = "zervitra";

const CalComEmbed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openScheduler = () => {
    // Use Cal.com's modal embed
    if ((window as any).Cal) {
      (window as any).Cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#7c3aed" } },
      });
      (window as any).Cal("openModal", {
        calLink: CAL_LINK,
        config: {
          layout: "month_view",
        },
      });
    } else {
      // Fallback to opening in new tab
      window.open(`${CAL_BASE_URL}/${CAL_LINK}`, "_blank");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Schedule a free consultation call to discuss your project requirements and get a detailed proposal.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 
                            flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Free Consultation</h3>
            <p className="text-muted-foreground">No commitment, just honest advice about your project</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 
                            flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">30-Minute Call</h3>
            <p className="text-muted-foreground">Quick but comprehensive discussion of your requirements</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 
                            flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Video or Phone</h3>
            <p className="text-muted-foreground">Choose the format that works best for you</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={openScheduler}
            size="lg"
            className="px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_25px_-8px_hsl(var(--primary)/0.4)]"
          >
            Schedule a Call
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            onClick={() => window.open("mailto:hello@zervitra.com", "_blank")}
          >
            Email Us Instead
          </Button>
        </motion.div>

        {/* Inline Cal.com Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="premium-glass rounded-3xl p-4 md:p-8 max-w-4xl mx-auto overflow-hidden">
            <div 
              className="cal-embed-container rounded-2xl overflow-hidden"
              style={{ minHeight: "600px" }}
            >
              <iframe
                src={`${CAL_BASE_URL}/${CAL_LINK}?embed=true&theme=dark&brandColor=%237c3aed`}
                width="100%"
                height="600"
                frameBorder="0"
                className="rounded-2xl"
                title="Schedule a meeting"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalComEmbed;