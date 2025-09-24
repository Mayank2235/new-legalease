import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, Scale, UserCheck } from "lucide-react";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"client" | "lawyer" | "admin">("client");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { ...formData, role: selectedRole });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const roleConfig = {
    client: {
      icon: User,
      title: "Client Login",
      description: "Access your legal consultations and documents",
      badge: "Client Portal"
    },
    lawyer: {
      icon: Scale,
      title: "Lawyer Login", 
      description: "Manage your clients and legal practice",
      badge: "Lawyer Portal"
    },
    admin: {
      icon: UserCheck,
      title: "Admin Login",
      description: "System administration and management",
      badge: "Admin Portal"
    }
  };

  const currentConfig = roleConfig[selectedRole];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-gradient-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <CurrentIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Badge variant="verified" className="mb-2">
              {currentConfig.badge}
            </Badge>
            <CardTitle className="text-2xl font-bold text-foreground">
              {currentConfig.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {currentConfig.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Selector */}
          <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as typeof selectedRole)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="client" className="text-xs">Client</TabsTrigger>
              <TabsTrigger value="lawyer" className="text-xs">Lawyer</TabsTrigger>
              <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedRole} className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <label htmlFor="remember" className="text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Sign In to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to={`/register?role=${selectedRole}`} 
                className="text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};