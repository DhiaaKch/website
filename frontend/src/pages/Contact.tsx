import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock,
  Shield,
  Users,
  Headphones
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent Successfully",
        description: "Our security team will respond within 24 hours",
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        priority: "medium"
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Support",
      value: "security@vulnshield.com",
      description: "Primary contact for all inquiries"
    },
    {
      icon: Phone,
      label: "Emergency Hotline",
      value: "+1 (555) SEC-RITY",
      description: "24/7 security incident response"
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: "123 Cyber Security Blvd, Tech City, TC 12345",
      description: "Visit our security operations center"
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "24/7 Monitoring",
      description: "Round-the-clock security operations"
    }
  ];

  const supportTeams = [
    {
      icon: Shield,
      title: "Security Team",
      description: "Vulnerability research and incident response",
      email: "security@vulnshield.com"
    },
    {
      icon: Users,
      title: "Sales Team",
      description: "Enterprise solutions and partnerships",
      email: "sales@vulnshield.com"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Platform assistance and troubleshooting",
      email: "support@vulnshield.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-matrix mb-2">Contact Our Security Team</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our cybersecurity experts for support, partnerships, or security inquiries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Form */}
          <Card className="bg-card border-matrix cyber-glow">
            <CardHeader>
              <CardTitle className="flex items-center text-matrix">
                <Send className="h-5 w-5 mr-2 animate-pulse-glow" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-terminal">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-input border-matrix focus:ring-primary focus:border-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-terminal">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-input border-matrix focus:ring-primary focus:border-primary"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-terminal">
                    Company/Organization
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="bg-input border-matrix focus:ring-primary focus:border-primary"
                    placeholder="Acme Corporation"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-terminal">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-input border-matrix focus:ring-primary focus:border-primary"
                      placeholder="Security inquiry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-terminal">
                      Priority Level
                    </Label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full h-10 px-3 py-2 text-sm bg-input border border-matrix rounded-md focus:ring-primary focus:border-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-terminal">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-input border-matrix focus:ring-primary focus:border-primary resize-none"
                    placeholder="Please describe your inquiry, security concern, or how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-hack bg-primary hover:bg-primary/90 cyber-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Secure Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="bg-card border-matrix cyber-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-matrix">
                  <Mail className="h-5 w-5 mr-2 animate-pulse-glow" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <div className="font-medium text-terminal">{info.label}</div>
                          <div className="text-matrix font-mono text-sm">{info.value}</div>
                          <div className="text-xs text-muted-foreground">{info.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Support Teams */}
            <Card className="bg-card border-matrix cyber-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-matrix">
                  <Users className="h-5 w-5 mr-2 animate-pulse-glow" />
                  Specialized Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTeams.map((team, index) => {
                    const Icon = team.icon;
                    return (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg border border-matrix/50">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className="h-4 w-4 text-accent" />
                          <div className="font-medium text-terminal">{team.title}</div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {team.description}
                        </div>
                        <div className="text-xs text-matrix font-mono">{team.email}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="bg-card border-matrix cyber-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-center">
              <Shield className="h-5 w-5 text-matrix" />
              <span className="text-sm text-muted-foreground">
                All communications are encrypted and monitored for security purposes
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;