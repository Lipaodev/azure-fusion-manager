
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, UserPlus, Filter, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ADUser } from '@/types';
import ADUserCard from '@/components/ad-users/ADUserCard';
import ImportADUsersModal from '@/components/ad-users/ImportADUsersModal';

// Mock data - in a real app, this would come from an API
const mockADUsers: ADUser[] = [];

// Mock domain controllers for import
const mockDomainControllers = [
  { id: '1', name: 'dc01.example.com' },
  { id: '2', name: 'dc02.example.com' }
];

// Mock groups for import
const mockGroups = [
  { id: '1', name: 'IT Department' },
  { id: '2', name: 'Sales' },
  { id: '3', name: 'HR' },
  { id: '4', name: 'Finance' }
];

const ADUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [users, setUsers] = useState<ADUser[]>(mockADUsers);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filter users based on search query and group filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesGroup = 
      filterGroup === 'all' ||
      user.groups.includes(filterGroup);
      
    return matchesSearch && matchesGroup;
  });

  const handleImportUsers = (data: any) => {
    console.log('Import data:', data);
    
    // Create different sample items based on the importType
    if (data.importType === 'users' || data.importType === 'all') {
      // For demo purposes, we'll create some sample users
      const importedUsers: ADUser[] = [
        {
          id: '1',
          username: 'jdoe',
          displayName: 'John Doe',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          jobTitle: 'Software Developer',
          department: 'IT',
          phoneNumber: '555-1234',
          isEnabled: true,
          groups: ['IT Department'],
          createdAt: new Date(),
          lastModified: new Date(),
          lastLogon: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
        },
        {
          id: '2',
          username: 'asmith',
          displayName: 'Alice Smith',
          email: 'alice.smith@example.com',
          firstName: 'Alice',
          lastName: 'Smith',
          jobTitle: 'HR Manager',
          department: 'Human Resources',
          phoneNumber: '555-5678',
          isEnabled: true,
          groups: ['HR'],
          createdAt: new Date(),
          lastModified: new Date(),
          lastLogon: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          id: '3',
          username: 'rjohnson',
          displayName: 'Robert Johnson',
          email: 'robert.johnson@example.com',
          firstName: 'Robert',
          lastName: 'Johnson',
          jobTitle: 'Sales Director',
          department: 'Sales',
          phoneNumber: '555-9012',
          isEnabled: true,
          groups: ['Sales'],
          createdAt: new Date(),
          lastModified: new Date(),
          lastLogon: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        }
      ];
      
      // Add the imported users to our state
      setUsers(prevUsers => {
        const newUsers = [...prevUsers];
        importedUsers.forEach(user => {
          // Check if user already exists (by id or username)
          const existingIndex = newUsers.findIndex(u => u.id === user.id || u.username === user.username);
          if (existingIndex >= 0) {
            // Update existing user
            newUsers[existingIndex] = { ...user };
          } else {
            // Add new user
            newUsers.push(user);
          }
        });
        return newUsers;
      });
    }
    
    toast({
      title: "Import Successful",
      description: `Successfully imported ${data.importType} from Active Directory`,
    });
  };

  // Handler for editing a user
  const handleEditUser = (user: ADUser) => {
    navigate(`/ad-users/edit/${user.id}`);
    toast({
      title: "Edit User",
      description: `Editing ${user.displayName}`,
    });
  };

  // Handler for deleting a user
  const handleDeleteUser = (user: ADUser) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast({
      title: "User Deleted",
      description: `${user.displayName} has been removed`,
      variant: "destructive",
    });
  };

  // Handler for resetting a user's password
  const handleResetPassword = (user: ADUser) => {
    toast({
      title: "Password Reset",
      description: `Password reset initiated for ${user.displayName}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Active Directory Users</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => navigate('/ad-users/create')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>
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
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="IT Department">IT Department</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery || filterGroup !== 'all'
              ? "No users match your search criteria" 
              : "You haven't added any Active Directory users yet"}
          </p>
          {!searchQuery && filterGroup === 'all' && (
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setIsImportModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Users
              </Button>
              <Button onClick={() => navigate('/ad-users/create')}>
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <ADUserCard 
              key={user.id} 
              user={user} 
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onResetPassword={handleResetPassword}
            />
          ))}
        </div>
      )}

      <ImportADUsersModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImportUsers}
        domainControllers={mockDomainControllers}
        groups={mockGroups}
      />
    </div>
  );
};

export default ADUsers;
