import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Play, 
  AlertTriangle, 
  Shield, 
  Info, 
  CheckCircle,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { startScan, ScanFinding } from "@/api/api"; 

const Scan = () => {
  const navigate = useNavigate();
  const [scanUrl, setScanUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const isValidUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
    } catch {
      return false;
    }
  };

  const handleScan = useCallback(async () => {
    if (!scanUrl) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(scanUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with https:// or http://",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResults(null);
    setScanError(null);

    try {
      // Simulate progress bar
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
          }
          return next;
        });
      }, 200);

      // Call the real scan API
      const findings = await startScan(scanUrl);

      const transformed = findings.map((f: ScanFinding, index: number) => ({
        id: index + 1,
        type: f.name || f.template_id,
        severity: f.severity?.toLowerCase() || "low",
        endpoint: f.host || scanUrl,
        description: f.description || "No description provided.",
        solution: f.solution || "Review the vulnerability and apply appropriate fixes.",
        matchedAt: f.matched_at,
        curlCommand: f.curl_command,
        extractedResults: f.extracted_results
      }));

      const countBySeverity = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      };

      for (const vuln of transformed) {
        const severity = vuln.severity.toLowerCase();
        if (countBySeverity[severity as keyof typeof countBySeverity] !== undefined) {
          countBySeverity[severity as keyof typeof countBySeverity]++;
        }
      }

      setScanResults({
        target: scanUrl,
        totalVulns: transformed.length,
        critical: countBySeverity.critical,
        high: countBySeverity.high,
        medium: countBySeverity.medium,
        low: countBySeverity.low,
        scanTime: "Unknown",
        vulnerabilities: transformed,
      });

      toast({
        title: "Scan Complete",
        description: `Found ${transformed.length} vulnerabilities in ${scanUrl}`,
      });

    } catch (err: any) {
      console.error("Scan error:", err);
      
      let errorMessage = "Failed to perform scan. Check backend or target.";
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setScanError(errorMessage);
      
      toast({
        title: "Scan Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  }, [scanUrl, toast]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-orange-500 text-primary-foreground";
      case "medium":
        return "bg-yellow-500 text-primary-foreground";
      case "low":
        return "bg-green-500 text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-matrix mb-2">Vulnerability Scanner</h1>
          <p className="text-muted-foreground">
            Scan your web applications for security vulnerabilities
          </p>
        </div>

        {/* Scan Configuration */}
        <Card className="bg-card border-matrix cyber-glow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-matrix">
              <Target className="h-5 w-5 mr-2 animate-pulse-glow" />
              Target Configuration
            </CardTitle>
            <CardDescription>
              Enter the URL of the application you want to scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scanUrl" className="text-terminal">
                  Target URL
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="scanUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={scanUrl}
                    onChange={(e) => setScanUrl(e.target.value)}
                    className="bg-input border-matrix focus:ring-primary focus:border-primary flex-1"
                    disabled={isScanning}
                  />
                  <Button
                    onClick={handleScan}
                    disabled={isScanning || !scanUrl}
                    className="btn-hack bg-primary hover:bg-primary/90 cyber-glow"
                  >
                    {isScanning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Scan
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-terminal">Scan Progress</span>
                    <span className="text-matrix">{Math.round(scanProgress)}%</span>
                  </div>
                  <Progress value={scanProgress} className="w-full" />
                  <div className="text-xs text-muted-foreground">
                    {scanProgress < 30 && "Initializing scan..."}
                    {scanProgress >= 30 && scanProgress < 60 && "Checking for common vulnerabilities..."}
                    {scanProgress >= 60 && scanProgress < 90 && "Deep scanning endpoints..."}
                    {scanProgress >= 90 && "Generating report..."}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {scanError && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <h3 className="font-semibold">Scan Failed</h3>
                  </div>
                  <p className="text-sm mt-2 text-destructive">{scanError}</p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>Possible causes:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Target server is not running or accessible</li>
                      <li>Nuclei is not properly installed on the backend</li>
                      <li>Network connectivity issues</li>
                      <li>Target URL might be blocked by firewall</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scan Results */}
        {scanResults && (
          <div className="space-y-6">
            {/* Results Summary */}
            <Card className="bg-card border-matrix cyber-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-matrix">
                  <Shield className="h-5 w-5 mr-2 animate-pulse-glow" />
                  Scan Results
                </CardTitle>
                <CardDescription>
                  Scan completed for {scanResults.target} in {scanResults.scanTime}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-matrix">{scanResults.totalVulns}</div>
                    <div className="text-sm text-muted-foreground">Total Issues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{scanResults.critical}</div>
                    <div className="text-sm text-muted-foreground">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{scanResults.high}</div>
                    <div className="text-sm text-muted-foreground">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{scanResults.medium}</div>
                    <div className="text-sm text-muted-foreground">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{scanResults.low}</div>
                    <div className="text-sm text-muted-foreground">Low</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerability Details */}
            {scanResults.vulnerabilities.length > 0 ? (
              <Card className="bg-card border-matrix cyber-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-matrix">
                    <AlertTriangle className="h-5 w-5 mr-2 animate-pulse-glow" />
                    Vulnerability Details
                  </CardTitle>
                  <CardDescription>
                    Detailed information about discovered vulnerabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scanResults.vulnerabilities.map((vuln: any) => (
                      <div
                        key={vuln.id}
                        className="p-4 bg-muted/30 rounded-lg border border-matrix/50 hover:bg-muted/50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <div>
                              <h3 className="font-semibold text-terminal">{vuln.type}</h3>
                              <p className="text-sm text-muted-foreground">
                                Endpoint: <span className="text-accent">{vuln.endpoint}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Matched at: <span className="text-accent">{vuln.matchedAt}</span>
                              </p>
                            </div>
                          </div>
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Description:</h4>
                            <p className="text-sm text-muted-foreground">{vuln.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Recommended Solution:</h4>
                            <p className="text-sm text-matrix">{vuln.solution}</p>
                          </div>

                          {vuln.extractedResults && vuln.extractedResults.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-1">Extracted Results:</h4>
                              <ul className="text-sm text-muted-foreground">
                                {vuln.extractedResults.map((result: string, idx: number) => (
                                  <li key={idx}>• {result}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {vuln.curlCommand && (
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-1">CURL Command:</h4>
                              <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                                {vuln.curlCommand}
                              </code>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-matrix/30">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Info className="h-3 w-3" />
                            <span>Template: {vuln.type}</span>
                          </div>
                          <Button variant="outline" size="sm" className="btn-hack">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-matrix cyber-glow">
                <CardHeader>
                  <CardTitle className="flex items-center text-matrix">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    No Vulnerabilities Found
                  </CardTitle>
                  <CardDescription>
                    The scan completed successfully and no vulnerabilities were detected
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        )}

        {/* Help Section */}
        {!scanResults && !isScanning && !scanError && (
          <Card className="bg-card border-matrix cyber-glow">
            <CardHeader>
              <CardTitle className="flex items-center text-matrix">
                <Info className="h-5 w-5 mr-2 animate-pulse-glow" />
                Scanning Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-terminal mb-2">What we scan for:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-matrix mr-2" />
                      SQL Injection vulnerabilities
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-matrix mr-2" />
                      Cross-Site Scripting (XSS)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-matrix mr-2" />
                      CSRF vulnerabilities
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-matrix mr-2" />
                      Security misconfigurations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 text-matrix mr-2" />
                      Authentication issues
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-terminal mb-2">Troubleshooting:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 text-accent mr-2" />
                      Ensure target server is running
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 text-accent mr-2" />
                      Check backend nuclei installation
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 text-accent mr-2" />
                      Verify network connectivity
                    </li>
                    <li className="flex items-center">
                      <AlertCircle className="h-3 w-3 text-accent mr-2" />
                      Try a different target URL
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Scan;