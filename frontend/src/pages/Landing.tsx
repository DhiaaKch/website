import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Zap, Lock, Eye, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-scanner.jpg";

const Landing = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Advanced Vulnerability Scanner";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between border-b border-matrix">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-matrix animate-pulse-glow" />
          <span className="text-2xl font-bold glitch-text" data-text="VulnShield">
            VulnShield
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="btn-hack">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="btn-hack bg-primary hover:bg-primary/90">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-20 pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold tracking-tight mb-4">
              <span className="text-matrix matrix-text">Enterprise-Grade</span>
              <br />
              <span className="inline-block overflow-hidden border-r-2 border-primary animate-blink">
                {typedText}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-8">
              Detect, analyze, and eliminate security vulnerabilities before they become threats. 
              Protect your digital infrastructure with AI-powered scanning technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="btn-hack bg-primary text-lg px-8 py-4 cyber-glow">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="btn-hack text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto mb-8">
            <img 
              src={heroImage} 
              alt="VulnShield Security Scanner Interface"
              className="w-full h-auto rounded-lg border border-matrix cyber-glow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-lg"></div>
          </div>

          {/* Animated Scanner Display */}
          <div className="terminal-scan rounded-lg p-6 max-w-2xl mx-auto">
            <div className="text-left font-mono text-sm">
              <div className="text-terminal mb-2">$ vulnshield scan --target enterprise.com</div>
              <div className="text-cyber mb-1">[INFO] Initializing vulnerability scan...</div>
              <div className="text-matrix mb-1">[SCAN] Checking ports: 80, 443, 8080, 8443</div>
              <div className="text-accent mb-1">[DETECTED] SQL Injection vulnerability found</div>
              <div className="text-destructive mb-1">[CRITICAL] XSS vulnerability detected</div>
              <div className="text-matrix">[COMPLETE] Scan finished. 47 vulnerabilities found.</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <ChevronDown className="h-6 w-6 text-matrix animate-pulse" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-matrix mb-4">
              Why Choose VulnShield?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade security scanning with enterprise features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-matrix cyber-glow hover:bg-muted/50 transition-all duration-300">
              <Zap className="h-12 w-12 text-accent mb-4 animate-pulse-glow" />
              <h3 className="text-xl font-semibold text-matrix mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Advanced algorithms scan thousands of endpoints in minutes, not hours.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-matrix cyber-glow hover:bg-muted/50 transition-all duration-300">
              <Lock className="h-12 w-12 text-accent mb-4 animate-pulse-glow" />
              <h3 className="text-xl font-semibold text-matrix mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-grade encryption and compliance with SOC2, ISO27001 standards.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-matrix cyber-glow hover:bg-muted/50 transition-all duration-300">
              <Eye className="h-12 w-12 text-accent mb-4 animate-pulse-glow" />
              <h3 className="text-xl font-semibold text-matrix mb-3">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                24/7 continuous monitoring with instant alerts for new threats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-24 bg-gradient-to-r from-background to-muted">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-matrix mb-6">
            Ready to Secure Your Infrastructure?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of enterprises protecting their digital assets with VulnShield.
          </p>
          <Link to="/signup">
            <Button size="lg" className="btn-hack bg-primary text-lg px-12 py-4 cyber-glow">
              Start Your Security Scan <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-12 border-t border-matrix">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-matrix" />
            <span className="text-lg font-semibold text-matrix">VulnShield</span>
          </div>
          <p className="text-muted-foreground">
            Enterprise Vulnerability Scanning • Secure • Reliable • Professional
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;