import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navLinks = ["HOME", "SERVICES", "CASE STUDY", "ABOUT", "CONTACT"];

  return (
    <nav className="w-full px-6 py-4 lg:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-hero-from to-hero-to flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <span className="text-foreground font-bold text-xl">ZERVITRA</span>
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

        {/* Login Button */}
        <Button 
          variant="outline" 
          className="rounded-full border-2 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
        >
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;