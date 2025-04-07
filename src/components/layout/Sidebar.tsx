import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  UserPlus, 
  UserCog,
  Group, 
  Server, 
  Settings, 
  BarChart, 
  Mail, 
  Shield,
  Cloud,
  Key,
  Monitor
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />
    },
    {
      title: "AD Users",
      href: "/ad-users",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Create AD User",
      href: "/ad-users/create",
      icon: <UserPlus className="h-5 w-5" />
    },
    {
      title: "AD Groups",
      href: "/ad-groups",
      icon: <Group className="h-5 w-5" />
    },
    {
      title: "AD Servers",
      href: "/ad-servers",
      icon: <Server className="h-5 w-5" />
    },
    {
      title: "Web App Users",
      href: "/webapp-users",
      icon: <UserCog className="h-5 w-5" />
    },
    {
      title: "Microsoft 365",
      href: "/microsoft-365",
      icon: <Cloud className="h-5 w-5" />
    },
    {
      title: "License Management",
      href: "/licenses",
      icon: <Key className="h-5 w-5" />
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart className="h-5 w-5" />
    },
    {
      title: "Email Notifications",
      href: "/email-settings",
      icon: <Mail className="h-5 w-5" />
    },
    {
      title: "SSO Configuration",
      href: "/sso",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "System Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />
    },
    {
      title: "Audit Logs",
      href: "/audit",
      icon: <Monitor className="h-5 w-5" />
    }
  ];

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground fixed lg:relative z-20",
        "h-[calc(100vh-3.5rem)] w-64 transition-transform duration-300 transform",
        "overflow-hidden",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20",
        "border-r border-sidebar-border"
      )}
    >
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className={cn(
            "flex items-center justify-center py-5",
            !open && "lg:hidden"
          )}>
            <div className="h-12 w-12 rounded-full overflow-hidden bg-sidebar-accent flex items-center justify-center">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCAxNDAiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik00MCA3MEw4MCAwSDQwTDAgNzBINDBaIiBmaWxsPSIjMDA3OEQ0Ii8+PHBhdGggZD0iTTQwIDcwTDAgMTQwSDQwTDgwIDcwSDQwWiIgZmlsbD0iIzAwNzhENCI+PC9wYXRoPjwvc3ZnPg==" 
                alt="Azure AD Manager" 
                className="h-8 w-8"
              />
            </div>
            <div className={cn(
              "ml-3 transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0 lg:hidden"
            )}>
              <h2 className="text-lg font-semibold">Azure AD Manager</h2>
              <p className="text-xs text-sidebar-foreground/70">Manage your identity</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map(item => (
              <NavLink 
                key={item.href} 
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 rounded-md text-sm",
                  "transition-colors duration-200",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  !open && "lg:justify-center lg:px-0"
                )}
              >
                {item.icon}
                <span className={cn(
                  "ml-3 transition-opacity duration-300",
                  open ? "opacity-100" : "opacity-0 hidden lg:hidden"
                )}>
                  {item.title}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
};
