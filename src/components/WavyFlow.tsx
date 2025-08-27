import FloatingCard from "./FloatingCard";

const WavyFlow = () => {
  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop Wavy Line */}
        <div className="hidden lg:block relative h-[500px]">
          <svg 
            viewBox="0 0 1200 400" 
            className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--border))" stopOpacity="0.3" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--border))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M50 200 Q300 120 550 200 T1050 200"
              stroke="url(#waveGradient)"
              strokeWidth="1.5"
              fill="none"
            />
            
            {/* Green Nodes positioned exactly on wave */}
            <circle cx="150" cy="175" r="6" fill="hsl(var(--success))" className="animate-glow" />
            <circle cx="400" cy="135" r="6" fill="hsl(var(--success))" className="animate-glow" style={{ animationDelay: "0.5s" }} />
            <circle cx="650" cy="200" r="6" fill="hsl(var(--success))" className="animate-glow" style={{ animationDelay: "1s" }} />
            <circle cx="900" cy="165" r="6" fill="hsl(var(--success))" className="animate-glow" style={{ animationDelay: "1.5s" }} />
          </svg>

          {/* Floating Cards - Positioned exactly along wave path */}
          <FloatingCard 
            title="research" 
            icon="research" 
            className="absolute top-4 left-8 animate-float"
            delay="0.2s"
          />
          <FloatingCard 
            title="design" 
            icon="design" 
            className="absolute top-0 left-1/4 transform -translate-x-1/2 animate-float"
            delay="0.4s"
          />
          <FloatingCard 
            title="develop" 
            icon="develop" 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-float"
            delay="0.6s"
          />
          <FloatingCard 
            title="strategy" 
            icon="strategy" 
            className="absolute top-8 right-8 animate-float"
            delay="0.8s"
          />
        </div>

        {/* Mobile Vertical Line */}
        <div className="lg:hidden relative flex flex-col items-center space-y-16 min-h-[800px]">
          {/* Vertical Line with gradient */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-border/30 via-primary/50 to-border/30"></div>
          
          {/* Cards with Nodes - Mobile */}
          <div className="relative flex flex-col items-center space-y-20">
            {/* Research Card - Left */}
            <div className="relative flex items-center w-full">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-success animate-glow z-10"></div>
              <div className="mr-auto pr-6 w-72">
                <FloatingCard 
                  title="research" 
                  icon="research" 
                  className="relative animate-float"
                  delay="0.2s"
                />
              </div>
            </div>

            {/* Design Card - Right */}
            <div className="relative flex items-center w-full">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-success animate-glow z-10" style={{ animationDelay: "0.5s" }}></div>
              <div className="ml-auto pl-6 w-72">
                <FloatingCard 
                  title="design" 
                  icon="design" 
                  className="relative animate-float"
                  delay="0.4s"
                />
              </div>
            </div>

            {/* Develop Card - Left */}
            <div className="relative flex items-center w-full">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-success animate-glow z-10" style={{ animationDelay: "1s" }}></div>
              <div className="mr-auto pr-6 w-72">
                <FloatingCard 
                  title="develop" 
                  icon="develop" 
                  className="relative animate-float"
                  delay="0.6s"
                />
              </div>
            </div>

            {/* Strategy Card - Right */}
            <div className="relative flex items-center w-full">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-success animate-glow z-10" style={{ animationDelay: "1.5s" }}></div>
              <div className="ml-auto pl-6 w-72">
                <FloatingCard 
                  title="strategy" 
                  icon="strategy" 
                  className="relative animate-float"
                  delay="0.8s"
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