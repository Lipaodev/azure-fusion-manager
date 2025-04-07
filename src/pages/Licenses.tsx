
import React, { useState } from 'react';
import {
  Key,
  UserPlus,
  Download,
  BarChart,
  Search,
  Filter,
  AlertCircle,
  PlusCircle,
  Settings
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { License } from '@/types';

// Mock data for licenses
const mockLicenses: License[] = [
  {
    id: 'l1',
    name: 'Microsoft 365 Business Basic',
    description: 'Basic apps and services for businesses',
    assignedUsers: 65,
    totalLicenses: 100,
    skuId: 'bd938f12-058f-4927-bba3-ae36b1d2501c',
  },
  {
    id: 'l2',
    name: 'Microsoft 365 Business Standard',
    description: 'Best for businesses that need Office apps plus cloud file storage and sharing',
    assignedUsers: 22,
    totalLicenses: 50,
    skuId: '3b555118-da6a-4418-894f-7df1e2096870',
  },
  {
    id: 'l3',
    name: 'Microsoft 365 Business Premium',
    description: 'Best for businesses that need enhanced security and device management',
    assignedUsers: 15,
    totalLicenses: 25,
    skuId: 'cbdc14ab-d96c-4c30-b9f4-6ada7cdc1d46',
  },
  {
    id: 'l4',
    name: 'Office 365 E3',
    description: 'Enterprise-level productivity and collaboration tools',
    assignedUsers: 10,
    totalLicenses: 20,
    skuId: '4b9405b0-7788-4568-add1-99614e613b69',
  },
  {
    id: 'l5',
    name: 'Office 365 E5',
    description: 'Comprehensive enterprise productivity, voice, and security solution',
    assignedUsers: 3,
    totalLicenses: 10,
    skuId: '06ebc4ee-1bb5-47dd-8120-11324bc54e06',
  },
  {
    id: 'l6',
    name: 'Microsoft Power BI Pro',
    description: 'Interactive data visualization and business intelligence tool',
    assignedUsers: 5,
    totalLicenses: 15,
    skuId: '984df360-9a74-4647-8cf8-696749f6247a',
  },
];

const Licenses = () => {
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = 
      license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = 
      filterType === 'all' ||
      (filterType === 'available' && (license.totalLicenses - license.assignedUsers > 0)) ||
      (filterType === 'fullyAssigned' && (license.totalLicenses - license.assignedUsers === 0));
      
    return matchesSearch && matchesType;
  });

  const handleExportLicenseReport = () => {
    toast({
      title: "Export Started",
      description: "License report is being exported to CSV.",
    });
    
    // In a real app, this would trigger a download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "License report has been exported successfully.",
      });
    }, 1000);
  };

  const handleDeleteLicense = () => {
    if (!licenseToDelete) return;

    const updatedLicenses = licenses.filter(license => license.id !== licenseToDelete.id);
    setLicenses(updatedLicenses);
    setLicenseToDelete(null);
    toast({
      title: "License Removed",
      description: `${licenseToDelete.name} has been removed from your subscription.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Key className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">License Management</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportLicenseReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Licenses
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {licenses.reduce((total, license) => total + license.totalLicenses, 0)}
            </div>
            <p className="text-sm text-muted-foreground">
              Across all subscription plans
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assigned Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {licenses.reduce((total, license) => total + license.assignedUsers, 0)}
            </div>
            <p className="text-sm text-muted-foreground">
              Currently in use by users
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {licenses.reduce((total, license) => total + (license.totalLicenses - license.assignedUsers), 0)}
            </div>
            <p className="text-sm text-muted-foreground">
              Ready to be assigned
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 flex items-center border rounded-md px-3 py-2">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <Input
            placeholder="Search licenses by name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter licenses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Licenses</SelectItem>
              <SelectItem value="available">Available Licenses</SelectItem>
              <SelectItem value="fullyAssigned">Fully Assigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredLicenses.length === 0 ? (
        <div className="text-center py-10">
          <Key className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No licenses found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery || filterType !== 'all'
              ? "No licenses match your search criteria" 
              : "You haven't purchased any Microsoft 365 licenses yet"}
          </p>
          {!searchQuery && filterType === 'all' && (
            <Button onClick={() => {
              // Open add licenses dialog in a real app
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First License
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLicenses.map((license) => (
            <Card key={license.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <Key className="h-5 w-5 mr-2 text-primary" />
                      {license.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {license.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={license.assignedUsers === license.totalLicenses 
                      ? "destructive" 
                      : (license.assignedUsers / license.totalLicenses > 0.9 
                          ? "default" 
                          : "outline")
                    }
                  >
                    {license.assignedUsers === license.totalLicenses 
                      ? "Fully Assigned" 
                      : `${license.totalLicenses - license.assignedUsers} Available`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usage</span>
                      <span className="font-medium">{license.assignedUsers} of {license.totalLicenses}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          license.assignedUsers / license.totalLicenses > 0.9
                            ? "bg-amber-500"
                            : license.assignedUsers === license.totalLicenses
                              ? "bg-destructive"
                              : "bg-primary"
                        }`}
                        style={{ width: `${(license.assignedUsers / license.totalLicenses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-muted-foreground">SKU ID:</div>
                    <div className="font-medium text-right">{license.skuId}</div>
                    
                    <div className="text-muted-foreground">Cost per License:</div>
                    <div className="font-medium text-right">Varies by plan</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between">
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign License</DialogTitle>
                          <DialogDescription>
                            Assign {license.name} to users
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-center text-muted-foreground py-8">
                            License assignment form would go here
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <BarChart className="mr-2 h-4 w-4" />
                          Usage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>License Usage</DialogTitle>
                          <DialogDescription>
                            Detailed usage information for {license.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center mb-4">
                            <p className="text-muted-foreground">Usage chart would appear here</p>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold">Top Users</h3>
                            <p className="text-center text-muted-foreground py-4">
                              User list would appear here
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                          <Settings className="mr-2 h-4 w-4" />
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage License</DialogTitle>
                          <DialogDescription>
                            Adjust settings for {license.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-center text-muted-foreground py-8">
                            License management form would go here
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setLicenseToDelete(license)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!licenseToDelete} onOpenChange={(open) => !open && setLicenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm License Removal
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this license subscription? This action cannot be undone.
              {licenseToDelete?.name && (
                <span className="block mt-2 font-medium">"{licenseToDelete.name}"</span>
              )}
              {licenseToDelete?.assignedUsers > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: This license is currently assigned to {licenseToDelete.assignedUsers} users. 
                  Those users will lose access to these services.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteLicense}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove License
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Licenses;
