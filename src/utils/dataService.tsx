import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-724a4c6b`;

export interface User {
  id: string;
  email: string;
  name: string;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: number | string;
  title: string;
  description: string;
  listId: number;
  dueDate: Date;
  startTime: string;
  duration: number; // in minutes
  isFixed: boolean;
  completed: boolean;
  important: boolean;
  notes: string;
  subtasks?: Array<{
    id: number;
    title: string;
    completed: boolean;
  }>;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskList {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

class DataService {
  private accessToken: string | null = null;
  private user: User | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Load cached user data
    this.loadCachedData();
  }

  private loadCachedData() {
    try {
      const cachedUser = localStorage.getItem('taskmaster_user');
      const cachedToken = localStorage.getItem('taskmaster_token');
      
      if (cachedUser && cachedToken) {
        this.user = JSON.parse(cachedUser);
        this.accessToken = cachedToken;
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  }

  private saveToCache(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  private getFromCache(key: string) {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (!this.isOnline) {
        throw new Error('You are offline. Please check your connection.');
      }
      throw error;
    }
  }

  // Authentication methods
  async signUp(email: string, password: string, name: string): Promise<User> {
    const response = await this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    this.user = response.user;
    this.saveToCache('taskmaster_user', this.user);
    
    return response.user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const response = await this.makeRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.user = response.user;
    this.accessToken = response.access_token;
    
    this.saveToCache('taskmaster_user', this.user);
    this.saveToCache('taskmaster_token', this.accessToken);
    
    return response.user;
  }

  signOut() {
    this.user = null;
    this.accessToken = null;
    localStorage.removeItem('taskmaster_user');
    localStorage.removeItem('taskmaster_token');
    localStorage.removeItem('taskmaster_tasks');
    localStorage.removeItem('taskmaster_last_sync');
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  // User profile methods
  async updateProfile(updates: Partial<User>): Promise<User> {
    if (this.isOnline) {
      const response = await this.makeRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      this.user = response.user;
      this.saveToCache('taskmaster_user', this.user);
      
      return response.user;
    } else {
      // Update local cache
      this.user = { ...this.user!, ...updates };
      this.saveToCache('taskmaster_user', this.user);
      
      // Mark for sync when online
      const pendingUpdates = this.getFromCache('taskmaster_pending_profile_updates') || {};
      this.saveToCache('taskmaster_pending_profile_updates', { ...pendingUpdates, ...updates });
      
      return this.user;
    }
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    if (this.isOnline) {
      try {
        const response = await this.makeRequest('/tasks');
        const tasks = response.tasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
        }));
        
        this.saveToCache('taskmaster_tasks', tasks);
        this.saveToCache('taskmaster_last_sync', Date.now());
        
        return tasks;
      } catch (error) {
        console.error('Error fetching tasks online:', error);
        // Fall back to cached data
        return this.getCachedTasks();
      }
    } else {
      return this.getCachedTasks();
    }
  }

  private getCachedTasks(): Task[] {
    const cached = this.getFromCache('taskmaster_tasks');
    if (cached) {
      return cached.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
    }
    return [];
  }

  async createTask(task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    if (this.isOnline) {
      try {
        const response = await this.makeRequest('/tasks', {
          method: 'POST',
          body: JSON.stringify({
            ...task,
            dueDate: task.dueDate.toISOString(),
          }),
        });
        
        const newTask = {
          ...response.task,
          dueDate: new Date(response.task.dueDate),
        };
        
        // Update local cache
        const cachedTasks = this.getCachedTasks();
        cachedTasks.push(newTask);
        this.saveToCache('taskmaster_tasks', cachedTasks);
        
        return newTask;
      } catch (error) {
        console.error('Error creating task online:', error);
        // Fall back to local creation
        return this.createTaskOffline(task);
      }
    } else {
      return this.createTaskOffline(task);
    }
  }

  private createTaskOffline(task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: `offline_${Date.now()}`,
      userId: this.user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const cachedTasks = this.getCachedTasks();
    cachedTasks.push(newTask);
    this.saveToCache('taskmaster_tasks', cachedTasks);
    
    // Mark for sync when online
    const pendingCreates = this.getFromCache('taskmaster_pending_creates') || [];
    pendingCreates.push(newTask);
    this.saveToCache('taskmaster_pending_creates', pendingCreates);
    
    return newTask;
  }

  async updateTask(id: string | number, updates: Partial<Task>): Promise<Task> {
    if (this.isOnline && !String(id).startsWith('offline_')) {
      try {
        const response = await this.makeRequest(`/tasks/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...updates,
            dueDate: updates.dueDate ? updates.dueDate.toISOString() : undefined,
          }),
        });
        
        const updatedTask = {
          ...response.task,
          dueDate: new Date(response.task.dueDate),
        };
        
        // Update local cache
        const cachedTasks = this.getCachedTasks();
        const index = cachedTasks.findIndex(task => task.id === id);
        if (index !== -1) {
          cachedTasks[index] = updatedTask;
          this.saveToCache('taskmaster_tasks', cachedTasks);
        }
        
        return updatedTask;
      } catch (error) {
        console.error('Error updating task online:', error);
        // Fall back to local update
        return this.updateTaskOffline(id, updates);
      }
    } else {
      return this.updateTaskOffline(id, updates);
    }
  }

  private updateTaskOffline(id: string | number, updates: Partial<Task>): Task {
    const cachedTasks = this.getCachedTasks();
    const index = cachedTasks.findIndex(task => task.id === id);
    
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...cachedTasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    cachedTasks[index] = updatedTask;
    this.saveToCache('taskmaster_tasks', cachedTasks);
    
    // Mark for sync when online
    if (!String(id).startsWith('offline_')) {
      const pendingUpdates = this.getFromCache('taskmaster_pending_updates') || {};
      pendingUpdates[id] = { ...(pendingUpdates[id] || {}), ...updates };
      this.saveToCache('taskmaster_pending_updates', pendingUpdates);
    }
    
    return updatedTask;
  }

  async deleteTask(id: string | number): Promise<void> {
    if (this.isOnline && !String(id).startsWith('offline_')) {
      try {
        await this.makeRequest(`/tasks/${id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting task online:', error);
      }
    }
    
    // Always remove from local cache
    const cachedTasks = this.getCachedTasks();
    const filteredTasks = cachedTasks.filter(task => task.id !== id);
    this.saveToCache('taskmaster_tasks', filteredTasks);
    
    // Mark for sync when online
    if (!String(id).startsWith('offline_')) {
      const pendingDeletes = this.getFromCache('taskmaster_pending_deletes') || [];
      pendingDeletes.push(id);
      this.saveToCache('taskmaster_pending_deletes', pendingDeletes);
    }
  }

  // Sync methods
  async syncData(): Promise<void> {
    if (!this.isOnline || !this.isAuthenticated()) {
      return;
    }

    try {
      // Sync profile updates
      const pendingProfileUpdates = this.getFromCache('taskmaster_pending_profile_updates');
      if (pendingProfileUpdates) {
        await this.makeRequest('/user/profile', {
          method: 'PUT',
          body: JSON.stringify(pendingProfileUpdates),
        });
        localStorage.removeItem('taskmaster_pending_profile_updates');
      }

      // Sync task creations
      const pendingCreates = this.getFromCache('taskmaster_pending_creates') || [];
      for (const task of pendingCreates) {
        try {
          await this.makeRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify({
              ...task,
              dueDate: task.dueDate.toISOString(),
            }),
          });
        } catch (error) {
          console.error('Error syncing task creation:', error);
        }
      }
      if (pendingCreates.length > 0) {
        localStorage.removeItem('taskmaster_pending_creates');
      }

      // Sync task updates
      const pendingUpdates = this.getFromCache('taskmaster_pending_updates') || {};
      for (const [taskId, updates] of Object.entries(pendingUpdates)) {
        try {
          await this.makeRequest(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
          });
        } catch (error) {
          console.error('Error syncing task update:', error);
        }
      }
      if (Object.keys(pendingUpdates).length > 0) {
        localStorage.removeItem('taskmaster_pending_updates');
      }

      // Sync task deletions
      const pendingDeletes = this.getFromCache('taskmaster_pending_deletes') || [];
      for (const taskId of pendingDeletes) {
        try {
          await this.makeRequest(`/tasks/${taskId}`, {
            method: 'DELETE',
          });
        } catch (error) {
          console.error('Error syncing task deletion:', error);
        }
      }
      if (pendingDeletes.length > 0) {
        localStorage.removeItem('taskmaster_pending_deletes');
      }

      // Fetch latest data
      await this.getTasks();
      
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }

  getLastSyncTime(): Date | null {
    const lastSync = this.getFromCache('taskmaster_last_sync');
    return lastSync ? new Date(lastSync) : null;
  }

  hasPendingChanges(): boolean {
    return !!(
      this.getFromCache('taskmaster_pending_profile_updates') ||
      this.getFromCache('taskmaster_pending_creates')?.length ||
      Object.keys(this.getFromCache('taskmaster_pending_updates') || {}).length ||
      this.getFromCache('taskmaster_pending_deletes')?.length
    );
  }
}

export const dataService = new DataService();