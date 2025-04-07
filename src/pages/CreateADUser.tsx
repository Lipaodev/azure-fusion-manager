
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ADUserForm from '@/components/ad-users/ADUserForm';
import { ADGroup } from '@/types';

// Mock data for AD groups
const mockGroups: ADGroup[] = [
  {
    id: 'g1',
    name: 'Domain Users',
    description: 'All domain users',
    members: 150,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 1, 1),
    lastModified: new Date(2023, 10, 10),
  },
  {
    id: 'g2',
    name: 'Developers',
    description: 'Software development team',
    members: 25,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 2, 15),
    lastModified: new Date(2023, 9, 5),
  },
  {
    id: 'g3',
    name: 'Marketing',
    description: 'Marketing department',
    members: 15,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 3, 10),
    lastModified: new Date(2023, 8, 20),
  },
  {
    id: 'g4',
    name: 'HR Team',
    description: 'Human Resources team',
    members: 8,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 4, 5),
    lastModified: new Date(2023, 7, 15),
  },
  {
    id: 'g5',
    name: 'Finance',
    description: 'Finance department',
    members: 12,
    category: 'Security',
    scope: 'Global',
    createdAt: new Date(2022, 5, 20),
    lastModified: new Date(2023, 10, 10),
  },
];

// Mock license data
const mockLicenses = [
  { id: 'l1', name: 'Microsoft 365 Business Basic' },
  { id: 'l2', name: 'Microsoft 365 Business Standard' },
  { id: 'l3', name: 'Microsoft 365 Business Premium' },
  { id: 'l4', name: 'Office 365 E3' },
  { id: 'l5', name: 'Office 365 E5' },
];

const CreateADUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateUser = (data: any) => {
    // In a real application, this would send the data to the server
    console.log('Creating user with data:', data);
    
    toast({
      title: "User Created",
      description: `${data.displayName} has been created successfully.`,
    });
    
    // Redirect to the users list page
    navigate('/ad-users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">Create AD User</h1>
      </div>
      
      <ADUserForm 
        groups={mockGroups}
        licenses={mockLicenses}
        onSubmit={handleCreateUser}
        onCancel={() => navigate('/ad-users')}
      />
    </div>
  );
};

export default CreateADUser;
