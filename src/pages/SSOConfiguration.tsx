
import React, { useState } from 'react';
import { 
  Shield, 
  Save, 
  FileCode, 
  Settings, 
  Link, 
  ExternalLink, 
  InfoIcon,
  Check, 
  X 
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Azure SSO Configuration form schema
const azureConfigSchema = z.object({
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  clientId: z.string().min(1, { message: "Client ID is required" }),
  clientSecret: z.string().min(1, { message: "Client Secret is required" }),
  redirectUri: z.string().url({ message: "Must be a valid URL" }),
  enabled: z.boolean().default(false),
  loginButtonText: z.string().min(1, { message: "Login button text is required" }),
  allowLocalLogin: z.boolean().default(true),
  defaultAdminGroup: z.string().optional(),
  defaultUserGroup: z.string().optional(),
  requireMfa: z.boolean().default(false),
});

const SSOConfiguration = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failure' | null>(null);
  
  const form = useForm<z.infer<typeof azureConfigSchema>>({
    resolver: zodResolver(azureConfigSchema),
    defaultValues: {
      tenantId: '',
      clientId: '',
      clientSecret: '',
      redirectUri: `${window.location.origin}/auth/azure/callback`,
      enabled: false,
      loginButtonText: 'Sign in with Microsoft',
      allowLocalLogin: true,
      defaultAdminGroup: '',
      defaultUserGroup: '',
      requireMfa: false,
    },
  });

  const onSubmit = (data: z.infer<typeof azureConfigSchema>) => {
    console.log('Saving SSO configuration:', data);
    
    setIsConfigured(true);
    toast({
      title: "SSO Configuration Saved",
      description: "Azure SSO has been configured successfully.",
    });
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setTestResult(success ? 'success' : 'failure');
      setIsTesting(false);
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Azure AD.",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Azure AD. Please check your configuration.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-azure" />
        <h1 className="text-3xl font-bold tracking-tight">SSO Configuration</h1>
      </div>

      <Tabs defaultValue="azure" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="azure" className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1H11V11H1V1Z" fill="#F25022"/>
              <path d="M12 1H22V11H12V1Z" fill="#7FBA00"/>
              <path d="M1 12H11V22H1V12Z" fill="#00A4EF"/>
              <path d="M12 12H22V22H12V12Z" fill="#FFB900"/>
            </svg>
            <span className="hidden sm:inline">Azure AD</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced Settings</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Azure SSO Tab */}
        <TabsContent value="azure">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Microsoft Azure AD SSO</CardTitle>
                  <CardDescription>
                    Configure Single Sign-On with Microsoft Azure Active Directory
                  </CardDescription>
                </div>
                {isConfigured && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" />
                    Configured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tenantId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Azure Tenant ID</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    The Directory (tenant) ID from your Azure AD application registration.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Input placeholder="e.g. 12345678-1234-1234-1234-123456789012" {...field} />
                          </FormControl>
                          <FormDescription>
                            Found in Azure Portal under App Registrations
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Application (Client) ID</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    The Application (client) ID from your Azure AD application registration.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <Input placeholder="e.g. 12345678-1234-1234-1234-123456789012" {...field} />
                          </FormControl>
                          <FormDescription>
                            Found in Azure Portal under App Registrations
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Secret</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••••••••••••••••" {...field} />
                          </FormControl>
                          <FormDescription>
                            Secret created in Certificates & Secrets section
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="redirectUri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Redirect URI</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input {...field} />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon" 
                                className="ml-2"
                                onClick={() => {
                                  navigator.clipboard.writeText(field.value);
                                  toast({
                                    title: "Copied",
                                    description: "Redirect URI copied to clipboard",
                                  });
                                }}
                              >
                                <FileCode className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Add this URL to your Azure App's redirect URIs
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="loginButtonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Login Button Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Sign in with Microsoft" {...field} />
                          </FormControl>
                          <FormDescription>
                            Text displayed on the login button
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requireMfa"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Require MFA
                            </FormLabel>
                            <FormDescription>
                              Enforce multi-factor authentication for SSO login
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
                  
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Azure AD SSO
                          </FormLabel>
                          <FormDescription>
                            Turn on Single Sign-On with Microsoft Azure AD
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
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={isTesting || !form.formState.isValid}
                    >
                      {isTesting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Testing Connection...
                        </>
                      ) : testResult === 'success' ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          Connection Successful
                        </>
                      ) : testResult === 'failure' ? (
                        <>
                          <X className="mr-2 h-4 w-4 text-destructive" />
                          Connection Failed
                        </>
                      ) : (
                        <>
                          <Link className="mr-2 h-4 w-4" />
                          Test Connection
                        </>
                      )}
                    </Button>
                    <Button type="submit" disabled={!form.formState.isValid}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t pt-6">
              <h3 className="text-sm font-medium mb-2">Setup Help</h3>
              <p className="text-sm text-muted-foreground mb-4">
                To configure Azure AD SSO, you need to register an application in the Azure Portal. Follow these steps:
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
                <li>Go to the Azure Portal and navigate to Azure Active Directory</li>
                <li>Select "App registrations" and create a new registration</li>
                <li>Set the redirect URI to match the value above</li>
                <li>Note the Tenant ID and Client ID from the Overview page</li>
                <li>Create a new client secret under "Certificates & secrets"</li>
              </ol>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm mt-2"
                onClick={() => window.open('https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app', '_blank')}
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Microsoft Documentation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Advanced Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Advanced SSO Settings</CardTitle>
              <CardDescription>
                Configure additional options for Single Sign-On
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Provisioning</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Admin Group</label>
                    <Select defaultValue="">
                      <SelectTrigger>
                        <SelectValue placeholder="Select an admin group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="azure-admins">Azure Admins</SelectItem>
                        <SelectItem value="global-admins">Global Admins</SelectItem>
                        <SelectItem value="it-admins">IT Admins</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Azure AD group whose members will be granted admin privileges
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default User Group</label>
                    <Select defaultValue="">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="azure-users">Azure Users</SelectItem>
                        <SelectItem value="employees">Employees</SelectItem>
                        <SelectItem value="external-users">External Users</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Azure AD group whose members will be granted standard access
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">
                      Auto-create users on first login
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Automatically create user accounts when they sign in via SSO
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">
                      Allow Local Login
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to login with username/password in addition to SSO
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Advanced Configuration</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Claims Mapping</label>
                  <Textarea 
                    placeholder='{"given_name": "firstName", "family_name": "lastName", "email": "email"}'
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    JSON mapping of Azure AD claims to application user properties
                  </p>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">
                      Debug Mode
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging of SSO authentication attempts
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="ml-auto" onClick={() => {
                toast({
                  title: "Advanced Settings Saved",
                  description: "Your SSO settings have been updated.",
                });
              }}>
                <Save className="mr-2 h-4 w-4" />
                Save Advanced Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SSOConfiguration;
