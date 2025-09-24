import { Navbar } from "@/components/Layout/Navbar";
import { Features } from "@/components/Home/Features";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Features />
    </div>
  );
};

export default FeaturesPage; 