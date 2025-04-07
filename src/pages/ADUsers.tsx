
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, Search, Filter, UserCog, AlertCircle } from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import ADUserCard from '@/components/ad-users/ADUserCard';
import ADUserForm from '@/components/ad-users/ADUserForm';
import { ADUser, ADGroup } from '@/types';

// Mock data for AD users
const mockUsers: ADUser[] = [
  {
    id: '1',
    username: 'jsmith',
    displayName: 'John Smith',
    email: 'john.smith@example.com',
    firstName: 'John',
    lastName: 'Smith',
    jobTitle: 'Software Developer',
    department: 'IT',
    phoneNumber: '(555) 123-4567',
    isEnabled: true,
    groups: ['Domain Users', 'Developers', 'VPN Users'],
    createdAt: new Date(2023, 1, 15),
    lastModified: new Date(2023, 10, 5),
    lastLogon: new Date(2023, 11, 28),
    profilePictureUrl: '',
  },
  {
    id: '2',
    username: 'mjohnson',
    displayName: 'Maria Johnson',
    email: 'maria.johnson@example.com',
    firstName: 'Maria',
    lastName: 'Johnson',
    jobTitle: 'Marketing Manager',
    department: 'Marketing',
    phoneNumber: '(555) 234-5678',
    isEnabled: true,
    groups: ['Domain Users', 'Marketing'],
    createdAt: new Date(2023, 3, 10),
    lastModified: new Date(2023, 9, 20),
    lastLogon: new Date(2023, 11, 29),
    profilePictureUrl: '',
  },
  {
    id: '3',
    username: 'dwilliams',
    displayName: 'David Williams',
    email: 'david.williams@example.com',
    firstName: 'David',
    lastName: 'Williams',
    jobTitle: 'HR Specialist',
    department: 'Human Resources',
    phoneNumber: '(555) 345-6789',
    isEnabled: false,
    groups: ['Domain Users', 'HR Team'],
    createdAt: new Date(2022, 11, 5),
    lastModified: new Date(2023, 8, 15),
    accountExpires: new Date(2023, 12, 31),
    profilePictureUrl: '',
  },
  {
    id: '4',
    username: 'alee',
    displayName: 'Alice Lee',
    email: 'alice.lee@example.com',
    firstName: 'Alice',
    lastName: 'Lee',
    jobTitle: 'Financial Analyst',
    department: 'Finance',
    phoneNumber: '(555) 456-7890',
    isEnabled: true,
    groups: ['Domain Users', 'Finance'],
    createdAt: new Date(2023, 2, 20),
    lastModified: new Date(2023, 10, 10),
    lastLogon: new Date(2023, 11, 25),
    profilePictureUrl: '',
  },
  {
    id: '5',
    username: 'rgarcia',
    displayName: 'Robert Garcia',
    email: 'robert.garcia@example.com',
    firstName: 'Robert',
    lastName: 'Garcia',
    jobTitle: 'Sales Representative',
    department: 'Sales',
    phoneNumber: '(555) 567-8901',
    isEnabled: true,
    groups: ['Domain Users', 'Sales Team'],
    createdAt: new Date(2023, 5, 12),
    lastModified: new Date(2023, 11, 1),
    lastLogon: new Date(2023, 11, 27),
    profilePictureUrl: '',
  },
  {
    id: '6',
    username: 'lbrown',
    displayName: 'Lisa Brown',
    email: 'lisa.brown@example.com',
    firstName: 'Lisa',
    lastName: 'Brown',
    jobTitle: 'Customer Support',
    department: 'Support',
    phoneNumber: '(555) 678-9012',
    isEnabled: true,
    groups: ['Domain Users', 'Help Desk'],
    createdAt: new Date(2023, 4, 15),
    lastModified: new Date(2023, 9, 15),
    lastLogon: new Date(2023, 11, 28),
    profilePictureUrl: '',
  },
];

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
];

const ADUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<ADUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingUser, setEditingUser] = useState<ADUser | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<ADUser | undefined>(undefined);
  const [userToResetPassword, setUserToResetPassword] = useState<ADUser | undefined>(undefined);
  const [newPassword, setNewPassword] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'enabled' && user.isEnabled) ||
      (filterStatus === 'disabled' && !user.isEnabled);
      
    return matchesSearch && matchesStatus;
  });

  const handleEditUser = (data: any) => {
    if (!editingUser) return;

    const updatedUsers = users.map(user => 
      user.id === editingUser.id 
        ? { 
            ...user, 
            ...data,
            lastModified: new Date(),
          } 
        : user
    );

    setUsers(updatedUsers);
    setEditingUser(undefined);
    toast({
      title: "User Updated",
      description: `${data.displayName} has been updated.`,
    });
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    const updatedUsers = users.filter(user => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    setUserToDelete(undefined);
    toast({
      title: "User Deleted",
      description: `${userToDelete.displayName} has been removed.`,
      variant: "destructive",
    });
  };

  const handleResetPassword = () => {
    if (!userToResetPassword || !newPassword) return;

    toast({
      title: "Password Reset",
      description: `Password for ${userToResetPassword.displayName} has been reset.`,
    });
    
    setUserToResetPassword(undefined);
    setNewPassword('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">AD Users</h1>
        <Button onClick={() => navigate('/ad-users/create')}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 flex items-center border rounded-md px-3 py-2">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <Input
            placeholder="Search users by name, username, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="enabled">Enabled Users</SelectItem>
              <SelectItem value="disabled">Disabled Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery || filterStatus !== 'all'
              ? "No users match your search criteria" 
              : "You haven't added any Active Directory users yet"}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Button onClick={() => navigate('/ad-users/create')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Your First User
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <ADUserCard
              key={user.id}
              user={user}
              onEdit={setEditingUser}
              onDelete={setUserToDelete}
              onResetPassword={setUserToResetPassword}
            />
          ))}
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(undefined)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update Active Directory user information
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <ADUserForm 
              user={editingUser}
              groups={mockGroups}
              onSubmit={handleEditUser} 
              onCancel={() => setEditingUser(undefined)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
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

      {/* Reset Password Dialog */}
      <Dialog open={!!userToResetPassword} onOpenChange={(open) => !open && setUserToResetPassword(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for {userToResetPassword?.displayName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <p className="text-sm text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setUserToResetPassword(undefined)}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword} disabled={newPassword.length < 8}>
                Reset Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ADUsers;
