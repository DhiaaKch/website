import { Link, useLocation } from "react-router-dom";
import { Shield, Home, Search, History, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Scan", href: "/scan", icon: Search },
  { name: "History", href: "/history", icon: History },
  { name: "Contact", href: "/contact", icon: Mail },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-matrix cyber-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-matrix animate-pulse-glow" />
              <span className="text-xl font-bold glitch-text" data-text="VulnShield">
                VulnShield
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg cyber-glow"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};