
import React from 'react';
import { Server, Edit, Trash2, MoreVertical, RefreshCw, Check, X } from 'lucide-react';
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
import { ADServer } from '@/types';
import { format } from 'date-fns';

interface ADServerCardProps {
  server: ADServer;
  onEdit: (server: ADServer) => void;
  onDelete: (server: ADServer) => void;
  onTest: (server: ADServer) => void;
}

const ADServerCard: React.FC<ADServerCardProps> = ({
  server,
  onEdit,
  onDelete,
  onTest,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Server className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-lg">{server.name}</CardTitle>
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
              <DropdownMenuItem onClick={() => onEdit(server)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTest(server)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(server)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge 
          variant={server.isConnected ? "default" : "destructive"}
          className="mt-1 self-start"
        >
          {server.isConnected ? (
            <span className="flex items-center">
              <Check className="mr-1 h-3 w-3" /> Connected
            </span>
          ) : (
            <span className="flex items-center">
              <X className="mr-1 h-3 w-3" /> Disconnected
            </span>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="text-muted-foreground">Domain:</div>
          <div className="font-medium truncate">{server.domain}</div>
          
          <div className="text-muted-foreground">Server:</div>
          <div className="font-medium truncate">{server.server}</div>
          
          <div className="text-muted-foreground">Connection:</div>
          <div className="font-medium">
            {server.port} {server.useSSL ? '(SSL/TLS)' : ''}
          </div>
          
          {server.lastConnectionTime && (
            <>
              <div className="text-muted-foreground">Last Connected:</div>
              <div className="font-medium">
                {format(server.lastConnectionTime, 'PPpp')}
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full flex justify-between">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onEdit(server)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            size="sm"
            onClick={() => onTest(server)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Test Connection
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ADServerCard;
