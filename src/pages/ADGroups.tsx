
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  PlusCircle, 
  User, 
  Edit, 
  Trash2, 
  MoreVertical, 
  AlertCircle 
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ADGroup } from '@/types';
import { format } from 'date-fns';

// Mock data for AD groups
const mockGroups: ADGroup[] = [
  {
    id: 'g1',
    name: 'Domain Users',
    description: 'All domain users',
    members: 150,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 1, 1),
    lastModified: new Date(2023, 10, 10),
  },
  {
    id: 'g2',
    name: 'Developers',
    description: 'Software development team',
    members: 25,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 2, 15),
    lastModified: new Date(2023, 9, 5),
  },
  {
    id: 'g3',
    name: 'Marketing',
    description: 'Marketing department',
    members: 15,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 3, 10),
    lastModified: new Date(2023, 8, 20),
  },
  {
    id: 'g4',
    name: 'HR Team',
    description: 'Human Resources team',
    members: 8,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 4, 5),
    lastModified: new Date(2023, 7, 15),
  },
  {
    id: 'g5',
    name: 'Finance',
    description: 'Finance department',
    members: 12,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 5, 20),
    lastModified: new Date(2023, 10, 10),
  },
  {
    id: 'g6',
    name: 'Sales Team',
    description: 'Sales department',
    members: 18,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 6, 15),
    lastModified: new Date(2023, 11, 5),
  },
  {
    id: 'g7',
    name: 'Support',
    description: 'Customer support team',
    members: 10,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 7, 20),
    lastModified: new Date(2023, 10, 20),
  },
  {
    id: 'g8',
    name: 'Executives',
    description: 'Company executives',
    members: 5,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 8, 10),
    lastModified: new Date(2023, 9, 10),
  },
  {
    id: 'g9',
    name: 'Remote Users',
    description: 'Users who work remotely',
    members: 45,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 9, 5),
    lastModified: new Date(2023, 11, 15),
  },
];

const ADGroups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<ADGroup[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [groupToView, setGroupToView] = useState<ADGroup | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<ADGroup | null>(null);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = 
      filterCategory === 'all' ||
      (filterCategory === 'security' && group.category === 'Security') ||
      (filterCategory === 'distribution' && group.category === 'Distribution');
      
    return matchesSearch && matchesCategory;
  });

  const handleDeleteGroup = () => {
    if (!groupToDelete) return;

    const updatedGroups = groups.filter(group => group.id !== groupToDelete.id);
    setGroups(updatedGroups);
    setGroupToDelete(null);
    toast({
      title: "Group Deleted",
      description: `${groupToDelete.name} has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">AD Groups</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Create AD Group</DialogTitle>
              <DialogDescription>
                Create a new group in Active Directory
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-muted-foreground">
                Group creation form would go here
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 flex items-center border rounded-md px-3 py-2">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <Input
            placeholder="Search groups by name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="security">Security Groups</SelectItem>
              <SelectItem value="distribution">Distribution Groups</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-10">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No groups found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery || filterCategory !== 'all'
              ? "No groups match your search criteria" 
              : "No groups exist in the directory"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      {group.name}
                    </CardTitle>
                    {group.description && (
                      <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setGroupToView(group)}>
                        <User className="mr-2 h-4 w-4" />
                        View Members
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Group
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setGroupToDelete(group)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Members:</div>
                  <div className="font-medium">{group.members}</div>
                  
                  <div className="text-muted-foreground">Type:</div>
                  <div className="font-medium">{group.category}</div>
                  
                  <div className="text-muted-foreground">Scope:</div>
                  <div className="font-medium">{group.scope}</div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="w-full flex justify-between">
                  <Badge variant="outline">
                    Created {format(group.createdAt, 'MMM d, yyyy')}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setGroupToView(group)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    View Members
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Group Members Dialog */}
      <Dialog open={!!groupToView} onOpenChange={(open) => !open && setGroupToView(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Group Members - {groupToView?.name}</DialogTitle>
            <DialogDescription>
              View and manage users in this group
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground py-8">
              Group members list would go here
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!groupToDelete} onOpenChange={(open) => !open && setGroupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this group? This action cannot be undone.
              {groupToDelete?.name && (
                <span className="block mt-2 font-medium">"{groupToDelete.name}"</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteGroup}
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

export default ADGroups;
