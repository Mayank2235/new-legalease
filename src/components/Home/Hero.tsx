import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Users, Shield } from "lucide-react";
import heroImage from "@/assets/legal-hero.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-background to-secondary/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Trust Badge */}
              <Badge variant="verified" className="text-sm px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Trusted by 10,000+ Clients
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Get Legal Help{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Today
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Connect with verified lawyers, get expert legal advice, and resolve your legal matters 
                with confidence. Professional legal services made simple and accessible.
              </p>
            </div>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Verified Lawyers",
                "24/7 Support",
                "Secure Payments",
                "Instant Consultations"
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register?role=client">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Get Legal Help Today
                </Button>
              </Link>
              <Link to="/register?role=lawyer">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Join as Lawyer
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 pt-6 border-t border-border">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background flex items-center justify-center"
                    >
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  Join 10,000+ satisfied clients
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
                <span className="text-sm text-muted-foreground font-medium ml-2">
                  4.9/5 Rating
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src={heroImage}
                alt="Professional legal services"
                className="w-full h-[600px] object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              
              {/* Floating Cards */}
              <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">500+ Lawyers Online</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-foreground">Verified & Licensed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};