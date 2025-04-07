
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  UserCircle, 
  HelpCircle,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState(3);

  const handleLogout = () => {
    toast({
      title: "Logout successful",
      description: "You have been logged out of the system",
    });
    navigate('/login');
  };

  return (
    <header className="bg-sidebar text-sidebar-foreground h-14 flex items-center px-4 py-2 shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="mr-4 text-sidebar-foreground hover:bg-sidebar-accent"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 flex items-center">
        <h1 className="text-xl font-semibold mr-6">Azure AD Manager</h1>
        
        <div className="hidden md:flex relative max-w-md w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users, groups, computers..."
            className="pl-8 bg-sidebar-accent text-sidebar-foreground placeholder:text-sidebar-foreground/60"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-sidebar-accent">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center bg-red-500">
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <span className="font-medium">New user created</span>
                <span className="text-xs text-muted-foreground">John Doe was added to the system</span>
                <span className="text-xs text-muted-foreground mt-1">2 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <span className="font-medium">License assignment</span>
                <span className="text-xs text-muted-foreground">5 Microsoft 365 Business licenses assigned</span>
                <span className="text-xs text-muted-foreground mt-1">25 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-2">
                <span className="font-medium">Group membership updated</span>
                <span className="text-xs text-muted-foreground">2 users added to 'Marketing' group</span>
                <span className="text-xs text-muted-foreground mt-1">1 hour ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-medium" onClick={() => navigate('/notifications')}>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-sidebar-accent"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/help')}>
              Help Center
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/documentation')}>
              Documentation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              About
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 hover:bg-sidebar-accent"
            >
              <UserCircle className="h-5 w-5" />
              <span className="hidden md:inline-block">Admin User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
