import FloatingCard from "./FloatingCard";
import { useEffect, useRef, useState } from "react";

const WavyFlow = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Show cards after line animation completes
            setTimeout(() => setShowCards(true), 800);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 lg:py-32 overflow-hidden 
                 bg-gradient-to-b from-background via-background/98 to-background/95
                 border-t border-border/20"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden lg:block relative min-h-[1000px]">
          {/* Enhanced Vertical Line with gradient */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full 
                       bg-gradient-to-b from-transparent via-primary/40 via-success/60 to-transparent 
                       transition-all duration-1500 ease-out ${
              isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            }`}
            style={{ transformOrigin: "center top" }}
          >
            <div className="absolute inset-0 w-full bg-gradient-to-b from-primary/20 to-success/20 blur-sm"></div>
          </div>

          {/* Cards with Nodes - Desktop Grid Layout */}
          <div className="relative grid grid-cols-1 gap-16 pt-16 pb-16">
            {/* Research Card - Left */}
            <div className="relative flex items-center justify-between">
              {/* Enhanced Glowing Node */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full 
                           bg-gradient-to-r from-success to-success/80 z-30 
                           shadow-lg shadow-success/60 transition-all duration-1200 ease-out ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75"></div>
              </div>
              <div
                className={`w-full flex justify-start transition-all duration-1200 ease-out ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-32"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                <FloatingCard
                  title="Research"
                  icon="research"
                  className="animate-slide-in-left"
                />
              </div>
            </div>

            {/* Analysis Card - Right */}
            <div className="relative flex items-center justify-between">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full 
                           bg-gradient-to-r from-success to-success/80 z-30 
                           shadow-lg shadow-success/60 transition-all duration-1200 ease-out ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "0.5s" }}
              >
                <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75"></div>
              </div>
              <div
                className={`w-full flex justify-end transition-all duration-1200 ease-out ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-32"
                }`}
                style={{ animationDelay: "0.7s" }}
              >
                <FloatingCard
                  title="Analysis"
                  icon="research"
                  className="animate-slide-in-right"
                />
              </div>
            </div>

            {/* Design Card - Left */}
            <div className="relative flex items-center justify-between">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full 
                           bg-gradient-to-r from-success to-success/80 z-30 
                           shadow-lg shadow-success/60 transition-all duration-1200 ease-out ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "0.8s" }}
              >
                <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75"></div>
              </div>
              <div
                className={`w-full flex justify-start transition-all duration-1200 ease-out ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-32"
                }`}
                style={{ animationDelay: "1s" }}
              >
                <FloatingCard
                  title="Design"
                  icon="design"
                  className="animate-slide-in-left"
                />
              </div>
            </div>

            {/* Develop Card - Right */}
            <div className="relative flex items-center justify-between">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full 
                           bg-gradient-to-r from-success to-success/80 z-30 
                           shadow-lg shadow-success/60 transition-all duration-1200 ease-out ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "1.1s" }}
              >
                <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75"></div>
              </div>
              <div
                className={`w-full flex justify-end transition-all duration-1200 ease-out ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-32"
                }`}
                style={{ animationDelay: "1.3s" }}
              >
                <FloatingCard
                  title="Develop"
                  icon="develop"
                  className="animate-slide-in-right"
                />
              </div>
            </div>

            {/* Strategy Card - Left */}
            <div className="relative flex items-center justify-between">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full 
                           bg-gradient-to-r from-success to-success/80 z-30 
                           shadow-lg shadow-success/60 transition-all duration-1200 ease-out ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "1.4s" }}
              >
                <div className="absolute inset-0 rounded-full bg-success animate-ping opacity-75"></div>
              </div>
              <div
                className={`w-full flex justify-start transition-all duration-1200 ease-out ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-32"
                }`}
                style={{ animationDelay: "1.6s" }}
              >
                <FloatingCard
                  title="Strategy"
                  icon="strategy"
                  className="animate-slide-in-left"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - No Dots */}
        <div className="lg:hidden relative flex flex-col items-center space-y-12 min-h-[900px]">
          {/* Enhanced Mobile Vertical Line without dots */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full 
                       bg-gradient-to-b from-transparent via-primary/30 via-success/50 to-transparent 
                       transition-all duration-1500 ease-out ${
              isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            }`}
            style={{ transformOrigin: "center top" }}
          >
            <div className="absolute inset-0 w-full bg-gradient-to-b from-primary/10 to-success/10 blur-sm"></div>
          </div>

          {/* Cards - Mobile Timeline */}
          <div className="relative flex flex-col items-center space-y-16 pt-12 pb-12 w-full max-w-md">
            {/* Research Card - Mobile Left */}
            <div className="relative flex items-center w-full">
              <div
                className={`w-full flex justify-center transition-all duration-1000 ease-out ${
                  showCards
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <FloatingCard
                  title="Research"
                  icon="research"
                  className="animate-fade-in-up"
                />
              </div>
            </div>

            {/* Analysis Card - Mobile Center */}
            <div className="relative flex items-center w-full">
              <div
                className={`w-full flex justify-center transition-all duration-1000 ease-out ${
                  showCards
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                <FloatingCard
                  title="Analysis"
                  icon="research"
                  className="animate-fade-in-up"
                />
              </div>
            </div>

            {/* Design Card - Mobile Center */}
            <div className="relative flex items-center w-full">
              <div
                className={`w-full flex justify-center transition-all duration-1000 ease-out ${
                  showCards
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: "0.6s" }}
              >
                <FloatingCard
                  title="Design"
                  icon="design"
                  className="animate-fade-in-up"
                />
              </div>
            </div>

            {/* Develop Card - Mobile Center */}
            <div className="relative flex items-center w-full">
              <div
                className={`w-full flex justify-center transition-all duration-1000 ease-out ${
                  showCards
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: "0.8s" }}
              >
                <FloatingCard
                  title="Develop"
                  icon="develop"
                  className="animate-fade-in-up"
                />
              </div>
            </div>

            {/* Strategy Card - Mobile Center */}
            <div className="relative flex items-center w-full">
              <div
                className={`w-full flex justify-center transition-all duration-1000 ease-out ${
                  showCards
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: "1s" }}
              >
                <FloatingCard
                  title="Strategy"
                  icon="strategy"
                  className="animate-fade-in-up"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WavyFlow;
