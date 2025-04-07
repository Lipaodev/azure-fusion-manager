
import React, { useState } from 'react';
import { PlusCircle, AlertCircle, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import ADServerForm from '@/components/ad-servers/ADServerForm';
import ADServerCard from '@/components/ad-servers/ADServerCard';
import { ADServer } from '@/types';

// Mock data for AD servers
const mockServers: ADServer[] = [
  {
    id: '1',
    name: 'Primary Domain Controller',
    domain: 'example.com',
    server: 'dc01.example.com',
    port: 389,
    useSSL: true,
    username: 'admin@example.com',
    password: '********',
    isConnected: true,
    lastConnectionTime: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    name: 'Secondary Domain Controller',
    domain: 'example.com',
    server: 'dc02.example.com',
    port: 636,
    useSSL: true,
    username: 'admin@example.com',
    password: '********',
    isConnected: true,
    lastConnectionTime: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '3',
    name: 'Remote Office DC',
    domain: 'branch.example.com',
    server: 'remote-dc.branch.example.com',
    port: 389,
    useSSL: false,
    username: 'admin@branch.example.com',
    password: '********',
    isConnected: false,
    lastConnectionTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const ADServers = () => {
  const { toast } = useToast();
  const [servers, setServers] = useState<ADServer[]>(mockServers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ADServer | undefined>(undefined);
  const [serverToDelete, setServerToDelete] = useState<ADServer | undefined>(undefined);

  const filteredServers = servers.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.server.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddServer = (data: any) => {
    const newServer: ADServer = {
      id: Date.now().toString(),
      name: data.name,
      domain: data.domain,
      server: data.server,
      port: data.port,
      useSSL: data.useSSL,
      username: data.username,
      password: data.password,
      isConnected: false,
    };

    setServers([...servers, newServer]);
    setIsAddServerOpen(false);
    toast({
      title: "Server Added",
      description: `${data.name} has been added to your server list.`,
    });
  };

  const handleEditServer = (data: any) => {
    if (!editingServer) return;

    const updatedServers = servers.map(server => 
      server.id === editingServer.id 
        ? { ...server, ...data } 
        : server
    );

    setServers(updatedServers);
    setEditingServer(undefined);
    toast({
      title: "Server Updated",
      description: `${data.name} has been updated.`,
    });
  };

  const handleDeleteServer = () => {
    if (!serverToDelete) return;

    const updatedServers = servers.filter(server => server.id !== serverToDelete.id);
    setServers(updatedServers);
    setServerToDelete(undefined);
    toast({
      title: "Server Deleted",
      description: `${serverToDelete.name} has been removed.`,
      variant: "destructive",
    });
  };

  const handleTestConnection = (server: ADServer) => {
    // In a real application, this would actually test the connection
    const success = Math.random() > 0.3; // Simulate success/failure
    
    const updatedServers = servers.map(s => 
      s.id === server.id 
        ? { 
            ...s, 
            isConnected: success, 
            lastConnectionTime: new Date() 
          } 
        : s
    );
    
    setServers(updatedServers);
    
    if (success) {
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${server.name}.`,
      });
    } else {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${server.name}. Please check your server details.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">AD Servers</h1>
        <Dialog open={isAddServerOpen} onOpenChange={setIsAddServerOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add AD Server</DialogTitle>
              <DialogDescription>
                Configure a connection to an Active Directory server
              </DialogDescription>
            </DialogHeader>
            <ADServerForm 
              onSubmit={handleAddServer} 
              onCancel={() => setIsAddServerOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center border rounded-md px-3 py-2 max-w-sm">
        <Server className="h-5 w-5 text-muted-foreground mr-2" />
        <Input
          placeholder="Search servers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 p-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {filteredServers.length === 0 ? (
        <div className="text-center py-10">
          <Server className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No servers found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery 
              ? "No servers match your search criteria" 
              : "You haven't added any Active Directory servers yet"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddServerOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Server
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServers.map((server) => (
            <ADServerCard
              key={server.id}
              server={server}
              onEdit={setEditingServer}
              onDelete={setServerToDelete}
              onTest={handleTestConnection}
            />
          ))}
        </div>
      )}

      {/* Edit Server Dialog */}
      <Dialog open={!!editingServer} onOpenChange={(open) => !open && setEditingServer(undefined)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit AD Server</DialogTitle>
            <DialogDescription>
              Update your Active Directory server connection
            </DialogDescription>
          </DialogHeader>
          {editingServer && (
            <ADServerForm 
              server={editingServer}
              onSubmit={handleEditServer} 
              onCancel={() => setEditingServer(undefined)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!serverToDelete} onOpenChange={(open) => !open && setServerToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this server? This action cannot be undone.
              {serverToDelete?.name && (
                <span className="block mt-2 font-medium">"{serverToDelete.name}"</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteServer}
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

export default ADServers;
