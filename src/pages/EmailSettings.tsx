
import React, { useState } from 'react';
import { 
  Mail, 
  Server, 
  Lock, 
  User, 
  Save,
  ToggleLeft,
  ToggleRight,
  AlertCircle
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { EmailSettings as EmailSettingsType } from '@/types';

// Empty initial email settings
const emptyEmailSettings: EmailSettingsType = {
  smtpServer: '',
  port: 25,
  useSsl: false,
  username: '',
  password: '',
  defaultSender: '',
  fromAddress: '',
  enabled: false,
};

const formSchema = z.object({
  smtpServer: z.string().min(1, { message: "SMTP server is required" }),
  port: z.coerce.number().min(1).max(65535),
  useSsl: z.boolean().default(false),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  fromAddress: z.string().email({ message: "Valid email address is required" }),
  defaultSender: z.string().min(1, { message: "Default sender name is required" }),
  enabled: z.boolean().default(false),
});

const EmailSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<EmailSettingsType>(emptyEmailSettings);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Saving email settings:", data);
    
    // Here you would save the settings to the database
    // Make sure all required fields are set properly to match EmailSettingsType
    const updatedSettings: EmailSettingsType = {
      smtpServer: data.smtpServer,
      port: data.port,
      useSsl: data.useSsl,
      username: data.username,
      password: data.password,
      fromAddress: data.fromAddress,
      defaultSender: data.defaultSender,
      enabled: data.enabled,
    };
    
    setSettings(updatedSettings);
    
    toast({
      title: "Settings Saved",
      description: "Email settings have been updated successfully.",
    });
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    
    // This would be an API call to test the connection
    setTimeout(() => {
      setIsTestingConnection(false);
      setTestResult({
        success: true,
        message: "Connection to SMTP server successful!"
      });
      setShowTestDialog(true);
    }, 1500);
  };

  const timeZones = [
    { value: "UTC", label: "UTC" },
    { value: "America/Sao_Paulo", label: "America/Sao Paulo (GMT-03:00)" },
    { value: "America/New_York", label: "America/New York (GMT-05:00)" },
    { value: "Europe/London", label: "Europe/London (GMT+00:00)" },
    { value: "Europe/Paris", label: "Europe/Paris (GMT+01:00)" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+09:00)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
          <CardDescription>
            Configure the email server settings for sending notifications and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="smtpServer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Server</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Server className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="smtp.example.com" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="username@example.com" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fromAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="notifications@example.com" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="defaultSender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Sender Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Azure AD Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="useSsl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Use SSL/TLS</FormLabel>
                        <FormDescription>
                          Enable for secure connection
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Email</FormLabel>
                        <FormDescription>
                          Turn on email notifications
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
                
              <div className="space-y-4">
                <div>
                  <Label>Default Time Zone</Label>
                  <Select defaultValue="America/Sao_Paulo">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeZones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be used for scheduling reports and displaying timestamps
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? "Testing..." : "Test Connection"}
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Test Connection Dialog */}
      <AlertDialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {testResult?.success ? (
                <div className="flex items-center text-green-600">
                  <ToggleRight className="h-5 w-5 mr-2" />
                  Connection Successful
                </div>
              ) : (
                <div className="flex items-center text-destructive">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Connection Failed
                </div>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {testResult?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmailSettings;
