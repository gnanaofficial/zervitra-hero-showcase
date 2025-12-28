import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#DFDDDF"
            strokeWidth={1 + path.id * 0.05}
            strokeOpacity={Math.max(0.1, 1 - path.id * 0.1)}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 lg:py-24 pt-32 overflow-hidden">
      {/* Background Paths */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main Headline */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="text-[#ADB0F4]">WE TURN YOUR</span>
          </h1>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#DFDDDF] mt-4 leading-tight">
            IDEAS INTO EXCELLENCE
          </h2>
        </div>

        {/* Subtext */}
        <p
          className="text-subtext text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Consistent, reliable work delivered by a team of top-rated creative
          professionals designed to support your growth
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-hero-to hover:from-hero-from hover:to-primary text-white px-10 py-7 text-xl font-semibold shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 transform hover:scale-105"
            onClick={() => window.open("mailto:hello@zervitra.com?subject=Project Inquiry", "_blank")}
          >
            Start Your Project
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-2 border-primary/30 text-foreground hover:bg-primary/10 px-10 py-7 text-xl font-semibold transition-all duration-300 transform hover:scale-105"
            onClick={() => window.open("https://cal.com/zervitra/30min", "_blank")}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule a Call
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
