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
      className={`relative z-10 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-64 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_40px_rgba(142,76,36,0.1)] hover:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.15),0_0_60px_rgba(142,76,36,0.2)] transition-all duration-500 hover:scale-105 animate-scale-in ${className}`}
    >
      {/* Icon and Works Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-hero-to/20 flex items-center justify-center backdrop-blur-sm border border-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">Works</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <div
              className="w-2 h-2 rounded-full bg-success/70 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-success/50 animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-success/30 animate-pulse"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-4 capitalize">
        {title}
      </h3>

      {/* Bullet Points - All cards have the same content as per design */}
      <ul className="space-y-2">
        <li className="text-sm text-gray-600 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-success mr-3 animate-pulse"></span>
          SWOT Analysis
        </li>
        <li className="text-sm text-gray-600 flex items-center">
          <span
            className="w-1.5 h-1.5 rounded-full bg-success mr-3 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></span>
          Competitor Analysis
        </li>
        <li className="text-sm text-gray-600 flex items-center">
          <span
            className="w-1.5 h-1.5 rounded-full bg-success mr-3 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></span>
          Leads Funnel
        </li>
      </ul>

      {/* Glossy overlay effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

export default FloatingCard;
