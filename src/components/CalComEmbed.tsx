import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from "lucide-react";
import { useState } from "react";

const CalComEmbed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openScheduler = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
            <div className="premium-glass rounded-3xl p-8 max-w-4xl mx-auto">
              {/* Cal.com inline embed will be added here */}
              <div className="min-h-[600px] flex items-center justify-center bg-muted/20 rounded-2xl">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Calendar Integration Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We're setting up our scheduling system. For now, please use the email option above.
                  </p>
                  <Button
                    onClick={() => window.open("mailto:hello@zervitra.com?subject=Project Inquiry", "_blank")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Contact Us Directly
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal for Cal.com (when implemented) */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-foreground">Schedule a Meeting</h3>
              <Button variant="ghost" onClick={closeModal}>
                ✕
              </Button>
            </div>
            
            {/* Cal.com embed content will go here */}
            <div className="min-h-[400px] flex items-center justify-center bg-muted/20 rounded-xl">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Calendar widget will be integrated here
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default CalComEmbed;