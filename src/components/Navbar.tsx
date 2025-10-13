import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Menu, X, Shield, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { scroller } from "react-scroll";
import SignOutConfirmDialog from "@/components/SignOutConfirmDialog";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "SERVICES", action: "scroll" },
    { label: "PRICING", path: "/pricing" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact" }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (item: typeof navItems[0]) => {
    setIsMenuOpen(false);
    
    if (item.action === "scroll") {
      if (location.pathname !== "/") {
        navigate("/#services");
      } else {
        scroller.scrollTo("services", {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          offset: -100
        });
      }
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate(role === 'admin' ? "/admin-login" : "/user-login");
    }
    setIsMenuOpen(false);
  };

  const getRoleBadge = () => {
    if (!role) return null;
    return (
      <Badge 
        variant={role === 'admin' ? 'destructive' : 'default'}
        className="ml-2 flex items-center gap-1"
      >
        {role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
        {role === 'admin' ? 'Admin' : 'Client'}
      </Badge>
    );
  };

  return (
    <nav className="w-full px-6 py-4 lg:px-8 fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo - Left side */}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <img
            src="/src/Resources/logo/zervimain.svg"
            alt="Zervitra Logo"
            className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 transition-transform hover:scale-105"
          />
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className="text-nav-text hover:text-foreground transition-colors duration-300 text-sm font-medium cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Auth Button - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <>
              <SignOutConfirmDialog onConfirm={signOut}>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign Out
                </Button>
              </SignOutConfirmDialog>
              {getRoleBadge()}
            </>
          )}
          <Button
            variant="outline"
            onClick={handleAuthAction}
            className="rounded-full border-2 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            {user ? "Dashboard" : "Login"}
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
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="block w-full text-left text-nav-text hover:text-foreground transition-colors duration-300 text-base font-medium py-2"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-border/20 space-y-2">
              {user && (
                <>
                  <div className="flex justify-center mb-2">
                    {getRoleBadge()}
                  </div>
                  <SignOutConfirmDialog onConfirm={signOut}>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      Sign Out
                    </Button>
                  </SignOutConfirmDialog>
                </>
              )}
              <Button
                variant="outline"
                onClick={handleAuthAction}
                className="w-full rounded-full border-2 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                {user ? "Dashboard" : "Login"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
