import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Analytics from "@/components/Analytics";
import WavyFlow from "@/components/WavyFlow";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Single Screen Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center">
          <Hero />
        </div>
      </div>

      {/* Analytics Section */}
      <Analytics />

      {/* Wavy Flow Section */}
      <div className="relative">
        <WavyFlow />
      </div>
    </div>
  );
};

export default Index;
