
import React from 'react';
import { User, Edit, Trash2, MoreVertical, UserCog, Mail, Check, X, Lock, Key } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ADUser } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ADUserCardProps {
  user: ADUser;
  onEdit: (user: ADUser) => void;
  onDelete: (user: ADUser) => void;
  onResetPassword: (user: ADUser) => void;
}

const ADUserCard: React.FC<ADUserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onResetPassword,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              {user.profilePictureUrl ? (
                <AvatarImage src={user.profilePictureUrl} alt={user.displayName} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.firstName[0]}{user.lastName[0]}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onResetPassword(user)}>
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(user)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge 
          variant={user.isEnabled ? "default" : "secondary"}
          className="mt-1 self-start"
        >
          {user.isEnabled ? (
            <span className="flex items-center">
              <Check className="mr-1 h-3 w-3" /> Enabled
            </span>
          ) : (
            <span className="flex items-center">
              <X className="mr-1 h-3 w-3" /> Disabled
            </span>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="text-muted-foreground flex items-center">
            <Mail className="h-3.5 w-3.5 mr-1" /> Email:
          </div>
          <div className="font-medium truncate">{user.email}</div>
          
          {user.jobTitle && (
            <>
              <div className="text-muted-foreground">Job Title:</div>
              <div className="font-medium truncate">{user.jobTitle}</div>
            </>
          )}
          
          {user.department && (
            <>
              <div className="text-muted-foreground">Department:</div>
              <div className="font-medium truncate">{user.department}</div>
            </>
          )}
          
          {user.lastLogon && (
            <>
              <div className="text-muted-foreground">Last Logon:</div>
              <div className="font-medium">
                {format(user.lastLogon, 'PPP')}
              </div>
            </>
          )}
          
          {user.accountExpires && (
            <>
              <div className="text-muted-foreground">Expires:</div>
              <div className="font-medium">
                {format(user.accountExpires, 'PPP')}
              </div>
            </>
          )}
        </div>
        
        {user.groups.length > 0 && (
          <div>
            <div className="text-muted-foreground mb-1">Groups:</div>
            <div className="flex flex-wrap gap-1">
              {user.groups.slice(0, 3).map((group, index) => (
                <Badge key={index} variant="outline">
                  {group}
                </Badge>
              ))}
              {user.groups.length > 3 && (
                <Badge variant="outline">
                  +{user.groups.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full flex justify-between">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onEdit(user)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            size="sm"
            variant="secondary"
            onClick={() => onResetPassword(user)}
          >
            <Lock className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ADUserCard;
