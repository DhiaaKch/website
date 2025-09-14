import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex items-center justify-center mb-8">
          <Shield className="h-16 w-16 text-matrix animate-pulse-glow" />
        </div>
        
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-destructive mb-4 glitch-text" data-text="404">
            404
          </h1>
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-accent mr-2" />
            <p className="text-xl text-muted-foreground">Access Denied - Path Not Found</p>
          </div>
          <p className="text-terminal font-mono text-sm mb-6">
            The requested security endpoint does not exist in our system
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="btn-hack bg-primary hover:bg-primary/90 cyber-glow">
              <Home className="h-4 w-4 mr-2" />
              Return to Security Hub
            </Button>
          </Link>
          
          <div className="text-xs text-muted-foreground">
            <p>Error Code: SEC_404_ENDPOINT_NOT_FOUND</p>
            <p className="text-terminal">Path: {location.pathname}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
