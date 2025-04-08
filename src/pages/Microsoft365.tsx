
import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Users, 
  BarChart as ChartIcon, 
  UserPlus, 
  UserCog, 
  Key, 
  Mail,
  Settings,
  UserCheck,
  Search,
  RefreshCw,
  UserX,
  DownloadCloud,
  User as UserIcon,
  Trash2,
  Upload,
  FileText
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";

// Initial empty state for Microsoft 365 users
const initialUsers = [];

// Initial empty state for licenses
const initialLicenses = [];

// Form schema for creating a new user
const newUserFormSchema = z.object({
  displayName: z.string().min(2, { message: "Display name is required" }),
  userPrincipalName: z.string().email({ message: "Valid email address is required" }),
  mail: z.string().email({ message: "Valid email address is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  licenses: z.array(z.string()).optional(),
});

// Form schema for Microsoft 365 tenant configuration
const tenantConfigSchema = z.object({
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  clientId: z.string().min(1, { message: "Client ID is required" }),
  clientSecret: z.string().min(1, { message: "Client Secret is required" }),
  redirectUri: z.string().url({ message: "Valid redirect URI is required" }),
});

// Form schema for Microsoft 365 import
const importUsersSchema = z.object({
  filter: z.string().optional(),
  department: z.string().optional(),
  includeDisabled: z.boolean().default(false),
  assignLicense: z.boolean().default(false),
  defaultLicense: z.string().optional(),
});

type SearchFilters = {
  department: string;
  licenseType: string;
  accountStatus: string;
};

const Microsoft365 = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [licenses, setLicenses] = useState(initialLicenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    department: 'all',
    licenseType: 'all',
    accountStatus: 'all'
  });
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isTenantConfigDialogOpen, setIsTenantConfigDialogOpen] = useState(false);
  const [isImportUsersDialogOpen, setIsImportUsersDialogOpen] = useState(false);
  const [tenantConfigured, setTenantConfigured] = useState(false);
  
  // Load data from database on initial render
  useEffect(() => {
    const loadDataFromDatabase = async () => {
      try {
        // This would be replaced with actual API calls to your backend
        // For now, we'll just simulate a delay to show loading state
        
        // In a real implementation, this would fetch data from your configured database
        toast({
          title: "Loading Data",
          description: "Connecting to database and fetching Microsoft 365 data...",
        });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if tenant is configured
        // This would be a real API call to your backend
        const tenantStatus = false; // For demo purposes, initially not configured
        setTenantConfigured(tenantStatus);
        
        if (!tenantStatus) {
          toast({
            title: "Microsoft 365 Not Configured",
            description: "Please configure your Microsoft 365 tenant to start managing users and licenses.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data from database. Please check your connection.",
          variant: "destructive",
        });
      }
    };
    
    loadDataFromDatabase();
  }, [toast]);
  
  const form = useForm<z.infer<typeof newUserFormSchema>>({
    resolver: zodResolver(newUserFormSchema),
    defaultValues: {
      displayName: '',
      userPrincipalName: '',
      mail: '',
      password: '',
      jobTitle: '',
      department: '',
      licenses: [],
    },
  });
  
  const tenantConfigForm = useForm<z.infer<typeof tenantConfigSchema>>({
    resolver: zodResolver(tenantConfigSchema),
    defaultValues: {
      tenantId: '',
      clientId: '',
      clientSecret: '',
      redirectUri: window.location.origin + '/auth/microsoft/callback',
    },
  });
  
  const importUsersForm = useForm<z.infer<typeof importUsersSchema>>({
    resolver: zodResolver(importUsersSchema),
    defaultValues: {
      filter: '',
      department: '',
      includeDisabled: false,
      assignLicense: false,
      defaultLicense: '',
    },
  });

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchTerm === '' || 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userPrincipalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      filters.department === 'all' || 
      user.department?.toLowerCase() === filters.department.toLowerCase();
    
    const matchesLicense = 
      filters.licenseType === 'all' || 
      user.licenses?.includes(filters.licenseType);
    
    const matchesStatus = 
      filters.accountStatus === 'all' || 
      (filters.accountStatus === 'active' && user.accountEnabled) ||
      (filters.accountStatus === 'disabled' && !user.accountEnabled);
    
    return matchesSearch && matchesDepartment && matchesLicense && matchesStatus;
  });

  // Get unique departments for filter
  const departments = Array.from(new Set(users.map(user => user.department || ''))).filter(dept => dept !== '');

  const handleCreateUser = (data: z.infer<typeof newUserFormSchema>) => {
    // In a real application, this would make an API call to create the user in Microsoft 365
    // and then store the result in the database
    const newUser = {
      id: `${users.length + 1}`,
      displayName: data.displayName,
      userPrincipalName: data.userPrincipalName,
      mail: data.mail,
      jobTitle: data.jobTitle || '',
      department: data.department || '',
      accountEnabled: true,
      licenses: data.licenses || [],
      lastSignIn: '',
      createdDateTime: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    
    // Update license counts
    if (data.licenses && data.licenses.length > 0) {
      const updatedLicenses = [...licenses];
      data.licenses.forEach(licenseId => {
        const licenseIndex = updatedLicenses.findIndex(l => l.id === licenseId);
        if (licenseIndex >= 0) {
          updatedLicenses[licenseIndex] = {
            ...updatedLicenses[licenseIndex],
            assigned: updatedLicenses[licenseIndex].assigned + 1,
            available: updatedLicenses[licenseIndex].available - 1
          };
        }
      });
      setLicenses(updatedLicenses);
    }
    
    setIsCreateUserDialogOpen(false);
    form.reset();
    
    toast({
      title: "User Created",
      description: `${data.displayName} has been created in Microsoft 365.`,
    });
  };

  const handleConfigureTenant = (data: z.infer<typeof tenantConfigSchema>) => {
    // In a real application, this would store the tenant configuration in the database
    // and initialize the Microsoft Graph API client
    
    toast({
      title: "Tenant Configuration Saved",
      description: "Microsoft 365 tenant configuration has been saved.",
    });
    
    setTenantConfigured(true);
    setIsTenantConfigDialogOpen(false);
    
    // After configuring tenant, we would typically fetch initial data
    handleRefreshData();
  };
  
  const handleImportUsers = (data: z.infer<typeof importUsersSchema>) => {
    // In a real application, this would make API calls to import users from Microsoft 365
    // and store them in the database
    
    toast({
      title: "Importing Users",
      description: "Starting to import users from Microsoft 365...",
    });
    
    // Simulate API delay
    setTimeout(() => {
      // Mock importing 5 users
      const importedUsers = [
        {
          id: `${users.length + 1}`,
          displayName: 'Imported User 1',
          userPrincipalName: 'imported1@example.com',
          mail: 'imported1@example.com',
          jobTitle: 'Software Developer',
          department: data.department || 'Imported',
          accountEnabled: true,
          licenses: data.assignLicense && data.defaultLicense ? [data.defaultLicense] : [],
          lastSignIn: '',
          createdDateTime: new Date().toISOString()
        },
        {
          id: `${users.length + 2}`,
          displayName: 'Imported User 2',
          userPrincipalName: 'imported2@example.com',
          mail: 'imported2@example.com',
          jobTitle: 'Project Manager',
          department: data.department || 'Imported',
          accountEnabled: true,
          licenses: data.assignLicense && data.defaultLicense ? [data.defaultLicense] : [],
          lastSignIn: '',
          createdDateTime: new Date().toISOString()
        },
      ];
      
      setUsers([...users, ...importedUsers]);
      
      // Update license counts if assigning licenses
      if (data.assignLicense && data.defaultLicense) {
        const updatedLicenses = [...licenses];
        const licenseIndex = updatedLicenses.findIndex(l => l.id === data.defaultLicense);
        if (licenseIndex >= 0) {
          updatedLicenses[licenseIndex] = {
            ...updatedLicenses[licenseIndex],
            assigned: updatedLicenses[licenseIndex].assigned + importedUsers.length,
            available: updatedLicenses[licenseIndex].available - importedUsers.length
          };
          setLicenses(updatedLicenses);
        }
      }
      
      setIsImportUsersDialogOpen(false);
      importUsersForm.reset();
      
      toast({
        title: "Users Imported",
        description: `Successfully imported ${importedUsers.length} users from Microsoft 365.`,
      });
    }, 2000);
  };

  const handleRefreshData = () => {
    if (!tenantConfigured) {
      toast({
        title: "Tenant Not Configured",
        description: "Please configure your Microsoft 365 tenant first.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Refreshing Data",
      description: "Syncing with Microsoft 365...",
    });
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real application, this would fetch fresh data from Microsoft 365
      // For demo purposes, we'll add some sample data if there's none
      if (users.length === 0) {
        const sampleUsers = [
          {
            id: '1',
            displayName: 'John Doe',
            userPrincipalName: 'john.doe@example.com',
            mail: 'john.doe@example.com',
            jobTitle: 'Software Developer',
            department: 'IT',
            accountEnabled: true,
            licenses: ['E3', 'EMS'],
            lastSignIn: '2023-11-10T14:30:00Z',
            createdDateTime: '2022-01-15T09:00:00Z'
          },
          {
            id: '2',
            displayName: 'Jane Smith',
            userPrincipalName: 'jane.smith@example.com',
            mail: 'jane.smith@example.com',
            jobTitle: 'Project Manager',
            department: 'PMO',
            accountEnabled: true,
            licenses: ['E5', 'EMS'],
            lastSignIn: '2023-11-15T10:20:00Z',
            createdDateTime: '2022-02-20T11:30:00Z'
          }
        ];
        setUsers(sampleUsers);
      }
      
      if (licenses.length === 0) {
        const sampleLicenses = [
          {
            id: 'E3',
            name: 'Microsoft 365 E3',
            total: 100,
            assigned: 2,
            available: 98,
            unitPrice: 32.00,
            renewalDate: '2024-06-30'
          },
          {
            id: 'E5',
            name: 'Microsoft 365 E5',
            total: 50,
            assigned: 1,
            available: 49,
            unitPrice: 57.00,
            renewalDate: '2024-06-30'
          },
          {
            id: 'EMS',
            name: 'Enterprise Mobility + Security',
            total: 150,
            assigned: 2,
            available: 148,
            unitPrice: 14.80,
            renewalDate: '2024-06-30'
          }
        ];
        setLicenses(sampleLicenses);
      }
      
      toast({
        title: "Data Refreshed",
        description: "Microsoft 365 data has been updated.",
      });
    }, 1500);
  };

  const handleGenerateReport = (type: 'users' | 'licenses') => {
    toast({
      title: "Generating Report",
      description: `Your ${type} report is being generated.`,
    });
    
    // Simulate report generation delay
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: `Your ${type} report is ready for download.`,
      });
    }, 2000);
  };

  const handleUserStatusChange = (userId: string, newStatus: boolean) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, accountEnabled: newStatus } : user
    );
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    toast({
      title: newStatus ? "User Enabled" : "User Disabled",
      description: `${user?.displayName} has been ${newStatus ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleRemoveLicenseFromUser = (userId: string, licenseId: string) => {
    // Update user licenses
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          licenses: user.licenses.filter(id => id !== licenseId)
        };
      }
      return user;
    });
    
    // Update license counts
    const updatedLicenses = licenses.map(license => {
      if (license.id === licenseId) {
        return {
          ...license,
          assigned: license.assigned - 1,
          available: license.available + 1
        };
      }
      return license;
    });
    
    setUsers(updatedUsers);
    setLicenses(updatedLicenses);
    
    const user = users.find(u => u.id === userId);
    const license = licenses.find(l => l.id === licenseId);
    
    toast({
      title: "License Removed",
      description: `${license?.name} has been removed from ${user?.displayName}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Cloud className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Microsoft 365 Management</h1>
      </div>
      
      {!tenantConfigured && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800">Microsoft 365 Tenant Configuration Required</CardTitle>
            <CardDescription className="text-amber-700">
              Configure your Microsoft 365 tenant to start managing users and licenses
            </CardDescription>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p>To start managing Microsoft 365 users and licenses, you need to configure your tenant information and authentication settings.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsTenantConfigDialogOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configure Microsoft 365 Tenant
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="licenses" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Licenses</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Microsoft 365 Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users by name, email, or job title..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select
                value={filters.department}
                onValueChange={(value) => setFilters({...filters, department: value})}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.licenseType}
                onValueChange={(value) => setFilters({...filters, licenseType: value})}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="License" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Licenses</SelectItem>
                  {licenses.map(license => (
                    <SelectItem key={license.id} value={license.id}>{license.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.accountStatus}
                onValueChange={(value) => setFilters({...filters, accountStatus: value})}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={handleRefreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync with M365
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleGenerateReport('users')}
              >
                <DownloadCloud className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsImportUsersDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Users
              </Button>
            </div>
            
            <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Microsoft 365 User</DialogTitle>
                  <DialogDescription>
                    Add a new user to your Microsoft 365 tenant.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="userPrincipalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Principal Name (UPN)</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="mail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
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
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Software Developer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="IT" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="licenses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assign Licenses</FormLabel>
                              <div className="space-y-2">
                                {licenses.length > 0 ? (
                                  licenses.map(license => (
                                    <div key={license.id} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id={`license-${license.id}`}
                                        className="h-4 w-4 rounded border-gray-300"
                                        checked={field.value?.includes(license.id)}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          const value = field.value || [];
                                          field.onChange(
                                            checked
                                              ? [...value, license.id]
                                              : value.filter((val) => val !== license.id)
                                          );
                                        }}
                                      />
                                      <label
                                        htmlFor={`license-${license.id}`}
                                        className="text-sm font-medium"
                                      >
                                        {license.name} ({license.available} available)
                                      </label>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No licenses available. Please refresh data or add licenses.</p>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Create User
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {users.length === 0 ? (
            <div className="rounded-md border p-8 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No users found</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                {tenantConfigured 
                  ? "Start by adding users or importing them from Microsoft 365" 
                  : "Configure your Microsoft 365 tenant to start managing users"}
              </p>
              {tenantConfigured ? (
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create User
                      </Button>
                    </DialogTrigger>
                    {/* Dialog content similar to above */}
                  </Dialog>
                  <Button variant="outline" onClick={() => setIsImportUsersDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Users
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsTenantConfigDialogOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Tenant
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Job Title</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Sign In</TableHead>
                    <TableHead>Licenses</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className={!user.accountEnabled ? "opacity-60" : ""}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-xs text-muted-foreground">{user.userPrincipalName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.jobTitle || "-"}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.department || "-"}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.licenses && user.licenses.length > 0 ? (
                              user.licenses.map(licenseId => {
                                const license = licenses.find(l => l.id === licenseId);
                                return license ? (
                                  <Badge 
                                    key={licenseId}
                                    variant="outline"
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() => handleRemoveLicenseFromUser(user.id, licenseId)}
                                  >
                                    {license.id}
                                    <Trash2 className="h-3 w-3 ml-1" />
                                  </Badge>
                                ) : null;
                              })
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUserStatusChange(user.id, !user.accountEnabled)}
                            >
                              {user.accountEnabled ? (
                                <UserX className="h-4 w-4 text-destructive" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-primary" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon">
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users match your filter criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleGenerateReport('licenses')}
              >
                <DownloadCloud className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
            
            <Button variant="outline">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Purchase Licenses
            </Button>
          </div>
          
          {licenses.length === 0 ? (
            <div className="rounded-md border p-8 text-center">
              <Key className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No licenses found</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                {tenantConfigured 
                  ? "Sync with Microsoft 365 to retrieve your license information" 
                  : "Configure your Microsoft 365 tenant to start managing licenses"}
              </p>
              {tenantConfigured ? (
                <Button onClick={handleRefreshData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync with Microsoft 365
                </Button>
              ) : (
                <Button onClick={() => setIsTenantConfigDialogOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Tenant
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {licenses.map(license => (
                <Card key={license.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{license.name}</CardTitle>
                    <CardDescription>${license.unitPrice.toFixed(2)} per user/month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">{license.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assigned:</span>
                        <span className="font-medium">{license.assigned}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium">{license.available}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Cost:</span>
                        <span className="font-medium">${(license.unitPrice * license.total).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Renewal Date:</span>
                        <span className="font-medium">{new Date(license.renewalDate).toLocaleDateString()}</span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${(license.assigned / license.total) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Usage</span>
                          <span>{Math.round((license.assigned / license.total) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <UserIcon className="h-4 w-4 mr-2" />
                      View Assigned Users
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>License Usage Trends</CardTitle>
              <CardDescription>Monthly license consumption over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center space-y-2">
                  <ChartIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">License usage chart will appear here once you have data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Tenant Configuration Dialog */}
      <Dialog open={isTenantConfigDialogOpen} onOpenChange={setIsTenantConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Microsoft 365 Tenant Configuration</DialogTitle>
            <DialogDescription>
              Configure your Microsoft 365 tenant for integration with this application
            </DialogDescription>
          </DialogHeader>
          
          <Form {...tenantConfigForm}>
            <form onSubmit={tenantConfigForm.handleSubmit(handleConfigureTenant)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-muted/40 p-4 rounded-md mb-2">
                  <h3 className="text-sm font-medium mb-2">Getting Started</h3>
                  <ol className="text-sm text-muted-foreground list-decimal pl-4 space-y-1">
                    <li>Register a new app in the <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Azure Portal</a></li>
                    <li>Set up the required API permissions (Microsoft Graph: User.Read.All, Directory.Read.All)</li>
                    <li>Create a client secret for authentication</li>
                    <li>Add this site's URL as a redirect URI</li>
                  </ol>
                </div>
                
                <FormField
                  control={tenantConfigForm.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenant ID</FormLabel>
                      <FormControl>
                        <Input placeholder="11111111-1111-1111-1111-111111111111" {...field} />
                      </FormControl>
                      <FormDescription>
                        The unique identifier for your Microsoft 365 tenant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={tenantConfigForm.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID (Application ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="22222222-2222-2222-2222-222222222222" {...field} />
                      </FormControl>
                      <FormDescription>
                        The unique identifier for your registered Azure application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={tenantConfigForm.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your application's client secret" {...field} />
                      </FormControl>
                      <FormDescription>
                        The secret key generated for your application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={tenantConfigForm.control}
                  name="redirectUri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Redirect URI</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Add this URL to your application's redirect URIs in Azure Portal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-muted/40 p-4 rounded-md mt-2">
                  <h3 className="text-sm font-medium mb-2">Required Permissions</h3>
                  <p className="text-sm text-muted-foreground mb-2">Your application needs these Microsoft Graph permissions:</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                    <li>User.Read.All</li>
                    <li>User.ReadWrite.All</li>
                    <li>Directory.Read.All</li>
                    <li>Directory.ReadWrite.All</li>
                    <li>Organization.Read.All</li>
                    <li>SubscriptionLicense.Read.All</li>
                  </ul>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Import Users Dialog */}
      <Dialog open={isImportUsersDialogOpen} onOpenChange={setIsImportUsersDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Microsoft 365 Users</DialogTitle>
            <DialogDescription>
              Import users from your Microsoft 365 tenant
            </DialogDescription>
          </DialogHeader>
          
          <Form {...importUsersForm}>
            <form onSubmit={importUsersForm.handleSubmit(handleImportUsers)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={importUsersForm.control}
                  name="filter"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>User Filter (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., displayName:startsWith:'Marketing'" {...field} />
                      </FormControl>
                      <FormDescription>
                        Filter users by Microsoft Graph query syntax
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={importUsersForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Marketing" {...field} />
                      </FormControl>
                      <FormDescription>
                        Import users from a specific department
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={importUsersForm.control}
                  name="includeDisabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Disabled Users</FormLabel>
                        <FormDescription>
                          Import users with disabled accounts
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={importUsersForm.control}
                  name="assignLicense"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Assign Default License</FormLabel>
                        <FormDescription>
                          Assign a default license to imported users
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {importUsersForm.watch("assignLicense") && (
                  <FormField
                    control={importUsersForm.control}
                    name="defaultLicense"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Default License</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a license" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {licenses.map(license => (
                              <SelectItem key={license.id} value={license.id}>
                                {license.name} ({license.available} available)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a license to assign to all imported users
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={!tenantConfigured}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Users
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Microsoft365;
