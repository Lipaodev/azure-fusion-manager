
import React, { useState } from 'react';
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
  Trash2
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

// Mock data for Office 365 users
const mockUsers = [
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
  },
  {
    id: '3',
    displayName: 'Robert Johnson',
    userPrincipalName: 'robert.johnson@example.com',
    mail: 'robert.johnson@example.com',
    jobTitle: 'IT Manager',
    department: 'IT',
    accountEnabled: true,
    licenses: ['E5'],
    lastSignIn: '2023-11-14T09:15:00Z',
    createdDateTime: '2022-01-10T08:45:00Z'
  },
  {
    id: '4',
    displayName: 'Emily Davis',
    userPrincipalName: 'emily.davis@example.com',
    mail: 'emily.davis@example.com',
    jobTitle: 'HR Manager',
    department: 'Human Resources',
    accountEnabled: false,
    licenses: ['E3'],
    lastSignIn: '2023-10-05T11:20:00Z',
    createdDateTime: '2022-03-05T10:15:00Z'
  },
  {
    id: '5',
    displayName: 'Michael Wilson',
    userPrincipalName: 'michael.wilson@example.com',
    mail: 'michael.wilson@example.com',
    jobTitle: 'Sales Representative',
    department: 'Sales',
    accountEnabled: true,
    licenses: ['E3', 'PowerBI'],
    lastSignIn: '2023-11-12T16:45:00Z',
    createdDateTime: '2022-02-01T14:30:00Z'
  },
];

// Mock data for license information
const mockLicenses = [
  {
    id: 'E3',
    name: 'Microsoft 365 E3',
    total: 100,
    assigned: 78,
    available: 22,
    unitPrice: 32.00,
    renewalDate: '2024-06-30'
  },
  {
    id: 'E5',
    name: 'Microsoft 365 E5',
    total: 50,
    assigned: 12,
    available: 38,
    unitPrice: 57.00,
    renewalDate: '2024-06-30'
  },
  {
    id: 'EMS',
    name: 'Enterprise Mobility + Security',
    total: 150,
    assigned: 90,
    available: 60,
    unitPrice: 14.80,
    renewalDate: '2024-06-30'
  },
  {
    id: 'PowerBI',
    name: 'Power BI Pro',
    total: 40,
    assigned: 22,
    available: 18,
    unitPrice: 9.99,
    renewalDate: '2024-06-30'
  },
  {
    id: 'F3',
    name: 'Microsoft 365 F3',
    total: 200,
    assigned: 145,
    available: 55,
    unitPrice: 8.00,
    renewalDate: '2024-06-30'
  }
];

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

type SearchFilters = {
  department: string;
  licenseType: string;
  accountStatus: string;
};

const Microsoft365 = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [licenses, setLicenses] = useState(mockLicenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    department: 'all',
    licenseType: 'all',
    accountStatus: 'all'
  });
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  
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

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchTerm === '' || 
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userPrincipalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      filters.department === 'all' || 
      user.department?.toLowerCase() === filters.department.toLowerCase();
    
    const matchesLicense = 
      filters.licenseType === 'all' || 
      user.licenses.includes(filters.licenseType);
    
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

  const handleRefreshData = () => {
    toast({
      title: "Refreshing Data",
      description: "Syncing with Microsoft 365...",
    });
    
    // Simulate API call delay
    setTimeout(() => {
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
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
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
                                {licenses.map(license => (
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
                                ))}
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
                          {user.licenses.map(licenseId => {
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
                          })}
                          {user.licenses.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
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
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
          
          <Card>
            <CardHeader>
              <CardTitle>License Usage Trends</CardTitle>
              <CardDescription>Monthly license consumption over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center space-y-2">
                  <ChartIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">License usage chart will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Microsoft365;
