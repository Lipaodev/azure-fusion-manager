import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertCircle, Server, Filter, PlugZap } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ADServerForm from '@/components/ad-servers/ADServerForm';
import ADServerCard from '@/components/ad-servers/ADServerCard';
import { ADServer } from '@/types';
import { db } from '@/services/database';

const ADServers = () => {
  const { toast } = useToast();
  const [servers, setServers] = useState<ADServer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClient, setFilterClient] = useState('all');
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ADServer | undefined>(undefined);
  const [serverToDelete, setServerToDelete] = useState<ADServer | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    setServers(db.getAllADServers());
    setClients(db.getAllClients());

    if (db.getAllClients().length === 0) {
      const defaultClients = [
        { id: 'client1', name: 'Client 1' },
        { id: 'client2', name: 'Client 2' },
        { id: 'client3', name: 'Client 3' },
      ];
      
      defaultClients.forEach(client => {
        db.addClient(client);
      });
      
      setClients(defaultClients);
    }
  }, []);

  const filteredServers = servers.filter(server => {
    const matchesSearch = 
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.server.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesClient = 
      filterClient === 'all' ||
      server.clientId === filterClient;
      
    return matchesSearch && matchesClient;
  });

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
      clientId: data.clientId || 'client1', // Default client if not specified
      clientName: clients.find(c => c.id === data.clientId)?.name || 'Client 1',
      isConnected: false,
      lastConnectionTime: new Date(),
    };

    db.addADServer(newServer);
    setServers(db.getAllADServers());
    
    setIsAddServerOpen(false);
    toast({
      title: "Server Added",
      description: `${data.name} has been added to your server list.`,
    });
  };

  const handleEditServer = (data: any) => {
    if (!editingServer) return;

    try {
      const updatedServer: ADServer = {
        ...editingServer,
        ...data,
        clientName: clients.find(c => c.id === data.clientId)?.name || editingServer.clientName
      };

      db.updateADServer(editingServer.id, updatedServer);
      setServers(db.getAllADServers());
      
      setEditingServer(undefined);
      toast({
        title: "Server Updated",
        description: `${data.name} has been updated.`,
      });
    } catch (error) {
      console.error("Error updating server:", error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the server",
        variant: "destructive",
      });
    }
  };

  const handleDeleteServer = () => {
    if (!serverToDelete) return;

    try {
      setIsDeleting(true);
      
      db.deleteADServer(serverToDelete.id);
      setServers(db.getAllADServers());
      
      toast({
        title: "Server Deleted",
        description: `${serverToDelete.name} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting server:", error);
      toast({
        title: "Deletion Failed",
        description: "An error occurred while deleting the server",
        variant: "destructive",
      });
    } finally {
      setServerToDelete(undefined);
      setIsDeleting(false);
    }
  };

  const handleTestConnection = async (server: ADServer) => {
    try {
      setIsTestingConnection(true);
      
      const success = await db.testADConnection(server);
      
      setServers(db.getAllADServers());
      
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
    } catch (error) {
      console.error("Error testing connection:", error);
      toast({
        title: "Connection Test Failed",
        description: "An error occurred during the connection test",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
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
              clients={clients}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 flex items-center border rounded-md px-3 py-2">
          <Server className="h-5 w-5 text-muted-foreground mr-2" />
          <Input
            placeholder="Search servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredServers.length === 0 ? (
        <div className="text-center py-10">
          <Server className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No servers found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery || filterClient !== 'all'
              ? "No servers match your search criteria" 
              : "You haven't added any Active Directory servers yet"}
          </p>
          {!searchQuery && filterClient === 'all' && (
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
              clients={clients}
            />
          )}
        </DialogContent>
      </Dialog>

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
