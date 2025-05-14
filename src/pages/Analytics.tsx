
import { useState } from "react";
import { BarChart3, LineChart, PieChart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart as RechartLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartPie,
  Pie,
  Cell,
  Legend
} from "recharts";
import { mockAnalyticsData } from "@/data/mockData";
import { useTheme } from "@/context/ThemeContext";
import DraggableChartContainer from "@/components/charts/DraggableChartContainer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const COLORS = {
  light: ["#9b87f5", "#7E69AB", "#6163FF", "#B085F5", "#F97316", "#0EA5E9", "#D946EF"],
  dark: ["#A39BF0", "#8E7FC1", "#7A73B5", "#6C67A9", "#D946EF", "#0EA5E9", "#F97316"]
};

const StatsCard = ({ title, value, icon: Icon, trend }: { 
  title: string;
  value: string;
  icon: any;
  trend: string;
}) => {
  const { theme } = useTheme();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  const { theme } = useTheme();
  const [chartLayouts, setChartLayouts] = useState({
    dailyRequests: { order: 1 },
    requestTrends: { order: 2 },
    agentUsage: { order: 3 }
  });
  
  const [chartTypes, setChartTypes] = useState({
    dailyRequests: "bar",
    requestTrends: "line",
    agentUsage: "pie"
  });
  
  const colors = theme === "dark" ? COLORS.dark : COLORS.light;

  const handleChartTypeChange = (chartId: string, type: string) => {
    setChartTypes(prev => ({
      ...prev,
      [chartId]: type
    }));
  };

  const renderChart = (chartId: string, data: any[], dataKey: string, title: string) => {
    const chartType = chartTypes[chartId as keyof typeof chartTypes];
    
    return (
      <DraggableChartContainer title={title}>
        <div className="flex justify-end mb-4">
          <Select 
            value={chartType} 
            onValueChange={(value) => handleChartTypeChange(chartId, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey="date" stroke={theme === "dark" ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={theme === "dark" ? "#94a3b8" : "#64748b"} />
                <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff", borderColor: theme === "dark" ? "#334155" : "#e2e8f0" }} />
                <Legend />
                <Bar dataKey={dataKey} fill={colors[0]} name="Requests" />
              </BarChart>
            ) : chartType === "line" ? (
              <RechartLine data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey="date" stroke={theme === "dark" ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={theme === "dark" ? "#94a3b8" : "#64748b"} />
                <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff", borderColor: theme === "dark" ? "#334155" : "#e2e8f0" }} />
                <Legend />
                <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} name="Requests" />
              </RechartLine>
            ) : (
              <RechartPie>
                <Pie
                  data={mockAnalyticsData.agentUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockAnalyticsData.agentUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff", borderColor: theme === "dark" ? "#334155" : "#e2e8f0" }} />
                <Legend />
              </RechartPie>
            )}
          </ResponsiveContainer>
        </div>
      </DraggableChartContainer>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Platform performance and usage metrics.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests"
          value={mockAnalyticsData.totalRequests.toLocaleString()}
          icon={BarChart3}
          trend="+20.1% from last month"
        />
        <StatsCard
          title="Active Users"
          value={mockAnalyticsData.activeUsers.toString()}
          icon={Users}
          trend="+15% from last month"
        />
        <StatsCard
          title="Success Rate"
          value={`${(100 - mockAnalyticsData.errorRate * 100).toFixed(1)}%`}
          icon={LineChart}
          trend="+2.3% from last month"
        />
        <StatsCard
          title="Agent Usage"
          value={mockAnalyticsData.agentUsage.map(a => a.value).reduce((a,b) => a+b,0).toLocaleString()}
          icon={PieChart}
          trend="+12.5% from last month"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderChart("dailyRequests", mockAnalyticsData.requestsOverTime, "requests", "Daily Requests")}
        {renderChart("requestTrends", mockAnalyticsData.requestsOverTime, "requests", "Request Trends")}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {renderChart("agentUsage", mockAnalyticsData.agentUsage, "value", "Agent Usage Distribution")}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={cn("p-4 border rounded-lg", theme === "dark" ? "border-gray-700" : "border-gray-200")}>
              <h3 className="text-sm font-medium text-muted-foreground">Average Response Time</h3>
              <p className="text-2xl font-bold">{mockAnalyticsData.avgResponseTime}s</p>
            </div>
            <div className={cn("p-4 border rounded-lg", theme === "dark" ? "border-gray-700" : "border-gray-200")}>
              <h3 className="text-sm font-medium text-muted-foreground">Error Rate</h3>
              <p className="text-2xl font-bold">{(mockAnalyticsData.errorRate * 100).toFixed(1)}%</p>
            </div>
            <div className={cn("p-4 border rounded-lg", theme === "dark" ? "border-gray-700" : "border-gray-200")}>
              <h3 className="text-sm font-medium text-muted-foreground">Total Requests</h3>
              <p className="text-2xl font-bold">{mockAnalyticsData.totalRequests.toLocaleString()}</p>
            </div>
            <div className={cn("p-4 border rounded-lg", theme === "dark" ? "border-gray-700" : "border-gray-200")}>
              <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
              <p className="text-2xl font-bold">{mockAnalyticsData.activeUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
