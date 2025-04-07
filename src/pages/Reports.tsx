
import React, { useState } from 'react';
import { 
  BarChart, 
  Download, 
  FileText, 
  Calendar, 
  Clock, 
  Mail,
  Filter,
  Search,
  Users,
  UserPlus,
  Key,
  PlusCircle,
  Settings,
  AlertCircle
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
import { ReportConfiguration, ReportType } from '@/types';
import { format } from 'date-fns';

// Mock data for reports
const mockReports: ReportConfiguration[] = [
  {
    id: 'r1',
    name: 'Monthly License Usage Report',
    type: 'LicenseUsage',
    schedule: 'monthly',
    lastRun: new Date(2023, 11, 1),
    recipients: ['admin@example.com', 'it@example.com'],
    parameters: {
      includeUnassigned: true,
      groupByDepartment: true,
    },
  },
  {
    id: 'r2',
    name: 'Weekly Active User Report',
    type: 'ActiveAccounts',
    schedule: 'weekly',
    lastRun: new Date(2023, 11, 25),
    recipients: ['admin@example.com', 'management@example.com'],
    parameters: {
      includeLastLogin: true,
      filterInactive: true,
    },
  },
  {
    id: 'r3',
    name: 'User Activity Audit',
    type: 'UserActivities',
    schedule: 'daily',
    lastRun: new Date(2023, 11, 28),
    recipients: ['security@example.com'],
    parameters: {
      includeFailed: true,
      includeAdmins: true,
    },
  },
  {
    id: 'r4',
    name: 'IT Department Group Membership',
    type: 'GroupMembership',
    lastRun: new Date(2023, 11, 15),
    recipients: ['it-manager@example.com'],
    parameters: {
      groupId: 'IT Department',
      includeNestedGroups: true,
    },
  },
  {
    id: 'r5',
    name: 'Executive License Allocation',
    type: 'LicenseUsage',
    lastRun: new Date(2023, 11, 10),
    recipients: ['finance@example.com', 'cio@example.com'],
    parameters: {
      departments: ['Executive', 'Management'],
      licenseTypes: ['Microsoft 365 E5', 'Microsoft 365 E3'],
    },
  },
];

const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportConfiguration[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [reportToDelete, setReportToDelete] = useState<ReportConfiguration | null>(null);
  const [exportingReports, setExportingReports] = useState<Record<string, boolean>>({});

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = 
      filterType === 'all' ||
      report.type === filterType;
      
    return matchesSearch && matchesType;
  });

  const handleRunReport = (reportId: string) => {
    // Set exporting state for this report
    setExportingReports(prev => ({ ...prev, [reportId]: true }));
    
    // Simulate report generation
    setTimeout(() => {
      // Update last run time
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, lastRun: new Date() } 
          : report
      ));
      
      // Clear exporting state
      setExportingReports(prev => ({ ...prev, [reportId]: false }));
      
      toast({
        title: "Report Generated",
        description: "The report has been generated successfully.",
      });
    }, 1500);
  };

  const handleDeleteReport = () => {
    if (!reportToDelete) return;

    const updatedReports = reports.filter(report => report.id !== reportToDelete.id);
    setReports(updatedReports);
    setReportToDelete(null);
    toast({
      title: "Report Deleted",
      description: `${reportToDelete.name} has been deleted.`,
      variant: "destructive",
    });
  };

  // Function to get icon based on report type
  const getReportIcon = (type: ReportType) => {
    switch (type) {
      case 'LicenseUsage':
        return <Key className="h-5 w-5 mr-2 text-primary" />;
      case 'ActiveAccounts':
        return <Users className="h-5 w-5 mr-2 text-primary" />;
      case 'UserActivities':
        return <UserPlus className="h-5 w-5 mr-2 text-primary" />;
      case 'GroupMembership':
        return <Users className="h-5 w-5 mr-2 text-primary" />;
      default:
        return <FileText className="h-5 w-5 mr-2 text-primary" />;
    }
  };

  // Function to get schedule badge
  const getScheduleBadge = (schedule?: 'daily' | 'weekly' | 'monthly') => {
    if (!schedule) {
      return <Badge variant="outline">On Demand</Badge>;
    }
    
    switch (schedule) {
      case 'daily':
        return <Badge variant="default">Daily</Badge>;
      case 'weekly':
        return <Badge variant="secondary">Weekly</Badge>;
      case 'monthly':
        return <Badge variant="outline">Monthly</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BarChart className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Configure a new report for your organization
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-muted-foreground py-8">
                  Report creation form would go here
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 flex items-center border rounded-md px-3 py-2">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <Input
            placeholder="Search reports by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Report Types</SelectItem>
              <SelectItem value="LicenseUsage">License Reports</SelectItem>
              <SelectItem value="ActiveAccounts">Account Reports</SelectItem>
              <SelectItem value="UserActivities">Activity Reports</SelectItem>
              <SelectItem value="GroupMembership">Group Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No reports found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery || filterType !== 'all'
              ? "No reports match your search criteria" 
              : "You haven't created any reports yet"}
          </p>
          {!searchQuery && filterType === 'all' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Create New Report</DialogTitle>
                  <DialogDescription>
                    Configure a new report for your organization
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-center text-muted-foreground py-8">
                    Report creation form would go here
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {getReportIcon(report.type)}
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    {getScheduleBadge(report.schedule)}
                    <Badge variant="outline">
                      {report.type.replace(/([A-Z])/g, ' $1').trim()}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {report.type === 'LicenseUsage' && "License allocation and usage statistics"}
                  {report.type === 'ActiveAccounts' && "Active user accounts and login status"}
                  {report.type === 'UserActivities' && "User activity and audit information"}
                  {report.type === 'GroupMembership' && "Group membership details"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Last Generated</div>
                      <div className="text-sm text-muted-foreground">
                        {report.lastRun ? format(report.lastRun, 'PPp') : 'Never'}
                      </div>
                    </div>
                  </div>
                  
                  {report.schedule && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Schedule</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {report.schedule === 'daily' && 'Every day at 12:00 AM'}
                          {report.schedule === 'weekly' && 'Every Monday at 12:00 AM'}
                          {report.schedule === 'monthly' && 'First day of the month'}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Recipients</div>
                      <div className="text-sm text-muted-foreground">
                        {report.recipients.length} email{report.recipients.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRunReport(report.id)}
                      disabled={exportingReports[report.id]}
                    >
                      {exportingReports[report.id] ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Now
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (report.lastRun) {
                          toast({
                            title: "Download Started",
                            description: "Your report is being downloaded.",
                          });
                        } else {
                          toast({
                            title: "No Data Available",
                            description: "This report has never been generated.",
                            variant: "destructive",
                          });
                        }
                      }}
                      disabled={!report.lastRun}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Edit Report</DialogTitle>
                          <DialogDescription>
                            Modify the configuration for {report.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-center text-muted-foreground py-8">
                            Report edit form would go here
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setReportToDelete(report)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!reportToDelete} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
              {reportToDelete?.name && (
                <span className="block mt-2 font-medium">"{reportToDelete.name}"</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReport}
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

export default Reports;
