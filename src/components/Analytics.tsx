import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const projectData = [
  { name: "Aug", value: 320, color: "hsl(263 70% 60%)" },
  { name: "Sept", value: 450, color: "hsl(142 76% 36%)" },
  { name: "Oct", value: 380, color: "hsl(142 76% 36%)" },
];

const activeUsersData = [
  { name: "Sep", users: 180 },
  { name: "Oct", users: 280 },
  { name: "Nov", users: 320 },
  { name: "Dec", users: 400 },
];

const techStackData = [
  { name: "React", value: 30, color: "hsl(142 76% 36%)" },
  { name: "Flutter", value: 25, color: "hsl(210 100% 60%)" },
  { name: "Node.js", value: 25, color: "hsl(263 70% 60%)" },
  { name: "Figma", value: 20, color: "hsl(220 100% 70%)" },
];

const serviceData = [
  { name: "Sep", value: 20 },
  { name: "Oct", value: 35 },
  { name: "Nov", value: 45 },
];

const Analytics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [feedbackScore, setFeedbackScore] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Animate the main counter
    const timer = setTimeout(() => {
      let current = 0;
      const target = 2438;
      const increment = target / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setAnimatedValue(Math.floor(current));
      }, 40);
    }, 500);

    // Animate feedback score
    const scoreTimer = setTimeout(() => {
      let current = 0;
      const target = 4.8;
      const increment = target / 30;
      const scoreInterval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(scoreInterval);
        }
        setFeedbackScore(parseFloat(current.toFixed(1)));
      }, 60);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(scoreTimer);
    };
  }, []);

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-background to-card/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <span className="text-primary">Project</span>{" "}
            <span className="text-foreground">Analytics</span>
          </h2>
          <p className={`text-subtext text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Real-time insights into our project performance and client satisfaction metrics
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Project Statistics Card */}
          <div className={`premium-glass rounded-3xl p-8 hover-lift transition-all duration-700 ${
            isVisible ? 'animate-slide-in-left' : ''
          }`} style={{ animationDelay: '0.3s' }}>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Project statistics</h3>
              <p className="text-muted-foreground text-sm">Visitors 1 day ago</p>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">
                {animatedValue.toLocaleString()}
              </span>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationBegin={800}
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Users Card */}
          <div className={`premium-glass rounded-3xl p-8 hover-lift transition-all duration-700 ${
            isVisible ? 'animate-bounce-in' : ''
          }`} style={{ animationDelay: '0.5s' }}>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">Active users</h3>
            </div>
            
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeUsersData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(142 76% 36%)" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(142 76% 36%)', strokeWidth: 2, r: 4 }}
                    fill="url(#activeUsersGradient)"
                    animationDuration={2000}
                    animationBegin={1000}
                  />
                  <defs>
                    <linearGradient id="activeUsersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Client Feedback Card */}
          <div className={`premium-glass rounded-3xl p-8 hover-lift transition-all duration-700 ${
            isVisible ? 'animate-slide-in-right' : ''
          }`} style={{ animationDelay: '0.7s' }}>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Client feedback</h3>
              
              {/* Circular Progress */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(142 76% 36%)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(feedbackScore / 5) * 251.2} 251.2`}
                      className="transition-all duration-1000 ease-out"
                      style={{ animationDelay: '1.5s' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">
                      {feedbackScore}<span className="text-sm text-muted-foreground">/5</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-8 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">UI/UX</span>
                  </div>
                  <span className="text-success font-semibold">+12%</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-8 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground">'Creative'</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-8 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground">Fast delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Demand Forecast Card */}
          <div className={`bg-success rounded-3xl p-8 hover-lift transition-all duration-700 ${
            isVisible ? 'animate-bounce-in' : ''
          }`} style={{ animationDelay: '0.9s' }}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Service</h3>
              <p className="text-white/80 text-sm mb-4">demand forecast</p>
              
              <div className="mb-4">
                <span className="text-white text-lg font-semibold">UI/UX</span>
                <br />
                <span className="text-white/90 font-semibold">+12%</span>
              </div>
            </div>
            
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serviceData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="rgba(255,255,255,0.8)" 
                    strokeWidth={2}
                    dot={{ fill: 'white', strokeWidth: 2, r: 3 }}
                    animationDuration={1800}
                    animationBegin={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tech Stack Popularity Card */}
          <div className={`md:col-span-2 lg:col-span-2 premium-glass rounded-3xl p-8 hover-lift transition-all duration-700 ${
            isVisible ? 'animate-slide-in-right' : ''
          }`} style={{ animationDelay: '1.1s' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">Tech stack popularity</h3>
                
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={techStackData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          animationBegin={1500}
                          animationDuration={1500}
                        >
                          {techStackData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">30%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="space-y-4">
                  {techStackData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full animate-glow"
                        style={{ backgroundColor: item.color, animationDelay: `${index * 0.2}s` }}
                      />
                      <span className="text-foreground font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;