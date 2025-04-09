
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

// Start with empty licenses array instead of mock data
const Licenses = () => {
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
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

      {/* Show empty state when no licenses are found */}
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
