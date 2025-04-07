
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, User, Save, CalendarIcon, X } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ADUser, ADGroup } from '@/types';
import { format } from 'date-fns';

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  displayName: z.string().optional(),
  email: z.string().email({ message: "Valid email address is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  isEnabled: z.boolean().default(true),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  phoneNumber: z.string().optional(),
  accountExpires: z.date().optional(),
  groups: z.array(z.string()).optional(),
  createO365: z.boolean().default(false),
  assignLicenses: z.array(z.string()).optional(),
});

interface ADUserFormProps {
  user?: ADUser;
  groups: ADGroup[];
  licenses?: { id: string; name: string }[];
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

const ADUserForm: React.FC<ADUserFormProps> = ({ 
  user, 
  groups, 
  licenses = [], 
  onSubmit, 
  onCancel 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema.refine(data => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })),
    defaultValues: user ? {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      password: "",
      confirmPassword: "",
      isEnabled: user.isEnabled,
      jobTitle: user.jobTitle || "",
      department: user.department || "",
      phoneNumber: user.phoneNumber || "",
      accountExpires: user.accountExpires,
      groups: user.groups,
      createO365: false,
      assignLicenses: [],
    } : {
      username: '',
      firstName: '',
      lastName: '',
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isEnabled: true,
      jobTitle: '',
      department: '',
      phoneNumber: '',
      accountExpires: undefined,
      groups: [],
      createO365: false,
      assignLicenses: [],
    },
  });

  const watchFirstName = form.watch('firstName');
  const watchLastName = form.watch('lastName');
  
  React.useEffect(() => {
    if (watchFirstName && watchLastName) {
      form.setValue('displayName', `${watchFirstName} ${watchLastName}`);
    }
  }, [watchFirstName, watchLastName, form]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {user ? (
            <>
              <User className="h-5 w-5" />
              Edit AD User
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Create AD User
            </>
          )}
        </CardTitle>
        <CardDescription>
          {user 
            ? "Update an existing Active Directory user" 
            : "Create a new user in Active Directory"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="details">User Details</TabsTrigger>
                <TabsTrigger value="o365">Microsoft 365</TabsTrigger>
              </TabsList>
              
              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                          Auto-generated from first and last name
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
                          <Input placeholder="jdoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {!user && (
                    <>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="isEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Account Enabled</FormLabel>
                          <FormDescription>
                            Enable this account for login
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* User Details Tab */}
              <TabsContent value="details" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="IT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountExpires"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Account Expiration Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Never Expires</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Leave blank for no expiration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="groups"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Memberships</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                const currentGroups = field.value || [];
                                if (!currentGroups.includes(value)) {
                                  field.onChange([...currentGroups, value]);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select groups to add" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Available Groups</SelectLabel>
                                  {groups.map((group) => (
                                    <SelectItem key={group.id} value={group.id}>
                                      {group.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Add user to Active Directory groups
                          </FormDescription>
                          <FormMessage />
                          <div className="mt-2">
                            {field.value && field.value.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((groupId) => {
                                  const group = groups.find(g => g.id === groupId);
                                  return group ? (
                                    <Badge key={groupId} variant="secondary" className="flex items-center gap-1">
                                      {group.name}
                                      <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-4 w-4 p-0 ml-1"
                                        onClick={() => {
                                          field.onChange(field.value?.filter(id => id !== groupId));
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No groups selected</p>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Microsoft 365 Tab */}
              <TabsContent value="o365" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="createO365"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Create Microsoft 365 Account</FormLabel>
                        <FormDescription>
                          Also create a corresponding Microsoft 365 user in Azure AD
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch('createO365') && (
                  <FormField
                    control={form.control}
                    name="assignLicenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Licenses</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const currentLicenses = field.value || [];
                              if (!currentLicenses.includes(value)) {
                                field.onChange([...currentLicenses, value]);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select licenses to assign" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Available Licenses</SelectLabel>
                                {licenses.map((license) => (
                                  <SelectItem key={license.id} value={license.id}>
                                    {license.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Assign Microsoft 365 licenses to this user
                        </FormDescription>
                        <FormMessage />
                        <div className="mt-2">
                          {field.value && field.value.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((licenseId) => {
                                const license = licenses.find(l => l.id === licenseId);
                                return license ? (
                                  <Badge key={licenseId} variant="secondary" className="flex items-center gap-1">
                                    {license.name}
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-4 w-4 p-0 ml-1"
                                      onClick={() => {
                                        field.onChange(field.value?.filter(id => id !== licenseId));
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No licenses selected</p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {user ? "Update User" : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ADUserForm;
