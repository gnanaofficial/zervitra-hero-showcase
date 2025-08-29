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
      className="relative w-full py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop Vertical Line */}
        <div className="hidden lg:block relative h-[800px]">
          {/* Vertical Line with gradient - initially hidden */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-border/40 via-primary/60 via-success/70 to-border/40 transition-all duration-1000 ${
              isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            }`}
            style={{ transformOrigin: "center top" }}
          ></div>

          {/* Cards with Nodes - Desktop */}
          <div className="relative flex flex-col items-center space-y-24 pt-12">
            {/* Research Card 1 - Left */}
            <div className="relative flex items-center pr-80">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className={`mr-auto pr-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-20"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <FloatingCard
                  title="Research"
                  icon="research"
                  className="relative"
                />
              </div>
            </div>

            {/* Analysis Card - Right */}
            <div className="relative flex items-center pl-80">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className={`ml-auto pl-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-20"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                <FloatingCard
                  title="Analysis"
                  icon="research"
                  className="relative"
                />
              </div>
            </div>

            {/* Design Card - Left */}
            <div className="relative flex pr-80">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className={`mr-auto pr-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-20"
                }`}
                style={{ animationDelay: "0.6s" }}
              >
                <FloatingCard
                  title="Design"
                  icon="design"
                  className="relative"
                />
              </div>
            </div>

            {/* Develop Card - Right */}
            <div className="relative flex items-center w-full">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "1.5s" }}
              ></div>
              <div
                className={`ml-auto pl-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-20"
                }`}
                style={{ animationDelay: "0.8s" }}
              >
                <FloatingCard
                  title="Develop"
                  icon="develop"
                  className="relative"
                />
              </div>
            </div>

            {/* Strategy Card - Left (5th card) */}
            <div className="relative flex items-center w-full">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className={`mr-auto pr-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-20"
                }`}
                style={{ animationDelay: "1s" }}
              >
                <FloatingCard
                  title="Strategy"
                  icon="strategy"
                  className="relative"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Line */}
        <div className="lg:hidden relative flex flex-col items-center space-y-12 min-h-[800px]">
          {/* Vertical Line with gradient - initially hidden */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-border/40 via-primary/60 via-success/70 to-border/40 transition-all duration-1000 ${
              isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            }`}
            style={{ transformOrigin: "center top" }}
          ></div>

          {/* Cards with Nodes - Mobile */}
          <div className="relative flex flex-col items-center space-y-12 pt-8">
            {/* Research Card 1 - Left */}
            <div className="relative flex items-center w-full">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className={`mr-auto pr-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-20"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <FloatingCard
                  title="Research"
                  icon="research"
                  className="relative"
                />
              </div>
            </div>

            {/* Analysis Card - Right */}
            <div className="relative flex items-center w-full">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className={`ml-auto pl-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-20"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                <FloatingCard
                  title="Analysis"
                  icon="research"
                  className="relative"
                />
              </div>
            </div>

            {/* Design Card - Left */}
            <div className="relative flex items-center w-full">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className={`mr-auto pr-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-20"
                }`}
                style={{ animationDelay: "0.6s" }}
              >
                <FloatingCard
                  title="Design"
                  icon="design"
                  className="relative"
                />
              </div>
            </div>

            {/* Develop Card - Right */}
            <div className="relative flex items-center w-full">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "1.5s" }}
              ></div>
              <div
                className={`ml-auto pl-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-20"
                }`}
                style={{ animationDelay: "0.8s" }}
              >
                <FloatingCard
                  title="Develop"
                  icon="develop"
                  className="relative"
                />
              </div>
            </div>

            {/* Strategy Card - Left (5th card) */}
            <div className="relative flex items-center w-full">
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-pulse z-10 shadow-lg shadow-success/50 transition-all duration-1000 ${
                  showCards ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className={`mr-auto pr-4 w-72 transition-all duration-1000 ${
                  showCards
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-20"
                }`}
                style={{ animationDelay: "1s" }}
              >
                <FloatingCard
                  title="Strategy"
                  icon="strategy"
                  className="relative"
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
