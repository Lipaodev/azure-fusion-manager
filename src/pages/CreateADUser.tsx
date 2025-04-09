
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ADUserForm from '@/components/ad-users/ADUserForm';
import { ADGroup, ADServer } from '@/types';

const CreateADUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<ADGroup[]>([]);
  const [servers, setServers] = useState<ADServer[]>([]);
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);
  const [licenses, setLicenses] = useState<{id: string, name: string}[]>([]);

  // Load mock data for demo purposes
  // In a real application, these would come from API calls
  useEffect(() => {
    setGroups([
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
    ]);

    setLicenses([
      { id: 'l1', name: 'Microsoft 365 Business Basic' },
      { id: 'l2', name: 'Microsoft 365 Business Standard' },
      { id: 'l3', name: 'Microsoft 365 Business Premium' },
      { id: 'l4', name: 'Office 365 E3' },
      { id: 'l5', name: 'Office 365 E5' },
    ]);

    setClients([
      { id: 'client1', name: 'Client 1' },
      { id: 'client2', name: 'Client 2' },
      { id: 'client3', name: 'Client 3' },
    ]);

    // Mock servers with client affiliations
    setServers([
      {
        id: 'server1',
        name: 'DC-01',
        domain: 'client1.local',
        server: 'dc01.client1.local',
        port: 389,
        useSSL: false,
        username: 'admin',
        password: '********',
        clientId: 'client1',
        clientName: 'Client 1',
        isConnected: true,
        lastConnectionTime: new Date(),
      },
      {
        id: 'server2',
        name: 'DC-02',
        domain: 'client2.local',
        server: 'dc01.client2.local',
        port: 389,
        useSSL: false,
        username: 'admin',
        password: '********',
        clientId: 'client2',
        clientName: 'Client 2',
        isConnected: true,
        lastConnectionTime: new Date(),
      },
    ]);
  }, []);

  const handleCreateUser = (data: any) => {
    console.log('Creating user with data:', data);
    
    toast({
      title: "User Created",
      description: `${data.displayName} has been created successfully.`,
    });
    
    // Here you would save this data to your database
    
    // Redirect to the users list page
    navigate('/ad-users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">Create AD User</h1>
      </div>
      
      <ADUserForm 
        groups={groups}
        servers={servers}
        clients={clients}
        licenses={licenses}
        onSubmit={handleCreateUser}
        onCancel={() => navigate('/ad-users')}
      />
    </div>
  );
};

export default CreateADUser;
