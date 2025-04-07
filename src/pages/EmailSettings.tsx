
import React, { useState } from 'react';
import { 
  Mail, 
  Server, 
  Save, 
  Bell, 
  Send, 
  Check, 
  Clock,
  CheckCircle2, 
  XCircle 
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EmailSettings as EmailSettingsType } from '@/types';

// Mock data for email settings
const mockEmailSettings: EmailSettingsType = {
  smtpServer: 'smtp.example.com',
  port: 587,
  useSsl: true,
  username: 'notifications@example.com',
  password: '**********',
  fromAddress: 'notifications@example.com',
  enabled: true,
};

// Email notification types
const notificationTypes = [
  {
    id: 'user-created',
    name: 'User Created',
    description: 'Send notification when a new user is created',
    enabled: true,
  },
  {
    id: 'user-modified',
    name: 'User Modified',
    description: 'Send notification when a user is modified',
    enabled: false,
  },
  {
    id: 'user-deleted',
    name: 'User Deleted',
    description: 'Send notification when a user is deleted',
    enabled: true,
  },
  {
    id: 'group-modified',
    name: 'Group Modified',
    description: 'Send notification when a group is modified',
    enabled: false,
  },
  {
    id: 'password-reset',
    name: 'Password Reset',
    description: 'Send notification when a password is reset',
    enabled: true,
  },
  {
    id: 'license-assigned',
    name: 'License Assigned',
    description: 'Send notification when a license is assigned',
    enabled: false,
  },
  {
    id: 'license-unassigned',
    name: 'License Unassigned',
    description: 'Send notification when a license is unassigned',
    enabled: false,
  },
  {
    id: 'report-generated',
    name: 'Report Generated',
    description: 'Send notification when a report is generated',
    enabled: true,
  },
];

// Notification recipients
const notificationRecipients = [
  {
    id: 'r1',
    email: 'admin@example.com',
    name: 'System Administrator',
    allNotifications: true,
  },
  {
    id: 'r2',
    email: 'it@example.com',
    name: 'IT Department',
    allNotifications: false,
  },
  {
    id: 'r3',
    email: 'security@example.com',
    name: 'Security Team',
    allNotifications: false,
  },
];

const formSchema = z.object({
  smtpServer: z.string().min(1, { message: "SMTP server is required" }),
  port: z.coerce.number().int().positive({ message: "Port must be a positive number" }),
  useSsl: z.boolean().default(true),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  fromAddress: z.string().email({ message: "Valid email address is required" }),
  enabled: z.boolean().default(true),
});

const EmailSettings = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState<EmailSettingsType>(mockEmailSettings);
  const [notifications, setNotifications] = useState(notificationTypes);
  const [recipients, setRecipients] = useState(notificationRecipients);
  const [testEmailStatus, setTestEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [testEmailAddress, setTestEmailAddress] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: emailSettings,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setEmailSettings(data);
    toast({
      title: "Settings Saved",
      description: "Email notification settings have been updated.",
    });
  };

  const handleToggleNotification = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled } 
        : notification
    ));
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(recipient => recipient.id !== id));
    toast({
      title: "Recipient Removed",
      description: "The notification recipient has been removed.",
    });
  };

  const handleSendTestEmail = () => {
    if (!testEmailAddress) {
      toast({
        title: "Error",
        description: "Please enter an email address for the test.",
        variant: "destructive",
      });
      return;
    }
    
    setTestEmailStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        setTestEmailStatus('success');
        toast({
          title: "Test Email Sent",
          description: `A test email has been sent to ${testEmailAddress}.`,
        });
      } else {
        setTestEmailStatus('error');
        toast({
          title: "Error",
          description: "Failed to send test email. Please check your SMTP settings.",
          variant: "destructive",
        });
      }
      
      // Reset status after 3 seconds
      setTimeout(() => setTestEmailStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Email Notifications</h1>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">SMTP Settings</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notification Types</span>
          </TabsTrigger>
          <TabsTrigger value="recipients" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Recipients</span>
          </TabsTrigger>
        </TabsList>
        
        {/* SMTP Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Email Server Configuration</CardTitle>
              <CardDescription>
                Configure your SMTP server for sending email notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Server</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            The address of your SMTP server
                          </FormDescription>
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
                          <FormDescription>
                            Port for SMTP connection (typically 25, 465, or 587)
                          </FormDescription>
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
                            <Input placeholder="notifications@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Username for SMTP authentication
                          </FormDescription>
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
                            <Input type="password" placeholder="••••••••••" {...field} />
                          </FormControl>
                          <FormDescription>
                            Password for SMTP authentication
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fromAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Address</FormLabel>
                          <FormControl>
                            <Input placeholder="notifications@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Email address that will appear in the From field
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="useSsl"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Use SSL/TLS</FormLabel>
                            <FormDescription>
                              Enable encrypted connection to the SMTP server
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Turn on or off all email notifications
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
                  
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Email for test message"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        className="w-64"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleSendTestEmail}
                        disabled={testEmailStatus === 'sending'}
                      >
                        {testEmailStatus === 'idle' && (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Test Email
                          </>
                        )}
                        {testEmailStatus === 'sending' && (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        )}
                        {testEmailStatus === 'success' && (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            Sent Successfully
                          </>
                        )}
                        {testEmailStatus === 'error' && (
                          <>
                            <XCircle className="mr-2 h-4 w-4 text-destructive" />
                            Failed to Send
                          </>
                        )}
                      </Button>
                    </div>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Types Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configure Notification Types</CardTitle>
              <CardDescription>
                Choose which events should trigger email notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex flex-row items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">
                        {notification.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {notification.description}
                      </div>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => handleToggleNotification(notification.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="ml-auto" onClick={() => {
                toast({
                  title: "Notification Settings Saved",
                  description: "Your notification preferences have been updated.",
                });
              }}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Recipients Tab */}
        <TabsContent value="recipients">
          <Card>
            <CardHeader>
              <CardTitle>Notification Recipients</CardTitle>
              <CardDescription>
                Manage who receives email notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex flex-row items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <div className="text-base font-medium">
                        {recipient.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {recipient.email}
                      </div>
                      <div className="pt-1">
                        {recipient.allNotifications ? (
                          <Badge variant="default">All Notifications</Badge>
                        ) : (
                          <Badge variant="outline">Selected Notifications</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Bell className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveRecipient(recipient.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                
                {recipients.length === 0 && (
                  <div className="text-center py-8">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-2 text-lg font-medium">No recipients configured</h3>
                    <p className="text-sm text-muted-foreground">
                      Add recipients to receive email notifications
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Add Recipient
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSettings;
