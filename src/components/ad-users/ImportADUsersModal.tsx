
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Cloud, Database, Server, User, Users, Monitor, Filter } from 'lucide-react';

interface ImportADUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any) => void;
  domainControllers: { id: string; name: string }[];
  groups: { id: string; name: string }[];
  clients?: { id: string; name: string }[];
}

const ImportADUsersModal: React.FC<ImportADUsersModalProps> = ({
  open,
  onOpenChange,
  onImport,
  domainControllers,
  groups,
  clients = []
}) => {
  const [activeTab, setActiveTab] = useState('ad');
  const [selectedServer, setSelectedServer] = useState(
    domainControllers.length > 0 ? domainControllers[0].id : ''
  );
  const [selectedClient, setSelectedClient] = useState(
    clients.length > 0 ? clients[0].id : ''
  );
  const [importType, setImportType] = useState('users');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [includeDisabled, setIncludeDisabled] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = () => {
    setIsImporting(true);
    
    try {
      const data = {
        source: activeTab,
        serverId: selectedServer,
        clientId: selectedClient,
        clientName: clients.find(c => c.id === selectedClient)?.name,
        importType,
        groups: selectedGroups,
        includeDisabled,
      };
      
      onImport(data);
      onOpenChange(false);
    } finally {
      setIsImporting(false);
    }
  };

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(current => 
      current.includes(groupId)
        ? current.filter(id => id !== groupId)
        : [...current, groupId]
    );
  };

  const resetForm = () => {
    setActiveTab('ad');
    setSelectedServer(domainControllers.length > 0 ? domainControllers[0].id : '');
    setSelectedClient(clients.length > 0 ? clients[0].id : '');
    setImportType('users');
    setSelectedGroups([]);
    setIncludeDisabled(false);
    setIsImporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetForm();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Directory Data</DialogTitle>
          <DialogDescription>
            Import users, groups, and other objects from Active Directory or Microsoft 365
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ad" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Active Directory
            </TabsTrigger>
            <TabsTrigger value="m365" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Microsoft 365
            </TabsTrigger>
          </TabsList>
          
          {/* Active Directory Tab */}
          <TabsContent value="ad" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client Organization</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="server">Domain Controller</Label>
                <Select value={selectedServer} onValueChange={setSelectedServer}>
                  <SelectTrigger id="server">
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent>
                    {domainControllers.map(dc => (
                      <SelectItem key={dc.id} value={dc.id}>
                        {dc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>What do you want to import?</Label>
                <RadioGroup value={importType} onValueChange={setImportType} className="pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="users" id="import-users" />
                    <Label htmlFor="import-users" className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="groups" id="import-groups" />
                    <Label htmlFor="import-groups" className="flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Groups
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="computers" id="import-computers" />
                    <Label htmlFor="import-computers" className="flex items-center">
                      <Monitor className="h-4 w-4 mr-2" />
                      Computers
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="import-all" />
                    <Label htmlFor="import-all">All objects</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {(importType === 'users' || importType === 'all') && (
                <>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Filter users by groups (optional)</Label>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {groups.map(group => (
                        <div key={group.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`group-${group.id}`} 
                            checked={selectedGroups.includes(group.id)}
                            onCheckedChange={() => handleGroupToggle(group.id)}
                          />
                          <Label htmlFor={`group-${group.id}`}>{group.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="include-disabled"
                      checked={includeDisabled}
                      onCheckedChange={(checked) => 
                        setIncludeDisabled(checked === true)
                      }
                    />
                    <Label htmlFor="include-disabled">Include disabled accounts</Label>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          {/* Microsoft 365 Tab */}
          <TabsContent value="m365" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="m365-client">Client Organization</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger id="m365-client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>What do you want to import?</Label>
                <RadioGroup value={importType} onValueChange={setImportType} className="pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="users" id="m365-import-users" />
                    <Label htmlFor="m365-import-users" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Users
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="licenses" id="m365-import-licenses" />
                    <Label htmlFor="m365-import-licenses" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Licenses
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="m365-import-all" />
                    <Label htmlFor="m365-import-all">All objects</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {(importType === 'users' || importType === 'all') && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="m365-include-disabled"
                    checked={includeDisabled}
                    onCheckedChange={(checked) => 
                      setIncludeDisabled(checked === true)
                    }
                  />
                  <Label htmlFor="m365-include-disabled">Include disabled accounts</Label>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={isImporting || 
              (activeTab === 'ad' && !selectedServer) || 
              !selectedClient}
          >
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportADUsersModal;
