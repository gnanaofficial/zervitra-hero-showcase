import FloatingCard from "./FloatingCard";

const WavyFlow = () => {
  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop Wavy Line */}
        <div className="hidden lg:block relative">
          <svg 
            viewBox="0 0 1200 400" 
            className="w-full h-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M50 200 Q300 100 550 200 T1050 200"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            
            {/* Green Nodes */}
            <circle cx="150" cy="180" r="8" fill="hsl(var(--success))" className="animate-glow" />
            <circle cx="400" cy="140" r="8" fill="hsl(var(--success))" className="animate-glow" style={{ animationDelay: "0.5s" }} />
            <circle cx="650" cy="200" r="8" fill="hsl(var(--success))" className="animate-glow" style={{ animationDelay: "1s" }} />
            <circle cx="900" cy="160" r="8" fill="hsl(var(--success))" className="animate-glow" style={{ animationDelay: "1.5s" }} />
            <circle cx="1150" cy="200" r="8" fill="hsl(var(--success))" className="animate-glow" style={{ animationDelay: "2s" }} />
          </svg>

          {/* Floating Cards - Desktop */}
          <FloatingCard 
            title="research" 
            icon="research" 
            className="top-8 left-4 animate-float"
            delay="0.2s"
          />
          <FloatingCard 
            title="design" 
            icon="design" 
            className="top-32 right-1/3 animate-float"
            delay="0.4s"
          />
          <FloatingCard 
            title="develop" 
            icon="develop" 
            className="bottom-20 left-1/2 transform -translate-x-1/2 animate-float"
            delay="0.6s"
          />
          <FloatingCard 
            title="strategy" 
            icon="strategy" 
            className="top-16 right-8 animate-float"
            delay="0.8s"
          />
        </div>

        {/* Mobile Vertical Line */}
        <div className="lg:hidden relative flex flex-col items-center space-y-16">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border/50"></div>
          
          {/* Cards with Nodes - Mobile */}
          <div className="relative flex flex-col items-center space-y-20">
            {/* Research Card - Left */}
            <div className="relative flex items-center w-full">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-glow z-10"></div>
              <div className="mr-auto pr-8">
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
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-glow z-10" style={{ animationDelay: "0.5s" }}></div>
              <div className="ml-auto pl-8">
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
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-glow z-10" style={{ animationDelay: "1s" }}></div>
              <div className="mr-auto pr-8">
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
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-success animate-glow z-10" style={{ animationDelay: "1.5s" }}></div>
              <div className="ml-auto pl-8">
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