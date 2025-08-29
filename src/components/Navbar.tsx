import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = ["HOME", "SERVICES", "CASE STUDY", "ABOUT", "CONTACT"];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full px-6 py-4 lg:px-8 fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo - Left side */}
        <div className="flex items-center">
          <img
            src="/src/Resources/logo/zervimain.svg"
            alt="Zervitra Logo"
            className="h-8 w-auto sm:h-10 md:h-12 lg:h-14"
          />
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-nav-text hover:text-foreground transition-colors duration-300 text-sm font-medium"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Login Button - Hidden on mobile */}
        <div className="hidden md:block">
          <Button
            variant="outline"
            className="rounded-full border-2 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="p-2 text-foreground hover:bg-primary/10"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/20">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="block text-nav-text hover:text-foreground transition-colors duration-300 text-base font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <div className="pt-4 border-t border-border/20">
              <Button
                variant="outline"
                className="w-full rounded-full border-2 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
