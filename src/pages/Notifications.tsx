
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Bell, Check, Info, AlertCircle } from "lucide-react";

// Sample notification data
const notifications = [
  {
    id: 1,
    title: "New user created",
    description: "John Doe was added to the system",
    time: "2 minutes ago",
    type: "info",
    read: false
  },
  {
    id: 2,
    title: "License assignment",
    description: "5 Microsoft 365 Business licenses assigned",
    time: "25 minutes ago",
    type: "success",
    read: false
  },
  {
    id: 3,
    title: "Group membership updated",
    description: "2 users added to 'Marketing' group",
    time: "1 hour ago",
    type: "info",
    read: false
  },
  {
    id: 4,
    title: "Password reset requested",
    description: "User Sarah Johnson requested a password reset",
    time: "3 hours ago",
    type: "warning",
    read: true
  },
  {
    id: 5,
    title: "Failed login attempt",
    description: "Multiple failed login attempts detected for user admin",
    time: "5 hours ago",
    type: "error",
    read: true
  },
  {
    id: 6,
    title: "System update completed",
    description: "The system was updated to version 2.5.1",
    time: "1 day ago",
    type: "success",
    read: true
  },
  {
    id: 7,
    title: "Backup completed",
    description: "Scheduled backup completed successfully",
    time: "2 days ago",
    type: "success",
    read: true
  }
];

const NotificationItem = ({ 
  notification 
}: { 
  notification: typeof notifications[0] 
}) => {
  // Icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 flex gap-3 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium">{notification.title}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {notification.time}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {notification.description}
        </p>
      </div>
    </div>
  );
};

const Notifications = () => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-4">
          <Badge>{unreadCount} unread</Badge>
          <Button variant="outline" size="sm">Mark All as Read</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>
            Stay updated with system changes and user activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="border rounded-md">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No notifications found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="border rounded-md">
              {notifications.filter(n => !n.read).length > 0 ? (
                notifications.filter(n => !n.read).map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Check className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No unread notifications</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="system" className="border rounded-md">
              {notifications.filter(n => ['success', 'error', 'warning'].includes(n.type)).length > 0 ? (
                notifications.filter(n => ['success', 'error', 'warning'].includes(n.type)).map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Info className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No system notifications</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="users" className="border rounded-md">
              {notifications.filter(n => n.type === 'info').length > 0 ? (
                notifications.filter(n => n.type === 'info').map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Info className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No user notifications</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
