
import React, { useState } from 'react';
import { 
  Monitor, 
  Search, 
  Filter, 
  Download, 
  AlertCircle,
  User,
  FileText,
  Trash2,
  UserPlus,
  Key,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

// Audit log entry interface
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  target: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failure' | 'warning';
}

// Mock data for audit logs
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log1',
    timestamp: new Date(2023, 11, 28, 14, 32, 5),
    action: 'User Created',
    user: 'admin@example.com',
    target: 'john.smith@example.com',
    details: 'Created new user account',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log2',
    timestamp: new Date(2023, 11, 28, 14, 15, 22),
    action: 'Login',
    user: 'admin@example.com',
    target: 'N/A',
    details: 'Successfully logged in',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log3',
    timestamp: new Date(2023, 11, 28, 12, 5, 17),
    action: 'Password Reset',
    user: 'admin@example.com',
    target: 'maria.johnson@example.com',
    details: 'Reset user password',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log4',
    timestamp: new Date(2023, 11, 27, 16, 42, 11),
    action: 'Login',
    user: 'david.williams@example.com',
    target: 'N/A',
    details: 'Failed login attempt',
    ipAddress: '203.0.113.45',
    status: 'failure',
  },
  {
    id: 'log5',
    timestamp: new Date(2023, 11, 27, 15, 30, 8),
    action: 'Group Modified',
    user: 'admin@example.com',
    target: 'Marketing Team',
    details: 'Added 2 users to group',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log6',
    timestamp: new Date(2023, 11, 27, 11, 12, 36),
    action: 'License Assigned',
    user: 'admin@example.com',
    target: 'alice.lee@example.com',
    details: 'Assigned Microsoft 365 Business Premium license',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log7',
    timestamp: new Date(2023, 11, 26, 17, 5, 42),
    action: 'User Modified',
    user: 'admin@example.com',
    target: 'robert.garcia@example.com',
    details: 'Updated user department and job title',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log8',
    timestamp: new Date(2023, 11, 26, 14, 22, 19),
    action: 'Login',
    user: 'john.smith@example.com',
    target: 'N/A',
    details: 'Invalid password provided',
    ipAddress: '198.51.100.73',
    status: 'failure',
  },
  {
    id: 'log9',
    timestamp: new Date(2023, 11, 26, 10, 45, 3),
    action: 'User Deleted',
    user: 'admin@example.com',
    target: 'former.employee@example.com',
    details: 'User account deleted',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log10',
    timestamp: new Date(2023, 11, 25, 16, 33, 27),
    action: 'System Settings',
    user: 'admin@example.com',
    target: 'Email Notifications',
    details: 'Updated email notification settings',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log11',
    timestamp: new Date(2023, 11, 25, 13, 17, 42),
    action: 'SSO Configuration',
    user: 'admin@example.com',
    target: 'Azure AD',
    details: 'Updated Azure AD SSO configuration',
    ipAddress: '192.168.1.100',
    status: 'warning',
  },
  {
    id: 'log12',
    timestamp: new Date(2023, 11, 25, 11, 2, 5),
    action: 'Report Generated',
    user: 'admin@example.com',
    target: 'License Usage Report',
    details: 'Generated and exported license usage report',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log13',
    timestamp: new Date(2023, 11, 24, 16, 42, 31),
    action: 'AD Server Added',
    user: 'admin@example.com',
    target: 'dc03.example.com',
    details: 'Added new Active Directory server',
    ipAddress: '192.168.1.100',
    status: 'success',
  },
  {
    id: 'log14',
    timestamp: new Date(2023, 11, 24, 14, 15, 8),
    action: 'Login',
    user: 'alice.lee@example.com',
    target: 'N/A',
    details: 'Successful login via SSO',
    ipAddress: '203.0.113.22',
    status: 'success',
  },
  {
    id: 'log15',
    timestamp: new Date(2023, 11, 24, 10, 37, 14),
    action: 'System Backup',
    user: 'system',
    target: 'Database',
    details: 'Automatic database backup completed',
    ipAddress: '192.168.1.5',
    status: 'success',
  },
];

