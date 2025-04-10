
import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, Search, AlertCircle, Building, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/services/database';

interface Client {
  id: string;
  name: string;
}

const Clients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [newClientName, setNewClientName] = useState('');
  const [editClientName, setEditClientName] = useState('');

  // Load clients from database
  useEffect(() => {
    setClients(db.getAllClients());
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = () => {
    if (newClientName.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Client name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name: newClientName,
    };

    // Add to database
    db.addClient(newClient);
    setClients(db.getAllClients());
    
    setNewClientName('');
    setIsAddClientOpen(false);
    
    toast({
      title: "Client Added",
      description: `${newClientName} has been added to your client list.`,
    });
  };

  const handleEditClient = () => {
    if (!clientToEdit) return;
    
    if (editClientName.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Client name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const updatedClient: Client = {
      ...clientToEdit,
      name: editClientName,
    };

    // Update in database
    db.updateItem<Client>('clients', clientToEdit.id, updatedClient);
    setClients(db.getAllClients());
    
    setClientToEdit(null);
    setEditClientName('');
    setIsEditClientOpen(false);
    
    toast({
      title: "Client Updated",
      description: `Client has been updated to ${editClientName}.`,
    });
  };

  const handleDeleteClient = () => {
    if (!clientToDelete) return;

    // Delete from database
    db.deleteItem('clients', clientToDelete.id);
    setClients(db.getAllClients());
    
    setClientToDelete(null);
    
    toast({
      title: "Client Deleted",
      description: `${clientToDelete.name} has been removed.`,
    });
  };

  const openEditDialog = (client: Client) => {
    setClientToEdit(client);
    setEditClientName(client.name);
    setIsEditClientOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Add a new client organization to manage Active Directory resources.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="client-name" className="text-sm font-medium">
                  Client Name
                </label>
                <Input
                  id="client-name"
                  placeholder="Enter client name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClient}>
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-10">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No clients found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery
              ? "No clients match your search criteria" 
              : "You haven't added any clients yet"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddClientOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Client
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{client.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Client ID: {client.id}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(client)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setClientToDelete(client)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client organization details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-client-name" className="text-sm font-medium">
                Client Name
              </label>
              <Input
                id="edit-client-name"
                value={editClientName}
                onChange={(e) => setEditClientName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setIsEditClientOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClient}>
              Update Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
              {clientToDelete?.name && (
                <span className="block mt-2 font-medium">"{clientToDelete.name}"</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteClient}
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

export default Clients;
