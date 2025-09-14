import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData } from "@/api/api";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Shield, CheckCircle, TrendingUp, Target, Eye } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [vulnerabilityTypes, setVulnerabilityTypes] = useState<any[]>([]);
  const [activeScan, setActiveScan] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const data = await getDashboardData(token);
        setStats(data.stats || []);
        setRecentScans(data.recentScans || []);
        setVulnerabilityTypes(data.vulnerabilityTypes || []);
        setActiveScan(data.activeScan || null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const icons: any = { Shield, AlertTriangle, CheckCircle, TrendingUp, Activity };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-matrix mb-2">Security Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = icons[stat.icon] || Shield;
            return (
              <Card key={i} className="bg-card border-matrix cyber-glow hover:bg-muted/50 transition-all duration-300">
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color} animate-pulse-glow`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-matrix">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.change?.startsWith("+") ? "text-matrix" : "text-destructive"}>{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active Scan */}
        <Card className="bg-card border-matrix cyber-glow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-matrix">
              <Activity className="h-5 w-5 mr-2 animate-pulse-glow" /> Active Scan
            </CardTitle>
            <CardDescription>Latest scan target and status</CardDescription>
          </CardHeader>
          <CardContent>
            {activeScan ? (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-terminal">Target: {activeScan.target}</span>
                <Badge variant="secondary">{activeScan.status}</Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">No scans yet</p>
            )}
          </CardContent>
        </Card>

        {/* Vulnerability Types */}
        <Card className="bg-card border-matrix cyber-glow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-matrix">
              <Target className="h-5 w-5 mr-2 animate-pulse-glow" /> Vulnerability Types
            </CardTitle>
            <CardDescription>Last 3 findings of the latest scan</CardDescription>
          </CardHeader>
          <CardContent>
            {vulnerabilityTypes.map((vuln, i) => (
              <div key={i} className="flex justify-between items-center mb-2">
                <span>{vuln.type}</span>
                <Badge variant="outline">{vuln.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="bg-card border-matrix cyber-glow">
          <CardHeader>
            <CardTitle className="flex items-center text-matrix">
              <Eye className="h-5 w-5 mr-2 animate-pulse-glow" /> Recent Scans
            </CardTitle>
            <CardDescription>Latest scans</CardDescription>
          </CardHeader>
          <CardContent>
            {recentScans.map((scan, i) => (
              <div key={i} className="flex justify-between items-center mb-2 p-2 bg-muted/30 rounded">
                <span>{scan.target}</span>
                <Badge>{scan.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
