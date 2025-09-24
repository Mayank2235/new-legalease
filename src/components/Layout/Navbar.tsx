import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Menu, X, Moon, Sun, User } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: "client" | "lawyer" | "admin";
}

export const Navbar = ({ isAuthenticated = false, userRole }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">LegalEase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/features" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActivePath("/features") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Features
                </Link>
                {/* Removed public Find Lawyers link */}
                <Link 
                  to="/about" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActivePath("/about") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  About
                </Link>
              </>
            ) : (
              <>
                {userRole && (
                  <Badge variant={userRole === "lawyer" ? "lawyer" : userRole === "admin" ? "verified" : "default"}>
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </Badge>
                )}
                <Link 
                  to={`/${userRole}-dashboard`}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActivePath(`/${userRole}-dashboard`) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-9 w-9"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/features"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  {/* Removed public Find Lawyers link (mobile) */}
                  <Link
                    to="/about"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <div className="flex flex-col space-y-2 px-3 pt-4">
                    <Link to="/login">
                      <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="hero" className="w-full" onClick={() => setIsMenuOpen(false)}>
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to={`/${userRole}-dashboard`}
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="px-3 pt-4">
                    <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      Sign Out
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};