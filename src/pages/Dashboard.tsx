
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Groups, Server, Cloud, AlertTriangle, ActivitySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock data for the dashboard
const stats = {
  adUsers: 375,
  adGroups: 48,
  adComputers: 127,
  adServers: 3,
  o365Users: 310,
  o365Licenses: {
    total: 400,
    assigned: 310,
    available: 90
  },
  alerts: [
    { id: 1, message: "5 user accounts will expire in the next 7 days", severity: "warning" },
    { id: 2, message: "3 Microsoft 365 licenses are not assigned", severity: "info" },
    { id: 3, message: "Password reset requested for user john.doe", severity: "info" }
  ],
  recentActivities: [
    { id: 1, action: "User Created", target: "sarah.johnson", time: "2 hours ago", actor: "admin" },
    { id: 2, action: "Group Modified", target: "Marketing Team", time: "5 hours ago", actor: "admin" },
    { id: 3, action: "License Assigned", target: "david.smith", time: "1 day ago", actor: "system" },
    { id: 4, action: "Password Reset", target: "michael.brown", time: "1 day ago", actor: "helpdesk" }
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/ad-users/create')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Directory Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active users in your directory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AD Groups
            </CardTitle>
            <Groups className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adGroups}</div>
            <p className="text-xs text-muted-foreground">
              Security and distribution groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AD Servers
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adServers}</div>
            <p className="text-xs text-muted-foreground">
              Connected domain controllers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Microsoft 365 Licenses
            </CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.o365Licenses.available}</div>
            <p className="text-xs text-muted-foreground">
              Available of {stats.o365Licenses.total} total licenses
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Resource Distribution</CardTitle>
                <CardDescription>
                  Overview of your Active Directory resources
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Resource distribution chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>License Allocation</CardTitle>
                <CardDescription>
                  Microsoft 365 license distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">License allocation chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Directory Health</CardTitle>
                <CardDescription>
                  Status of your domain controllers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Primary DC</p>
                      <p className="text-xs text-muted-foreground">dc01.example.com</p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Secondary DC</p>
                      <p className="text-xs text-muted-foreground">dc02.example.com</p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Remote DC</p>
                      <p className="text-xs text-muted-foreground">dc03.example.com</p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">Slow Response</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Account activity and security status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Locked Accounts</p>
                    <p className="text-sm">2</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Disabled Accounts</p>
                    <p className="text-sm">14</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Expiring Accounts</p>
                    <p className="text-sm">5</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Password Resets (7 days)</p>
                    <p className="text-sm">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Notifications and warnings that require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.alerts.map(alert => (
                  <div key={alert.id} className="flex items-start p-3 rounded-md bg-muted/20">
                    <AlertTriangle className={`h-5 w-5 mr-3 ${
                      alert.severity === 'warning' ? 'text-amber-500' : 
                      alert.severity === 'error' ? 'text-red-500' : 
                      'text-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.severity === 'warning' ? 'Warning' : 
                         alert.severity === 'error' ? 'Error' : 
                         'Information'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Recent actions performed in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start">
                    <ActivitySquare className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}</span> - {activity.target}
                      </p>
                      <div className="flex text-xs text-muted-foreground mt-1">
                        <span>{activity.time}</span>
                        <span className="mx-1">•</span>
                        <span>by {activity.actor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
