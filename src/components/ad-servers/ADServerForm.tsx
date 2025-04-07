
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Server, Key, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ADServer } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, { message: "Server name must be at least 2 characters" }),
  domain: z.string().min(3, { message: "Domain name is required" }),
  server: z.string().min(3, { message: "Server address is required" }),
  port: z.coerce.number().int().positive({ message: "Port must be a positive number" }),
  useSSL: z.boolean().default(true),
  username: z.string().min(3, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password is required and must be at least 6 characters" }),
});

interface ADServerFormProps {
  server?: ADServer;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

const ADServerForm: React.FC<ADServerFormProps> = ({ server, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: server ? {
      name: server.name,
      domain: server.domain,
      server: server.server,
      port: server.port,
      useSSL: server.useSSL,
      username: server.username,
      password: server.password,
    } : {
      name: '',
      domain: '',
      server: '',
      port: 389,
      useSSL: true,
      username: '',
      password: '',
    },
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          {server ? "Edit AD Server" : "Add AD Server"}
        </CardTitle>
        <CardDescription>
          Configure a connection to an Active Directory server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Primary Domain Controller" {...field} />
                    </FormControl>
                    <FormDescription>
                      A friendly name for this server connection
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The Active Directory domain name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Address</FormLabel>
                    <FormControl>
                      <Input placeholder="dc01.example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      IP address or hostname of the server
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Default: 389 (LDAP) or 636 (LDAPS)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="administrator@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Account with AD read/write permissions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="•••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password for the account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="useSSL"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Use SSL/TLS</FormLabel>
                    <FormDescription>
                      Enable secure LDAP connection (LDAPS)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Server
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ADServerForm;
