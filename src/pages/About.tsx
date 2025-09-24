import { Navbar } from "@/components/Layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Users, Target, Award, Heart, Shield } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              About{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                LegalEase
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing the legal industry by making professional legal services 
              accessible, affordable, and transparent for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                LegalEase was founded with a simple yet powerful mission: to democratize access 
                to quality legal services. We believe that everyone deserves access to professional 
                legal advice, regardless of their financial situation or location.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                By connecting clients with verified lawyers through our innovative platform, 
                we're breaking down the barriers that have traditionally made legal services 
                inaccessible to many people.
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="verified">Est. 2023</Badge>
                <Badge variant="outline">10,000+ Clients Served</Badge>
              </div>
            </div>
            <div className="bg-gradient-card rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-gradient-primary rounded-lg inline-block mb-3">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Legal Expertise</h3>
                  <p className="text-sm text-muted-foreground">Verified lawyers across all practice areas</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-gradient-primary rounded-lg inline-block mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">Building trust through transparency</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-gradient-primary rounded-lg inline-block mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Technology-driven legal solutions</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-gradient-primary rounded-lg inline-block mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Care</h3>
                  <p className="text-sm text-muted-foreground">Client-focused approach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg inline-block mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Trust & Security</CardTitle>
                <CardDescription>
                  We prioritize the security and confidentiality of our clients' information 
                  and ensure all lawyers are thoroughly vetted.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg inline-block mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Quality & Excellence</CardTitle>
                <CardDescription>
                  We maintain high standards for all legal professionals on our platform 
                  and continuously monitor service quality.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="p-3 bg-gradient-primary rounded-lg inline-block mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>
                  We believe legal services should be accessible to everyone, regardless 
                  of their background or financial situation.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Leadership Team</CardTitle>
                <CardDescription>
                  Experienced professionals with backgrounds in law, technology, and business
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Legal Advisors</CardTitle>
                <CardDescription>
                  Expert lawyers who guide our platform development and quality standards
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Technology Team</CardTitle>
                <CardDescription>
                  Skilled developers and designers creating innovative legal solutions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 