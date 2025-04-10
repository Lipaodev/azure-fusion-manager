
import { ADServer, EmailSettings } from '@/types';

// Simple in-memory database implementation for demonstration
// In a real application, this would connect to your actual database
class DatabaseService {
  private static instance: DatabaseService;
  private storage: Record<string, any> = {};

  private constructor() {
    // Initialize with localStorage data if available
    this.loadFromStorage();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Load data from localStorage for persistence between page refreshes
  private loadFromStorage() {
    try {
      const savedData = localStorage.getItem('azuread_manager_data');
      if (savedData) {
        this.storage = JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }

  // Save data to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('azuread_manager_data', JSON.stringify(this.storage));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }

  // Generic methods for CRUD operations
  public getCollection<T>(collection: string): T[] {
    if (!this.storage[collection]) {
      this.storage[collection] = [];
    }
    return this.storage[collection];
  }

  public getItem<T>(collection: string, id: string): T | undefined {
    const items = this.getCollection<T>(collection);
    return (items as any[]).find(item => item.id === id);
  }

  public addItem<T>(collection: string, item: T): T {
    const items = this.getCollection<T>(collection);
    (items as any[]).push(item);
    this.storage[collection] = items;
    this.saveToStorage();
    return item;
  }

  public updateItem<T>(collection: string, id: string, item: T): T {
    const items = this.getCollection<T>(collection);
    const index = (items as any[]).findIndex(i => i.id === id);
    if (index !== -1) {
      (items as any[])[index] = { ...item };
      this.storage[collection] = items;
      this.saveToStorage();
    }
    return item;
  }

  public deleteItem(collection: string, id: string): boolean {
    const items = this.getCollection(collection);
    const index = (items as any[]).findIndex(i => i.id === id);
    if (index !== -1) {
      (items as any[]).splice(index, 1);
      this.storage[collection] = items;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Specific methods for AD servers
  public getAllADServers(): ADServer[] {
    return this.getCollection<ADServer>('adServers');
  }

  public addADServer(server: ADServer): ADServer {
    return this.addItem<ADServer>('adServers', server);
  }

  public updateADServer(id: string, server: ADServer): ADServer {
    return this.updateItem<ADServer>('adServers', id, server);
  }

  public deleteADServer(id: string): boolean {
    return this.deleteItem('adServers', id);
  }

  // Specific methods for clients
  public getAllClients(): {id: string, name: string}[] {
    return this.getCollection<{id: string, name: string}>('clients');
  }

  public addClient(client: {id: string, name: string}): {id: string, name: string} {
    return this.addItem<{id: string, name: string}>('clients', client);
  }

  // Specific methods for email settings
  public getEmailSettings(): EmailSettings {
    if (!this.storage['emailSettings']) {
      // Return default settings if none exist
      const defaultSettings: EmailSettings = {
        smtpServer: '',
        port: 25,
        useSsl: false,
        username: '',
        password: '',
        defaultSender: '',
        fromAddress: '',
        enabled: false,
      };
      this.storage['emailSettings'] = defaultSettings;
      this.saveToStorage();
    }
    return this.storage['emailSettings'];
  }

  public updateEmailSettings(settings: EmailSettings): EmailSettings {
    this.storage['emailSettings'] = settings;
    this.saveToStorage();
    return settings;
  }

  // Method to test AD connection (simulated)
  public async testADConnection(server: ADServer): Promise<boolean> {
    // In a real application, this would actually test the connection
    // For demonstration, we'll simulate a 70% success rate
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.3;
        
        if (success) {
          // Update server connection status
          server.isConnected = true;
          server.lastConnectionTime = new Date();
          if (server.id) {
            this.updateADServer(server.id, server);
          }
        } else {
          server.isConnected = false;
          server.lastConnectionTime = new Date();
          if (server.id) {
            this.updateADServer(server.id, server);
          }
        }
        
        resolve(success);
      }, 1000);
    });
  }
}

export const db = DatabaseService.getInstance();
