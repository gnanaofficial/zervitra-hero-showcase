import { PieChart, Palette, Code, Star } from "lucide-react";

interface FloatingCardProps {
  title: string;
  icon: "research" | "design" | "develop" | "strategy";
  className?: string;
}

const iconMap = {
  research: PieChart,
  design: Palette,
  develop: Code,
  strategy: Star,
};

const FloatingCard = ({ title, icon, className = "" }: FloatingCardProps) => {
  const Icon = iconMap[icon];

  return (
    <div
      className={`group relative z-10 premium-glass rounded-3xl p-6 w-72 lg:w-80 
                 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.15)] 
                 hover:shadow-[0_30px_80px_-10px_hsl(var(--primary)/0.25)] 
                 hover-lift animate-bounce-in 
                 border border-white/10 hover:border-primary/30 
                 transition-all duration-700 ease-out ${className}`}
    >
      {/* Icon and Works Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 
                        flex items-center justify-center backdrop-blur-sm border border-primary/30
                        animate-morphing-border group-hover:scale-110 transition-all duration-500">
          <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-floating-glow"></div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground font-semibold tracking-wide">ACTIVE</span>
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-lg shadow-success/50"></div>
            <div
              className="w-2.5 h-2.5 rounded-full bg-success/80 animate-pulse shadow-md shadow-success/30"
              style={{ animationDelay: "0.3s" }}
            ></div>
            <div
              className="w-2.5 h-2.5 rounded-full bg-success/60 animate-pulse shadow-sm shadow-success/20"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-foreground mb-6 capitalize tracking-tight
                     group-hover:text-primary transition-colors duration-500">
        {title}
      </h3>

      {/* Bullet Points - All cards have the same content as per design */}
      <ul className="space-y-3">
        <li className="text-sm text-muted-foreground flex items-center group/item">
          <span className="w-2 h-2 rounded-full bg-success mr-4 animate-pulse
                           group-hover/item:scale-125 transition-transform duration-300
                           shadow-sm shadow-success/50"></span>
          <span className="group-hover/item:text-foreground transition-colors duration-300">
            SWOT Analysis
          </span>
        </li>
        <li className="text-sm text-muted-foreground flex items-center group/item">
          <span
            className="w-2 h-2 rounded-full bg-success mr-4 animate-pulse
                       group-hover/item:scale-125 transition-transform duration-300
                       shadow-sm shadow-success/50"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span className="group-hover/item:text-foreground transition-colors duration-300">
            Competitor Analysis
          </span>
        </li>
        <li className="text-sm text-muted-foreground flex items-center group/item">
          <span
            className="w-2 h-2 rounded-full bg-success mr-4 animate-pulse
                       group-hover/item:scale-125 transition-transform duration-300
                       shadow-sm shadow-success/50"
            style={{ animationDelay: "0.4s" }}
          ></span>
          <span className="group-hover/item:text-foreground transition-colors duration-300">
            Leads Funnel
          </span>
        </li>
      </ul>

      {/* Enhanced glossy overlay effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br 
                      from-white/20 via-transparent to-primary/5 
                      pointer-events-none group-hover:from-white/30 
                      transition-all duration-700"></div>
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r 
                      from-primary/20 via-transparent to-primary/20 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-700 
                      pointer-events-none animate-text-shimmer"></div>
    </div>
  );
};

export default FloatingCard;
