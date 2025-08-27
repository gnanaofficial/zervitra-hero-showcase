import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WavyFlow from "@/components/WavyFlow";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <WavyFlow />
    </div>
  );
};

export default Index;