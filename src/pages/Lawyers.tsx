import { useState } from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Star, Clock, Users, Phone, Mail, Calendar } from "lucide-react";

const LawyersPage = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock lawyer data for each practice area
  const lawyerData = {
    "Family Law": [
      {
        id: 1,
        name: "Sarah Johnson",
        title: "Family Law Specialist",
        rating: 4.9,
        experience: "15+ years",
        location: "New York, NY",
        phone: "+1 (555) 123-4567",
        email: "sarah.johnson@legalease.com",
        avatar: "SJ",
        verified: true,
        hourlyRate: "$250/hour"
      },
      {
        id: 2,
        name: "Michael Chen",
        title: "Divorce Attorney",
        rating: 4.8,
        experience: "12+ years",
        location: "Los Angeles, CA",
        phone: "+1 (555) 234-5678",
        email: "michael.chen@legalease.com",
        avatar: "MC",
        verified: true,
        hourlyRate: "$220/hour"
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        title: "Child Custody Expert",
        rating: 4.9,
        experience: "18+ years",
        location: "Chicago, IL",
        phone: "+1 (555) 345-6789",
        email: "emily.rodriguez@legalease.com",
        avatar: "ER",
        verified: true,
        hourlyRate: "$280/hour"
      }
    ],
    "Criminal Defense": [
      {
        id: 4,
        name: "David Thompson",
        title: "Criminal Defense Attorney",
        rating: 4.7,
        experience: "20+ years",
        location: "Miami, FL",
        phone: "+1 (555) 456-7890",
        email: "david.thompson@legalease.com",
        avatar: "DT",
        verified: true,
        hourlyRate: "$300/hour"
      },
      {
        id: 5,
        name: "Lisa Wang",
        title: "White Collar Crime Specialist",
        rating: 4.9,
        experience: "16+ years",
        location: "San Francisco, CA",
        phone: "+1 (555) 567-8901",
        email: "lisa.wang@legalease.com",
        avatar: "LW",
        verified: true,
        hourlyRate: "$350/hour"
      }
    ],
    "Personal Injury": [
      {
        id: 6,
        name: "Robert Martinez",
        title: "Personal Injury Lawyer",
        rating: 4.8,
        experience: "14+ years",
        location: "Houston, TX",
        phone: "+1 (555) 678-9012",
        email: "robert.martinez@legalease.com",
        avatar: "RM",
        verified: true,
        hourlyRate: "$200/hour"
      },
      {
        id: 7,
        name: "Jennifer Adams",
        title: "Medical Malpractice Expert",
        rating: 4.9,
        experience: "22+ years",
        location: "Boston, MA",
        phone: "+1 (555) 789-0123",
        email: "jennifer.adams@legalease.com",
        avatar: "JA",
        verified: true,
        hourlyRate: "$400/hour"
      }
    ],
    "Business Law": [
      {
        id: 8,
        name: "James Wilson",
        title: "Corporate Attorney",
        rating: 4.8,
        experience: "19+ years",
        location: "Seattle, WA",
        phone: "+1 (555) 890-1234",
        email: "james.wilson@legalease.com",
        avatar: "JW",
        verified: true,
        hourlyRate: "$350/hour"
      },
      {
        id: 9,
        name: "Amanda Foster",
        title: "Contract Law Specialist",
        rating: 4.7,
        experience: "13+ years",
        location: "Austin, TX",
        phone: "+1 (555) 901-2345",
        email: "amanda.foster@legalease.com",
        avatar: "AF",
        verified: true,
        hourlyRate: "$280/hour"
      }
    ],
    "Real Estate": [
      {
        id: 10,
        name: "Christopher Lee",
        title: "Real Estate Attorney",
        rating: 4.6,
        experience: "11+ years",
        location: "Denver, CO",
        phone: "+1 (555) 012-3456",
        email: "christopher.lee@legalease.com",
        avatar: "CL",
        verified: true,
        hourlyRate: "$180/hour"
      },
      {
        id: 11,
        name: "Rachel Green",
        title: "Property Law Expert",
        rating: 4.8,
        experience: "15+ years",
        location: "Portland, OR",
        phone: "+1 (555) 123-4567",
        email: "rachel.green@legalease.com",
        avatar: "RG",
        verified: true,
        hourlyRate: "$220/hour"
      }
    ],
    "Immigration Law": [
      {
        id: 12,
        name: "Carlos Mendez",
        title: "Immigration Attorney",
        rating: 4.9,
        experience: "17+ years",
        location: "Phoenix, AZ",
        phone: "+1 (555) 234-5678",
        email: "carlos.mendez@legalease.com",
        avatar: "CM",
        verified: true,
        hourlyRate: "$250/hour"
      },
      {
        id: 13,
        name: "Priya Patel",
        title: "Visa Specialist",
        rating: 4.7,
        experience: "12+ years",
        location: "Atlanta, GA",
        phone: "+1 (555) 345-6789",
        email: "priya.patel@legalease.com",
        avatar: "PP",
        verified: true,
        hourlyRate: "$200/hour"
      }
    ]
  };

  const handleViewLawyers = (area: string) => {
    setSelectedArea(area);
    setIsDialogOpen(true);
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Find the Right{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Legal Expert
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect with verified lawyers who specialize in your specific legal needs. 
              Get expert advice and representation you can trust.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center space-x-2 bg-background border border-border rounded-lg p-2 shadow-sm">
                <Search className="w-5 h-5 text-muted-foreground ml-3" />
                <input
                  type="text"
                  placeholder="Search for lawyers by practice area, location, or name..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
                <Button variant="hero" size="sm">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Practice Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Family Law",
              "Criminal Defense", 
              "Personal Injury",
              "Business Law",
              "Real Estate",
              "Immigration Law"
            ].map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{area}</CardTitle>
                  <CardDescription>
                    Expert legal services in {area.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">500+ Lawyers</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewLawyers(area)}
                    >
                      View Lawyers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Verified Lawyers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Successful Cases</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lawyers Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {selectedArea} Lawyers
            </DialogTitle>
            <DialogDescription>
              Browse verified lawyers specializing in {selectedArea?.toLowerCase()}. 
              All lawyers are thoroughly vetted and licensed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            {selectedArea && lawyerData[selectedArea as keyof typeof lawyerData]?.map((lawyer) => (
              <Card key={lawyer.id} className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`/avatars/${lawyer.avatar.toLowerCase()}.jpg`} />
                    <AvatarFallback className="text-lg font-semibold">
                      {lawyer.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{lawyer.name}</h3>
                        <p className="text-sm text-muted-foreground">{lawyer.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {lawyer.verified && (
                          <Badge variant="verified" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{lawyer.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {lawyer.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lawyer.experience}
                      </div>
                      <div className="font-medium text-primary">
                        {lawyer.hourlyRate}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Book Consultation
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LawyersPage; 