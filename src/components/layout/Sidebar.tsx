
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { 
  Home, 
  Server, 
  Users, 
  Group, 
  UserCog, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Mail, 
  Settings, 
  Shield, 
  ClipboardList, 
  BarChart3, 
  FileText, 
  LogOut
} from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { 
      name: "Active Directory", 
      items: [
        { name: "AD Servers", href: "/ad-servers", icon: Server },
        { name: "AD Users", href: "/ad-users", icon: Users },
        { name: "AD Groups", href: "/ad-groups", icon: Group },
      ]
    },
    { 
      name: "Web App", 
      items: [
        { name: "Users", href: "/webapp-users", icon: UserCog },
      ]
    },
    { 
      name: "Microsoft 365", 
      items: [
        { name: "Users", href: "/microsoft-365", icon: Users },
        { name: "Licenses", href: "/licenses", icon: FileText },
      ]
    },
    { 
      name: "Reports", 
      items: [
        { name: "Overview", href: "/reports", icon: BarChart3 },
        { name: "Audit Logs", href: "/audit", icon: ClipboardList },
      ]
    },
    { 
      name: "Administration", 
      items: [
        { name: "Email Settings", href: "/email-settings", icon: Mail },
        { name: "SSO Configuration", href: "/sso", icon: Shield },
        { name: "System Settings", href: "/settings", icon: Settings },
      ]
    },
  ];

  // Helper to determine if a link is active
  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <aside
      className={classNames(
        "bg-white dark:bg-gray-800 transition-all duration-300 border-r dark:border-gray-700 h-full fixed left-0 top-0 z-40 flex flex-col",
        {
          "w-64": isSidebarOpen,
          "w-16": !isSidebarOpen,
        }
      )}
    >
      <div className="py-4 px-3 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          {isSidebarOpen ? (
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              AD Manager
            </span>
          ) : (
            <span className="text-xl font-bold text-gray-800 dark:text-white mx-auto">
              AD
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <PanelLeftOpen className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className={classNames(
            "mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg",
            { "text-center": !isSidebarOpen }
          )}>
            {isSidebarOpen ? (
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user.displayName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="font-medium text-sm truncate w-full">{user.displayName.charAt(0)}</span>
              </div>
            )}
          </div>
        )}

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            if ("items" in item) {
              return (
                <div key={item.name} className="mb-4">
                  {isSidebarOpen && (
                    <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {item.name}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {item.items?.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.href}
                        className={({ isActive }) =>
                          classNames(
                            "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                            {
                              "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100": isActive,
                              "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700": !isActive,
                              "justify-center": !isSidebarOpen,
                            }
                          )
                        }
                      >
                        {subItem.icon && <subItem.icon className={classNames("h-5 w-5", { "mr-3": isSidebarOpen })} />}
                        {isSidebarOpen && <span>{subItem.name}</span>}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                      {
                        "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100": isActive,
                        "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700": !isActive,
                        "justify-center": !isSidebarOpen,
                      }
                    )
                  }
                >
                  {item.icon && <item.icon className={classNames("h-5 w-5", { "mr-3": isSidebarOpen })} />}
                  {isSidebarOpen && <span>{item.name}</span>}
                </NavLink>
              );
            }
          })}
        </nav>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={classNames(
            "flex items-center px-3 py-2 text-sm rounded-lg transition-colors mt-auto text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
            { "justify-center": !isSidebarOpen }
          )}
        >
          <LogOut className={classNames("h-5 w-5", { "mr-3": isSidebarOpen })} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
