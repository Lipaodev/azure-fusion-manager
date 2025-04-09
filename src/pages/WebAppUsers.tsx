import React, { useState } from 'react';
import { 
  UserCog, 
  Search, 
  UserPlus, 
  Filter, 
  User, 
  Mail, 
  Shield, 
  Clock, 
  Settings, 
  LockKeyhole,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { WebAppUser } from '@/types';
import { format } from 'date-fns';

const initialWebAppUsers: WebAppUser[] = [];

const WebAppUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<WebAppUser[]>(initialWebAppUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [userToDelete, setUserToDelete] = useState<WebAppUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<WebAppUser | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<WebAppUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = 
      filterRole === 'all' ||
      user.role.toLowerCase() === filterRole.toLowerCase();
      
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = () => {
    if (!userToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      
      toast({
        title: "User Deleted",
        description: `${userToDelete.displayName} has been removed from the web application.`,
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the user.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    } finally {
      setUserToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleResetPassword = () => {
    if (!userToResetPassword || !newPassword) return;

    toast({
      title: "Password Reset",
      description: `Password for ${userToResetPassword.displayName} has been reset.`,
    });
    
    setUserToResetPassword(null);
    setNewPassword('');
  };

  const handleToggleUserStatus = (user: WebAppUser) => {
    try {
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, isActive: !u.isActive } 
          : u
      );
      
      setUsers(updatedUsers);
      
      toast({
        title: user.isActive ? "User Disabled" : "User Enabled",
        description: `${user.displayName} has been ${user.isActive ? 'disabled' : 'enabled'}.`,
      });
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to update user status.",
        variant: "destructive",
      });
      console.error("Toggle status error:", error);
    }
  };

  const handleCreateUser = () => {
    const newId = `new-${Date.now()}`;
    const newUser: WebAppUser = {
      id: newId,
      username: `user${newId.substring(0, 5)}`,
      email: `user${newId.substring(0, 5)}@example.com`,
      displayName: "New Test User",
      role: "User",
      lastLogin: new Date(),
      createdAt: new Date(),
      isActive: true,
      permissions: ['read:users'],
    };
    
    setUsers(prev => [...prev, newUser]);
    
    toast({
      title: "User Created",
      description: "New test user has been created successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <UserCog className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Web App Users</h1>
        </div>
        <Button onClick={handleCreateUser}>
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
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
              <SelectItem value="user">Standard Users</SelectItem>
              <SelectItem value="readonly">Read-Only Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <UserCog className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery || filterRole !== 'all'
              ? "No users match your search criteria" 
              : "You haven't added any web application users yet"}
          </p>
          {!searchQuery && filterRole === 'all' && (
            <Button onClick={handleCreateUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Your First User
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} className={user.isActive ? "" : "opacity-75"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`} />
                      <AvatarFallback>
                        {user.displayName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.displayName}</CardTitle>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <User className="h-3.5 w-3.5 mr-1" />
                        {user.username}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      user.role === 'Admin' 
                        ? "default" 
                        : user.role === 'User' 
                          ? "secondary" 
                          : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {user.lastLogin 
                      ? `Last login: ${format(user.lastLogin, 'PP')}` 
                      : 'Never logged in'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {user.permissions.length} permission{user.permissions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Badge 
                    variant={user.isActive ? "outline" : "secondary"} 
                    className="rounded-full px-2 py-0 text-xs"
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between">
                  <Button 
                    variant={user.isActive ? "destructive" : "outline"} 
                    size="sm"
                    onClick={() => handleToggleUserStatus(user)}
                  >
                    {user.isActive ? 'Disable' : 'Enable'}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Actions
                        <MoreVertical className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setUserToEdit(user)}>
                        <User className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setUserToResetPassword(user)}>
                        <LockKeyhole className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setUserToDelete(user)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Web App User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground py-8">
              Web app user edit form would go here
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!userToResetPassword} onOpenChange={(open) => !open && setUserToResetPassword(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5" />
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
              <Button variant="outline" onClick={() => setUserToResetPassword(null)}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword} disabled={newPassword.length < 8}>
                Reset Password
              </Button>
            </div>
          </div>
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
              Are you sure you want to delete this web application user? This action cannot be undone.
              {userToDelete?.displayName && (
                <span className="block mt-2 font-medium">"{userToDelete.displayName}"</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WebAppUsers;
