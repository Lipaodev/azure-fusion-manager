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
import { DateRange } from 'react-day-picker';

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

const mockAuditLogs: AuditLogEntry[] = [
  // ... keep existing mock data
];

const AuditLogs = () => {
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState<keyof AuditLogEntry>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const actionTypes = [...new Set(auditLogs.map(log => log.action))];

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
                    {selectedDateRange?.from ? (
                      selectedDateRange.to ? (
                        <>
                          {format(selectedDateRange.from, "PPP")} - {format(selectedDateRange.to, "PPP")}
                        </>
                      ) : (
                        format(selectedDateRange.from, "PPP")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={selectedDateRange?.from}
                    selected={selectedDateRange}
                    onSelect={setSelectedDateRange}
                    numberOfMonths={2}
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
