import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  Eye,
  Trash2,
  X
} from "lucide-react";
import {
  getScanHistory,
  getScanFindings,
  ScanHistory,
  ScanFinding
} from "@/api/api";

const History = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [findings, setFindings] = useState<ScanFinding[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanHistory | null>(null);

  const token = localStorage.getItem("token");

  // Redirect if token is missing
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const history = await getScanHistory(token!);
      setScanHistory(history);
    } catch (error) {
      console.error("Failed to fetch scan history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFindings = async (scan: ScanHistory) => {
    try {
      setSelectedScan(scan);
      const data = await getScanFindings(scan.id, token!);
      setFindings(data);
    } catch (error) {
      console.error("Failed to fetch findings:", error);
    }
  };

  const handleCloseFindings = () => {
    setSelectedScan(null);
    setFindings([]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-matrix";
    if (score >= 7.0) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 8.5) return "Excellent";
    if (score >= 7.0) return "Good";
    if (score >= 5.0) return "Poor";
    return "Critical";
  };

  const filteredHistory = scanHistory.filter((scan) => {
    const matchesSearch = scan.target
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filterSeverity === "all") return matchesSearch;

    switch (filterSeverity) {
      case "critical":
        return matchesSearch && scan.critical > 0;
      case "high":
        return matchesSearch && scan.high > 0;
      case "clean":
        return matchesSearch && scan.total_vulns === 0;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-matrix mb-2">Scan History</h1>
          <p className="text-muted-foreground">
            View and manage your vulnerability scan history
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-card border-matrix cyber-glow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-matrix">
              <Filter className="h-5 w-5 mr-2 animate-pulse-glow" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by target URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-matrix focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                {["all", "critical", "high", "clean"].map((filter) => (
                  <Button
                    key={filter}
                    variant={filterSeverity === filter ? "default" : "outline"}
                    onClick={() => setFilterSeverity(filter)}
                    className="btn-hack"
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : filteredHistory.length === 0 ? (
          <Card className="bg-card border-matrix cyber-glow">
            <CardContent className="p-12 text-center">
              <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No scan history found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterSeverity !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by running your first vulnerability scan"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((scan) => (
              <Card
                key={scan.id}
                className="bg-card border-matrix cyber-glow hover:bg-muted/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {scan.date} at {scan.time}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-matrix text-primary-foreground"
                      >
                        {scan.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="btn-hack"
                        onClick={() => handleViewFindings(scan)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="btn-hack">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="btn-hack hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Target Info */}
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold text-terminal mb-2">
                        {scan.target}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span>Duration: {scan.duration}</span>
                        <span>•</span>
                        <span>Vulnerabilities: {scan.total_vulns}</span>
                      </div>

                      {/* Vulnerability Breakdown */}
                      <div className="flex items-center space-x-4">
                        {scan.critical > 0 && (
                          <span className="text-sm text-destructive font-medium">
                            {scan.critical} Critical
                          </span>
                        )}
                        {scan.high > 0 && (
                          <span className="text-sm text-orange-500 font-medium">
                            {scan.high} High
                          </span>
                        )}
                        {scan.medium > 0 && (
                          <span className="text-sm text-yellow-500 font-medium">
                            {scan.medium} Medium
                          </span>
                        )}
                        {scan.low > 0 && (
                          <span className="text-sm text-green-500 font-medium">
                            {scan.low} Low
                          </span>
                        )}
                        {scan.total_vulns === 0 && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-matrix" />
                            <span className="text-sm text-matrix font-medium">
                              No vulnerabilities found
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Security Score */}
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-matrix/50">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">
                          Security Score
                        </div>
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            scan.score
                          )}`}
                        >
                          {scan.score}/10
                        </div>
                        <div
                          className={`text-sm font-medium ${getScoreColor(
                            scan.score
                          )}`}
                        >
                          {getScoreStatus(scan.score)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Findings Modal */}
        {selectedScan && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <Card className="max-w-3xl w-full max-h-[80vh] overflow-y-auto bg-card border-matrix cyber-glow relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3"
                onClick={handleCloseFindings}
              >
                <X className="h-5 w-5" />
              </Button>
              <CardHeader>
                <CardTitle className="text-matrix">
                  Findings for {selectedScan.target}
                </CardTitle>
                <CardDescription>
                  {findings.length} issue(s) detected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {findings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No findings available.
                  </p>
                ) : (
                  findings.map((finding) => (
                    <div
                      key={finding.id}
                      className="p-4 border border-matrix/50 rounded-lg bg-muted/20"
                    >
                      <h4 className="font-semibold text-terminal mb-1">
                        {finding.name || "Unnamed Vulnerability"}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Severity:{" "}
                        <span className="font-medium text-destructive">
                          {finding.severity}
                        </span>
                      </p>
                      {finding.description && (
                        <p className="text-sm mb-2">{finding.description}</p>
                      )}
                      {finding.solution && (
                        <p className="text-sm text-green-400">
                          Recommended Fix: {finding.solution}
                        </p>
                      )}
                      {finding.curl_command && (
                        <pre className="text-xs bg-black/40 p-2 rounded mt-2 overflow-x-auto">
                          {finding.curl_command}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