const AuditLogs = () => {
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState<keyof AuditLogEntry>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Get unique action types for filter
  const actionTypes = [...new Set(auditLogs.map(log => log.action))];

  // Filter and sort logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesAction = 
      filterAction === 'all' ||
      log.action === filterAction;
      
    const matchesStatus = 
      filterStatus === 'all' ||
      log.status === filterStatus;
      
    const matchesDateRange = 
      (!selectedDateRange.from || log.timestamp >= selectedDateRange.from) &&
      (!selectedDateRange.to || log.timestamp <= new Date(selectedDateRange.to.setHours(23, 59, 59, 999)));
      
    return matchesSearch && matchesAction && matchesStatus && matchesDateRange;
  }).sort((a, b) => {
    if (sortField === 'timestamp') {
      return sortDirection === 'asc' 
        ? a.timestamp.getTime() - b.timestamp.getTime()
        : b.timestamp.getTime() - a.timestamp.getTime();
    }
    
    const valA = a[sortField].toString().toLowerCase();
    const valB = b[sortField].toString().toLowerCase();
    
    return sortDirection === 'asc'
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const handleSort = (field: keyof AuditLogEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportLogs = () => {
    toast({
      title: "Export Started",
      description: "Audit logs are being exported to CSV.",
    });
    
    // In a real app, this would trigger a download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Audit logs have been exported successfully.",
      });
    }, 1000);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterAction('all');
    setFilterStatus('all');
    setSelectedDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
  };

  // Get icon based on action
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Login':
        return <User className="h-4 w-4" />;
      case 'User Created':
      case 'User Modified':
      case 'User Deleted':
        return <UserPlus className="h-4 w-4" />;
      case 'Password Reset':
        return <Key className="h-4 w-4" />;
      case 'License Assigned':
        return <FileText className="h-4 w-4" />;
      case 'Report Generated':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get badge color based on status
  const getStatusBadge = (status: 'success' | 'failure' | 'warning') => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
      case 'failure':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failure</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Monitor className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        </div>
        <Button onClick={handleExportLogs}>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Narrow down audit logs by specific criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search user, IP, details..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionTypes.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDateRange.from ? (
                      selectedDateRange.to ? (
                        <>
                          {format(selectedDateRange.from, 'LLL dd, y')} -{' '}
                          {format(selectedDateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(selectedDateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={selectedDateRange}
                    onSelect={setSelectedDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button 
            variant="outline" 
            className="ml-auto"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Audit Log History</CardTitle>
              <CardDescription>
                Showing {currentLogs.length} of {filteredLogs.length} logs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">
                    <Button 
                      variant="ghost" 
                      className="p-0 font-semibold flex items-center"
                      onClick={() => handleSort('timestamp')}
                    >
                      Timestamp
                      {sortField === 'timestamp' && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="p-0 font-semibold flex items-center"
                      onClick={() => handleSort('action')}
                    >
                      Action
                      {sortField === 'action' && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="p-0 font-semibold flex items-center"
                      onClick={() => handleSort('user')}
                    >
                      User
                      {sortField === 'user' && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Target</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-lg font-medium">No logs found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters to see more results
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentLogs.map((log) => (
                    <TableRow 
                      key={log.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedLog(log)}
                    >
                      <TableCell className="font-medium">
                        {format(log.timestamp, 'yyyy-MM-dd HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getActionIcon(log.action)}
                          <span className="ml-2">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="hidden md:table-cell">{log.target}</TableCell>
                      <TableCell className="hidden md:table-cell">{log.ipAddress}</TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(log.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="border-t pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={pageNumber === currentPage}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && getActionIcon(selectedLog.action)}
              {selectedLog?.action} Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this audit log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-sm font-medium">Timestamp:</div>
                <div className="text-sm">
                  {format(selectedLog.timestamp, 'PPpp')}
                </div>
                
                <div className="text-sm font-medium">User:</div>
                <div className="text-sm">{selectedLog.user}</div>
                
                <div className="text-sm font-medium">Action:</div>
                <div className="text-sm">{selectedLog.action}</div>
                
                <div className="text-sm font-medium">Target:</div>
                <div className="text-sm">{selectedLog.target}</div>
                
                <div className="text-sm font-medium">IP Address:</div>
                <div className="text-sm">{selectedLog.ipAddress}</div>
                
                <div className="text-sm font-medium">Status:</div>
                <div className="text-sm">
                  {getStatusBadge(selectedLog.status)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Details:</div>
                <div className="text-sm bg-muted/20 p-3 rounded-md whitespace-pre-wrap">
                  {selectedLog.details}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;
