
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Database, 
  Key, 
  Shield, 
  Zap, 
  PieChart, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  // Start with empty stats instead of mock data
  const [stats, setStats] = useState({
    activeDirectoryUsers: 0,
    activeDirectoryServers: 0,
    groups: 0,
    licenses: 0,
    licensesAssigned: 0,
    webAppUsers: 0
  });

  // Initialize with empty arrays for charts
  const [chartData, setChartData] = useState({
    userActivity: [],
    licenseDistribution: []
  });

  // Load data from backend (simulated)
  useEffect(() => {
    // This would normally fetch data from the server
    // For now, we'll just set it to empty stats
    console.log("Dashboard loaded - would fetch stats from backend");
  }, []);

  // Empty pie chart data
  const colors = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline">Refresh Data</Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Directory Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeDirectoryUsers}</div>
                <p className="text-xs text-muted-foreground">
                  From {stats.activeDirectoryServers} servers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  AD Groups
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.groups}</div>
                <p className="text-xs text-muted-foreground">
                  Security and distribution groups
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Licenses
                </CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.licensesAssigned} / {stats.licenses}</div>
                <p className="text-xs text-muted-foreground">
                  Microsoft 365 licenses assigned
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Web App Users
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.webAppUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Admin portal accounts
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Directory Servers
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeDirectoryServers}</div>
                <p className="text-xs text-muted-foreground">
                  Connected domain controllers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Online</div>
                <p className="text-xs text-muted-foreground">
                  All services running
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity to display
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>License Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {chartData.licenseDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.licenseDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name }) => name}
                        labelLine={false}
                      >
                        {chartData.licenseDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={colors[index % colors.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No license data to display
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Active Directory user activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.userActivity.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="logins" fill="#3b82f6" />
                    <Bar dataKey="changes" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  No user activity data to display
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="licenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>License Usage</CardTitle>
              <CardDescription>
                Microsoft 365 license usage and allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                No license data to display.
                <p className="mt-2">
                  License data will appear here after connecting to Microsoft 365.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
