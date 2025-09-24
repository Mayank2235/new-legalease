import { Navbar } from "@/components/Layout/Navbar";
import { Hero } from "@/components/Home/Hero";
import { Features } from "@/components/Home/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
};

export default Index;
