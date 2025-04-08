
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Shield, User, Users, Filter, Building, Calendar } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const importFormSchema = z.object({
  domainController: z.string().min(1, { message: 'Domain controller is required' }),
  importType: z.enum(['users', 'groups', 'computers', 'all']).default('users'),
  filter: z.string().optional(),
  organizationalUnit: z.string().optional(),
  includeDisabled: z.boolean().default(false),
  recursive: z.boolean().default(true),
  importLimit: z.string().optional(),
  targetGroup: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
});

type ImportADUsersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: z.infer<typeof importFormSchema>) => void;
  domainControllers: { id: string; name: string }[];
  groups: { id: string; name: string }[];
};

const ImportADUsersModal = ({
  open,
  onOpenChange,
  onImport,
  domainControllers,
  groups,
}: ImportADUsersModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ad");

  const form = useForm<z.infer<typeof importFormSchema>>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      domainController: domainControllers[0]?.id || '',
      importType: 'users',
      filter: '',
      organizationalUnit: '',
      includeDisabled: false,
      recursive: true,
      importLimit: '1000',
      targetGroup: '',
      createdAfter: '',
      createdBefore: '',
    },
  });

  const handleImport = async (data: z.infer<typeof importFormSchema>) => {
    setLoading(true);
    
    try {
      // In a real application, this would make an API call to your backend
      // to start the import process
      toast({
        title: 'Starting Import',
        description: `Beginning to import ${data.importType} from Active Directory...`,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onImport(data);
      form.reset();
      onOpenChange(false);
      
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${data.importType} from Active Directory.`,
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'An error occurred while importing items.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Directory Objects
          </DialogTitle>
          <DialogDescription>
            Import objects from your Active Directory or Microsoft 365 to manage them in this application
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="ad" className="flex-1">Active Directory</TabsTrigger>
            <TabsTrigger value="365" className="flex-1">Microsoft 365</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ad" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleImport)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="domainController"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Domain Controller</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a domain controller" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {domainControllers.map(dc => (
                              <SelectItem key={dc.id} value={dc.id}>
                                {dc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the domain controller to import from
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="importType"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Import Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select what to import" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="groups">Groups</SelectItem>
                            <SelectItem value="computers">Computers</SelectItem>
                            <SelectItem value="all">All Objects</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select what type of objects to import
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="organizationalUnit"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Organizational Unit (OU)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="e.g., OU=Users,DC=example,DC=com"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Import objects from a specific organizational unit (leave empty for all objects)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="filter"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>LDAP Filter (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="e.g., (&(objectClass=user)(memberOf=CN=Sales,OU=Groups,DC=example,DC=com))"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Specify an LDAP filter to narrow down the objects to import
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="col-span-full my-2" />
                  
                  <FormField
                    control={form.control}
                    name="includeDisabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Include Disabled Accounts</FormLabel>
                          <FormDescription>
                            Import disabled accounts from Active Directory
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Recursive Search</FormLabel>
                          <FormDescription>
                            Search in sub-OUs recursively
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="importLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Import Limit</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="1000"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Maximum number of objects to import (leave empty for no limit)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="targetGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Group (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {groups.map(group => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Add imported objects to this group
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="createdAfter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Created After (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="date"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Only import objects created after this date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="createdBefore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Created Before (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="date"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Only import objects created before this date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Importing..." : "Import Objects"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="365" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/30">
                <h3 className="font-medium mb-2">Microsoft 365 Import</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To import users from Microsoft 365, you need to configure the tenant settings first.
                  Go to the Microsoft 365 Integration page to set up the connection.
                </p>
                <Button 
                  onClick={() => {
                    onOpenChange(false);
                    window.location.href = "/microsoft365";
                  }}
                >
                  Configure Microsoft 365 Integration
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportADUsersModal;
