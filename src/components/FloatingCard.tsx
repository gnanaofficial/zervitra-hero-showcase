import { PieChart, Palette, Code, Target } from "lucide-react";

interface FloatingCardProps {
  title: string;
  icon: "research" | "design" | "develop" | "strategy";
  className?: string;
  delay?: string;
}

const iconMap = {
  research: PieChart,
  design: Palette,
  develop: Code,
  strategy: Target,
};

const FloatingCard = ({ title, icon, className = "", delay = "0s" }: FloatingCardProps) => {
  const Icon = iconMap[icon];
  
  return (
    <div 
      className={`absolute bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 w-64 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:scale-105 animate-scale-in ${className}`}
      style={{ animationDelay: delay }}
    >
      {/* Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-hero-to/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm text-nav-text font-medium">Works</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-success animate-glow"></div>
            <div className="w-2 h-2 rounded-full bg-success/60"></div>
            <div className="w-2 h-2 rounded-full bg-success/30"></div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-foreground mb-4 capitalize">{title}</h3>

      {/* Bullet Points */}
      <ul className="space-y-2">
        {icon === "research" && (
          <>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              SWOT Analysis
            </li>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Competitor Analysis
            </li>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Leads Funnel
            </li>
          </>
        )}
        {icon === "design" && (
          <>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              UI/UX Design
            </li>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Brand Identity
            </li>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Prototyping
            </li>
          </>
        )}
        {icon === "develop" && (
          <>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Frontend Development
            </li>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Backend Systems
            </li>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Testing & QA
            </li>
          </>
        )}
        {icon === "strategy" && (
          <>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Market Analysis
            </li>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Growth Planning
            </li>
            <li className="text-sm text-subtext flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-3"></span>
              Performance Metrics
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default FloatingCard;