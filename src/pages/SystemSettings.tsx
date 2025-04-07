
import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Laptop, 
  Moon, 
  Sun, 
  Database, 
  Shield, 
  Clock,
  Globe,
  User,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const SystemSettings = () => {
  const { toast } = useToast();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [settingsUpdated, setSettingsUpdated] = useState(false);

  const handleSaveGeneralSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated.",
    });
    setSettingsUpdated(false);
  };

  const handleSaveSecuritySettings = () => {
    toast({
      title: "Security Settings Saved",
      description: "Your security settings have been updated.",
    });
    setSettingsUpdated(false);
  };

  const handleBackupDatabase = () => {
    toast({
      title: "Backup Started",
      description: "Database backup has been initiated.",
    });
    
    // Simulate backup process
    setTimeout(() => {
      toast({
        title: "Backup Completed",
        description: "Database backup completed successfully.",
      });
    }, 2000);
  };

  const handleValueChange = () => {
    setSettingsUpdated(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Maintenance</span>
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure application appearance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme Mode</label>
                <div className="flex space-x-2">
                  <Button
                    variant={themeMode === 'light' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setThemeMode('light');
                      setSettingsUpdated(true);
                    }}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={themeMode === 'dark' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setThemeMode('dark');
                      setSettingsUpdated(true);
                    }}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={themeMode === 'system' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      setThemeMode('system');
                      setSettingsUpdated(true);
                    }}
                  >
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Zone</label>
                <Select 
                  defaultValue="utc" 
                  onValueChange={handleValueChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Display times in your preferred time zone
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Format</label>
                <Select 
                  defaultValue="mdy" 
                  onValueChange={handleValueChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose how dates are displayed throughout the application
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select 
                  defaultValue="en" 
                  onValueChange={handleValueChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Application language (requires page refresh)
                </p>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">Enable Notifications</label>
                  <p className="text-xs text-muted-foreground">
                    Show in-app notifications for system events
                  </p>
                </div>
                <Switch defaultChecked onCheckedChange={handleValueChange} />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">Dashboard Auto-Refresh</label>
                  <p className="text-xs text-muted-foreground">
                    Automatically refresh dashboard data every 5 minutes
                  </p>
                </div>
                <Switch defaultChecked onCheckedChange={handleValueChange} />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button 
                className="ml-auto" 
                onClick={handleSaveGeneralSettings}
                disabled={!settingsUpdated}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Timeout</label>
                <Select defaultValue="30" onValueChange={handleValueChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Automatically log out after period of inactivity
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Password Policy</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm">Minimum Length</label>
                    </div>
                    <Select defaultValue="8" onValueChange={handleValueChange}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm">Require Uppercase</label>
                    </div>
                    <Switch defaultChecked onCheckedChange={handleValueChange} />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm">Require Numbers</label>
                    </div>
                    <Switch defaultChecked onCheckedChange={handleValueChange} />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm">Require Special Characters</label>
                    </div>
                    <Switch defaultChecked onCheckedChange={handleValueChange} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Two-Factor Authentication</label>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm">Require 2FA for All Users</label>
                    <p className="text-xs text-muted-foreground">
                      Force all users to set up two-factor authentication
                    </p>
                  </div>
                  <Switch defaultChecked={false} onCheckedChange={handleValueChange} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Login Restrictions</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm">IP Address Restrictions</label>
                      <p className="text-xs text-muted-foreground">
                        Limit access to specific IP addresses
                      </p>
                    </div>
                    <Switch defaultChecked={false} onCheckedChange={handleValueChange} />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm">Lock Account After Failed Attempts</label>
                    </div>
                    <Select defaultValue="5" onValueChange={handleValueChange}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Attempts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="0">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button 
                className="ml-auto" 
                onClick={handleSaveSecuritySettings}
                disabled={!settingsUpdated}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Maintenance Settings Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Settings</CardTitle>
              <CardDescription>
                Database and system maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Database Management</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Automatic Backups</label>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm">Enable scheduled database backups</p>
                      </div>
                      <Switch defaultChecked onCheckedChange={handleValueChange} />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <p className="text-sm">Backup frequency:</p>
                      <Select defaultValue="daily" onValueChange={handleValueChange}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Manual Backup</h4>
                      <p className="text-xs text-muted-foreground">
                        Create a backup of the database right now
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleBackupDatabase}>
                      <Database className="mr-2 h-4 w-4" />
                      Backup Now
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Download Backup</h4>
                      <p className="text-xs text-muted-foreground">
                        Download the most recent database backup
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Logging</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm">Enable Debug Logging</label>
                      <p className="text-xs text-muted-foreground">
                        Store detailed debug information (may impact performance)
                      </p>
                    </div>
                    <Switch defaultChecked={false} onCheckedChange={handleValueChange} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Log Retention Period</label>
                    <Select defaultValue="30" onValueChange={handleValueChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Automatically purge logs older than the selected period
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">System Information</h3>
                
                <div className="bg-muted/20 rounded-md p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Version:</span>
                    <span className="text-sm">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Database:</span>
                    <span className="text-sm">SQLite 3.36.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Backup:</span>
                    <span className="text-sm">2023-12-28 04:30 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Database Size:</span>
                    <span className="text-sm">24.8 MB</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 justify-between">
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                View System Logs
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Settings Saved",
                  description: "Maintenance settings have been updated.",
                });
                setSettingsUpdated(false);
              }}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
