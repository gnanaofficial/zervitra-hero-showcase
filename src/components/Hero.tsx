import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-16 lg:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Main Headline */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
              WE TURN YOUR
            </span>
          </h1>
          <div className="mt-2">
            <span className="text-lg md:text-xl text-nav-text font-medium tracking-widest">
              INTO
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mt-2 leading-tight">
            IDEA'S EXCELLENCE
          </h2>
        </div>

        {/* Subtext */}
        <p className="text-subtext text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Consistent, reliable work delivered by a team of top-rated creative 
          professionals designed to support your growth
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button 
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-hero-to hover:from-hero-from hover:to-primary text-white px-8 py-6 text-lg font-semibold shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 transform hover:scale-105"
          >
            Start Your Project
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;