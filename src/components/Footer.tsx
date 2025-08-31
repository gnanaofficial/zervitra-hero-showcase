import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-card to-background border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-6">
              <img
                src="/src/Resources/logo/zervimain.svg"
                alt="Zervitra Logo"
                className="h-10 w-auto"
              />
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              We build conversion-first products—web apps, mobile apps, and MVPs—designed to grow your business. 
              Ship faster. Scale smarter.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <a href="mailto:hello@zervitra.com" className="hover:text-primary transition-colors">
                  hello@zervitra.com
                </a>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-3 text-primary" />
                <span>Remote-First • Global Team</span>
              </div>
            </div>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/services/web-development"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/app-development"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  App Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/ui-ux-design"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  to="/services/mvp-product"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  MVP Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/social-media-marketing"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Social Media Marketing
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">Company</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Client Login
                </Link>
              </li>
            </ul>
            
            {/* Quick CTA */}
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              onClick={() => window.open("mailto:hello@zervitra.com?subject=Project Inquiry", "_blank")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-border/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Zervitra. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              <span className="text-muted-foreground">
                Made with ❤️ by Zervitra
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;