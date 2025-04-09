
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Briefcase, 
  Phone, 
  Building, 
  CreditCard, 
  Shield, 
  UserPlus
} from 'lucide-react';
import { ADGroup, ADUser, ADServer } from '@/types';

interface ADUserFormProps {
  user?: ADUser;
  groups: ADGroup[];
  servers?: ADServer[];
  clients?: {id: string, name: string}[];
  licenses?: {id: string, name: string}[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ADUserForm = ({ 
  user, 
  groups, 
  licenses = [], 
  servers = [],
  clients = [],
  onSubmit, 
  onCancel 
}: ADUserFormProps) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    username: user?.username || '',
    email: user?.email || '',
    jobTitle: user?.jobTitle || '',
    department: user?.department || '',
    phoneNumber: user?.phoneNumber || '',
    isEnabled: user?.isEnabled !== undefined ? user.isEnabled : true,
    password: '',
    confirmPassword: '',
    passwordNeverExpires: false,
    changePasswordNextLogon: true,
    selectedGroups: user?.groups || [],
    selectedLicenses: user?.licenses || [],
    serverId: user?.serverId || (servers.length > 0 ? servers[0].id : ''),
    clientId: user?.clientId || (clients.length > 0 ? clients[0].id : ''),
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    // Only validate password fields for new users
    if (!user) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit data
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGroupToggle = (groupName: string) => {
    setFormData(prev => {
      const groups = [...prev.selectedGroups];
      
      if (groups.includes(groupName)) {
        return {
          ...prev,
          selectedGroups: groups.filter(g => g !== groupName)
        };
      } else {
        return {
          ...prev,
          selectedGroups: [...groups, groupName]
        };
      }
    });
  };

  const handleLicenseToggle = (licenseId: string) => {
    setFormData(prev => {
      const currentLicenses = [...prev.selectedLicenses];
      
      if (currentLicenses.includes(licenseId)) {
        return {
          ...prev,
          selectedLicenses: currentLicenses.filter(l => l !== licenseId)
        };
      } else {
        return {
          ...prev,
          selectedLicenses: [...currentLicenses, licenseId]
        };
      }
    });
  };

  const filteredServers = servers.filter(server => 
    formData.clientId ? server.clientId === formData.clientId : true
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4 py-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select 
                value={formData.clientId} 
                onValueChange={(value) => handleSelectChange('clientId', value)}
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select Client" />
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
              <Label htmlFor="serverId">Active Directory Server</Label>
              <Select 
                value={formData.serverId} 
                onValueChange={(value) => handleSelectChange('serverId', value)}
              >
                <SelectTrigger id="serverId">
                  <SelectValue placeholder="Select AD Server" />
                </SelectTrigger>
                <SelectContent>
                  {filteredServers.length > 0 ? (
                    filteredServers.map(server => (
                      <SelectItem key={server.id} value={server.id}>
                        {server.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No servers available for this client
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {filteredServers.length === 0 && (
                <p className="text-sm text-destructive mt-2">
                  Please add an AD server for this client first
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="John"
                />
              </div>
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName || `${formData.firstName} ${formData.lastName}`}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="john.doe@example.com"
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="Software Developer"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Building className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="IT"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4 py-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserPlus className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="jdoe"
                />
              </div>
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>
            
            <div className="flex items-center justify-end space-x-2 h-full">
              <Label htmlFor="isEnabled" className="flex-grow">Account Enabled</Label>
              <Switch
                id="isEnabled"
                name="isEnabled"
                checked={formData.isEnabled}
                onCheckedChange={(checked) => handleSelectChange('isEnabled', checked)}
              />
            </div>
            
            {!user && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Shield className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-8"
                    />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Shield className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-8"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              </>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Password Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="passwordNeverExpires"
                name="passwordNeverExpires"
                checked={formData.passwordNeverExpires}
                onCheckedChange={(checked) => 
                  handleSelectChange('passwordNeverExpires', checked === true)
                }
              />
              <Label htmlFor="passwordNeverExpires">Password never expires</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="changePasswordNextLogon"
                name="changePasswordNextLogon"
                checked={formData.changePasswordNextLogon}
                onCheckedChange={(checked) => 
                  handleSelectChange('changePasswordNextLogon', checked === true)
                }
              />
              <Label htmlFor="changePasswordNextLogon">User must change password at next logon</Label>
            </div>
          </div>
        </TabsContent>
        
        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4 py-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {groups.map((group) => (
              <div key={group.id} className="flex items-start space-x-2 p-2 border rounded-md">
                <Checkbox
                  id={`group-${group.id}`}
                  checked={formData.selectedGroups.includes(group.name)}
                  onCheckedChange={() => handleGroupToggle(group.name)}
                />
                <div>
                  <Label
                    htmlFor={`group-${group.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {group.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {group.description || `${group.members} members`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-4 py-4">
          <div className="grid gap-4 grid-cols-1">
            {licenses.length > 0 ? (
              licenses.map((license) => (
                <div key={license.id} className="flex items-start space-x-2 p-2 border rounded-md">
                  <Checkbox
                    id={`license-${license.id}`}
                    checked={formData.selectedLicenses.includes(license.id)}
                    onCheckedChange={() => handleLicenseToggle(license.id)}
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <Label
                      htmlFor={`license-${license.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {license.name}
                    </Label>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No Microsoft 365 licenses available.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default ADUserForm;
