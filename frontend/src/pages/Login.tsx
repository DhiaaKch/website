import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/api/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = {
        email: email,
        password: password,
      };

      const response = await login(user);
      localStorage.setItem("token", response.access_token);  
      
     
      toast({
        title: "Access Granted",
        description: "Welcome to VulnShield Dashboard",
      });

      navigate("/dashboard");
    } catch (error: any) {
      const detail = error?.response?.data?.detail;

      toast({
        title: "Access Denied",
        description:
          typeof detail === "string"
            ? detail
            : detail?.msg || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Shield className="h-10 w-10 text-matrix animate-pulse-glow" />
            <span
              className="text-2xl font-bold glitch-text"
              data-text="VulnShield"
            >
              VulnShield
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-matrix">Access Terminal</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card p-8 rounded-lg border border-matrix cyber-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-terminal">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-matrix focus:ring-primary focus:border-primary"
                placeholder="admin@vulnshield.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-terminal">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-matrix focus:ring-primary focus:border-primary pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary border-matrix rounded focus:ring-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-muted-foreground"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-accent transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-hack bg-primary hover:bg-primary/90 cyber-glow"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Accessing...
                </div>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Protected by enterprise-grade encryption</p>
          <p className="text-terminal">
            All access attempts are logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
