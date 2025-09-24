import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  FileText,
  Star
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Lawyers",
    description: "All lawyers are thoroughly vetted, licensed, and verified to ensure you get professional legal advice.",
    badge: "100% Verified"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Get legal help when you need it. Our lawyers are available around the clock for urgent matters.",
    badge: "Always Open"
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and secure payment processing with transparent pricing. No hidden fees or surprises.",
    badge: "Bank-Level Security"
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Chat directly with your assigned lawyer through our secure messaging platform.",
    badge: "Instant Response"
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Securely upload, share, and manage all your legal documents in one place.",
    badge: "Cloud Storage"
  },
  {
    icon: Star,
    title: "Expert Consultation",
    description: "Get specialized advice from lawyers who are experts in your specific legal area.",
    badge: "Specialized Experts"
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="verified" className="mb-4">
            Why Choose LegalEase
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Professional Legal Services{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of legal services with our comprehensive platform 
            designed to connect you with the right legal expertise.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-card"
            >
              <div className="space-y-4">
                {/* Icon */}
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-primary rounded-xl">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Check Icon */}
                <div className="flex items-center space-x-2 pt-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">Available Now</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Users className="w-4 h-4" />
            <span>Trusted by thousands of clients worldwide</span>
          </div>
          <div className="flex justify-center items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Lawyers</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};