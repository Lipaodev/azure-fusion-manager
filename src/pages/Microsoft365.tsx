
import React, { useState } from 'react';
import { 
  Cloud, 
  User, 
  Key, 
  Download, 
  RefreshCw,
  Search,
  UserPlus,
  Mail,
  Check,
  X,
  CalendarDays,
  Settings,
  Shield,
  AlertCircle,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

// Microsoft 365 User interface
interface M365User {
  id: string;
  displayName: string;
  userPrincipalName: string;
  email: string;
  isLicensed: boolean;
  assignedLicenses: string[];
  accountEnabled: boolean;
  lastSignIn?: Date;
  createdAt: Date;
}

// Microsoft 365 License interface
interface M365License {
  id: string;
  name: string;
  totalLicenses: number;
  assignedLicenses: number;
  skuId: string;
}

// Mock data for M365 users
const mockM365Users: M365User[] = [
  {
    id: '1',
    displayName: 'John Smith',
    userPrincipalName: 'john.smith@example.onmicrosoft.com',
    email: 'john.smith@example.com',
    isLicensed: true,
    assignedLicenses: ['Microsoft 365 Business Premium'],
    accountEnabled: true,
    lastSignIn: new Date(2023, 11, 28),
    createdAt: new Date(2023, 1, 15),
  },
  {
    id: '2',
    displayName: 'Maria Johnson',
    userPrincipalName: 'maria.johnson@example.onmicrosoft.com',
    email: 'maria.johnson@example.com',
    isLicensed: true,
    assignedLicenses: ['Microsoft 365 Business Standard'],
    accountEnabled: true,
    lastSignIn: new Date(2023, 11, 29),
    createdAt: new Date(2023, 3, 10),
  },
  {
    id: '3',
    displayName: 'David Williams',
    userPrincipalName: 'david.williams@example.onmicrosoft.com',
    email: 'david.williams@example.com',
    isLicensed: false,
    assignedLicenses: [],
    accountEnabled: false,
    createdAt: new Date(2022, 11, 5),
  },
  {
    id: '4',
    displayName: 'Alice Lee',
    userPrincipalName: 'alice.lee@example.onmicrosoft.com',
    email: 'alice.lee@example.com',
    isLicensed: true,
    assignedLicenses: ['Office 365 E3'],
    accountEnabled: true,
    lastSignIn: new Date(2023, 11, 25),
    createdAt: new Date(2023, 2, 20),
  },
  {
    id: '5',
    displayName: 'Robert Garcia',
    userPrincipalName: 'robert.garcia@example.onmicrosoft.com',
    email: 'robert.garcia@example.com',
    isLicensed: true,
    assignedLicenses: ['Microsoft 365 Business Premium'],
    accountEnabled: true,
    lastSignIn: new Date(2023, 11, 27),
    createdAt: new Date(2023, 5, 12),
  },
];

// Mock data for M365 licenses
const mockM365Licenses: M365License[] = [
  {
    id: 'l1',
    name: 'Microsoft 365 Business Basic',
    totalLicenses: 100,
    assignedLicenses: 65,
    skuId: 'bd938f12-058f-4927-bba3-ae36b1d2501c',
  },
  {
    id: 'l2',
    name: 'Microsoft 365 Business Standard',
    totalLicenses: 50,
    assignedLicenses: 22,
    skuId: '3b555118-da6a-4418-894f-7df1e2096870',
  },
  {
    id: 'l3',
    name: 'Microsoft 365 Business Premium',
    totalLicenses: 25,
    assignedLicenses: 15,
    skuId: 'cbdc14ab-d96c-4c30-b9f4-6ada7cdc1d46',
  },
  {
    id: 'l4',
    name: 'Office 365 E3',
    totalLicenses: 20,
    assignedLicenses: 10,
    skuId: '4b9405b0-7788-4568-add1-99614e613b69',
  },
  {
    id: 'l5',
    name: 'Office 365 E5',
    totalLicenses: 10,
    assignedLicenses: 3,
    skuId: '06ebc4ee-1bb5-47dd-8120-11324bc54e06',
  },
];

const Microsoft365 = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<M365User[]>(mockM365Users);
  const [licenses, setLicenses] = useState<M365License[]>(mockM365Licenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<M365User | null>(null);
  const [userToDelete, setUserToDelete] = useState<M365User | null>(null);

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userPrincipalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      toast({
        title: "Data Refreshed",
        description: "Microsoft 365 data has been refreshed from the cloud.",
      });
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Microsoft 365 data is being exported to CSV.",
    });
    
    // In a real app, this would trigger a download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Data has been exported successfully.",
      });
    }, 1000);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    const updatedUsers = users.filter(user => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    setUserToDelete(null);
    toast({
      title: "User Deleted",
      description: `${userToDelete.displayName} has been removed from Microsoft 365.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Cloud className="h-6 w-6 text-azure" />
          <h1 className="text-3xl font-bold tracking-tight">Microsoft 365</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
          <Button onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="licenses" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Licenses</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Users Tab Content */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
            <div className="flex-1 flex items-center border rounded-md px-3 py-2">
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
              <Input
                placeholder="Search users by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 p-0 shadow-none focus-visible:ring-0"
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Microsoft 365 User</DialogTitle>
                  <DialogDescription>
                    Create a new user account in Microsoft 365
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-center text-muted-foreground py-8">
                    M365 user creation form would go here
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <User className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No users found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No Microsoft 365 users match your search criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{user.displayName}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1" />
                          {user.userPrincipalName}
                        </p>
                      </div>
                      <Badge 
                        variant={user.accountEnabled ? "default" : "outline"}
                        className="ml-2"
                      >
                        {user.accountEnabled ? (
                          <span className="flex items-center">
                            <Check className="mr-1 h-3 w-3" /> Enabled
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <X className="mr-1 h-3 w-3" /> Disabled
                          </span>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License:</span>
                        <span className="font-medium">
                          {user.isLicensed 
                            ? user.assignedLicenses.join(', ') 
                            : 'No license'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">
                          {format(user.createdAt, 'MMM d, yyyy')}
                        </span>
                      </div>
                      
                      {user.lastSignIn && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Sign-in:</span>
                          <span className="font-medium">
                            {format(user.lastSignIn, 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Licenses Tab Content */}
        <TabsContent value="licenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">License Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Key className="mr-2 h-4 w-4" />
                  Add Licenses
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Microsoft 365 Licenses</DialogTitle>
                  <DialogDescription>
                    Purchase additional licenses for your organization
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-center text-muted-foreground py-8">
                    License purchase form would go here
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {licenses.map((license) => (
              <Card key={license.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Key className="h-5 w-5 mr-2 text-primary" />
                    {license.name}
                  </CardTitle>
                  <CardDescription>
                    SKU ID: {license.skuId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Usage</span>
                        <span>{license.assignedLicenses} of {license.totalLicenses}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(license.assignedLicenses / license.totalLicenses) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Total:</div>
                      <div className="font-medium text-right">{license.totalLicenses}</div>
                      
                      <div className="text-muted-foreground">Assigned:</div>
                      <div className="font-medium text-right">{license.assignedLicenses}</div>
                      
                      <div className="text-muted-foreground">Available:</div>
                      <div className="font-medium text-right">{license.totalLicenses - license.assignedLicenses}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between">
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage License</DialogTitle>
                          <DialogDescription>
                            Configure details for {license.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-center text-muted-foreground py-8">
                            License management form would go here
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Reports Tab Content */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>License Usage Report</CardTitle>
                <CardDescription>
                  Overview of Microsoft 365 license utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">License usage chart would appear here</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Accounts Report</CardTitle>
                <CardDescription>
                  Active vs. inactive Microsoft 365 accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Active accounts chart would appear here</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>
                  Configure automated report generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Monthly License Usage</p>
                        <p className="text-sm text-muted-foreground">
                          Sends on the 1st of each month
                        </p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Weekly User Activity</p>
                        <p className="text-sm text-muted-foreground">
                          Sends every Monday at 8:00 AM
                        </p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Security Compliance Report</p>
                        <p className="text-sm text-muted-foreground">
                          Sends on the 15th of each month
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Create New Scheduled Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Scheduled Report</DialogTitle>
                      <DialogDescription>
                        Configure a new automated report
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-center text-muted-foreground py-8">
                        Report scheduling form would go here
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Microsoft 365 user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  <div className="text-muted-foreground">Display Name:</div>
                  <div className="font-medium">{selectedUser.displayName}</div>
                  
                  <div className="text-muted-foreground">Email:</div>
                  <div className="font-medium">{selectedUser.email}</div>
                  
                  <div className="text-muted-foreground">UPN:</div>
                  <div className="font-medium">{selectedUser.userPrincipalName}</div>
                  
                  <div className="text-muted-foreground">Status:</div>
                  <div className="font-medium">
                    {selectedUser.accountEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">License Information</h3>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  <div className="text-muted-foreground">Licensed:</div>
                  <div className="font-medium">
                    {selectedUser.isLicensed ? 'Yes' : 'No'}
                  </div>
                  
                  {selectedUser.isLicensed && (
                    <>
                      <div className="text-muted-foreground">Assigned Licenses:</div>
                      <div className="font-medium">
                        {selectedUser.assignedLicenses.join(', ')}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <h3 className="font-semibold">Activity Information</h3>
                <div className="grid md:grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created On:</span>
                    <span className="font-medium">
                      {format(selectedUser.createdAt, 'PPP')}
                    </span>
                  </div>
                  
                  {selectedUser.lastSignIn && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sign-in:</span>
                      <span className="font-medium">
                        {format(selectedUser.lastSignIn, 'PPP')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex justify-end space-x-2 md:col-span-2">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setSelectedUser(null);
                  // Open edit dialog in a real application
                }}>
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Microsoft 365 user? This action cannot be undone.
              {userToDelete?.displayName && (
                <span className="block mt-2 font-medium">"{userToDelete.displayName}"</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Microsoft365;
