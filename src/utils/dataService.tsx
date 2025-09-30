import { projectId, publicAnonKey } from './supabase/info';
import { supabase } from './supabase/client';

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
  startDate?: Date; // 添加startDate字段作为可选字段
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
  icon: string;
  color: string;
  description: string;
}

class DataService {
  private accessToken: string | null = null;
  private user: User | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    console.log('DataService: New instance created');
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
    
    // 监听Supabase认证状态变化
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (session) {
        this.accessToken = session.access_token;
        this.user = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || '',
          onboarding_completed: session.user.user_metadata?.onboarding_completed || false
        };
        
        // 保存到缓存
        this.saveToCache('taskmaster_user', this.user);
        this.saveToCache('taskmaster_token', this.accessToken);
      } else {
        this.accessToken = null;
        this.user = null;
        // 清理缓存
        localStorage.removeItem('taskmaster_user');
        localStorage.removeItem('taskmaster_token');
      }
    });
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

    // 使用onAuthStateChange中保存的token，避免重复调用getCurrentSession
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
        
        // 特别处理401错误
        if (response.status === 401) {
          console.warn(`401 Unauthorized for ${endpoint}: Token may be invalid or expired`);
          throw new Error(`HTTP 401 - Unauthorized (${errorData.error || 'Token invalid'})`);
        }
        
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          onboarding_completed: false
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('注册失败：未获取到用户信息');
    }

    // 返回用户信息
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: name,
      onboarding_completed: false
    };
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error('登录失败：未获取到用户信息');
    }

    // 返回用户信息（onAuthStateChange会自动处理session和token）
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.name || data.user.email || '',
      onboarding_completed: data.user.user_metadata?.onboarding_completed || false
    };
  }

  async signOut() {
    await supabase.auth.signOut();
    // onAuthStateChange会自动清理状态和缓存
    localStorage.removeItem('taskmaster_tasks');
    localStorage.removeItem('taskmaster_last_sync');
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    // 使用Supabase session而不是旧的token检查
    return this.user !== null;
  }

  // 获取当前Session
  async getCurrentSession() {
    try {
      console.log('getCurrentSession: Calling supabase.auth.getSession()...');
      
      // 添加超时保护
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('getSession timeout')), 5000);
      });
      
      const sessionPromise = supabase.auth.getSession();
      
      const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
      const { data: { session }, error } = result;
      
      console.log('getCurrentSession: Result - session:', session ? 'exists' : 'null', 'error:', error);
      
      if (error) {
        console.error('getCurrentSession: Error getting session:', error);
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('getCurrentSession: Exception:', error);
      return null;
    }
  }

  // 验证当前认证状态
  async validateAuth(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      return session !== null && session.expires_at ? new Date(session.expires_at * 1000) > new Date() : false;
    } catch (error) {
      console.error('Error validating auth:', error);
      return false;
    }
  }

  // User profile methods
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      console.log('updateProfile: Updating with Supabase...', updates);
      
      // 使用Supabase更新用户元数据
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...updates // 将更新内容保存到user_metadata中
        }
      });
      
      if (error) {
        console.error('updateProfile: Supabase error:', error);
        throw error;
      }
      
      console.log('updateProfile: Supabase success:', data);
      
      // 更新本地用户信息
      if (this.user) {
        this.user = { ...this.user, ...updates };
        this.saveToCache('taskmaster_user', this.user);
      }
      
      return this.user!;
    } catch (error) {
      console.error('updateProfile: Error with Supabase:', error);
      
      // 回退到本地更新
      if (this.user) {
        this.user = { ...this.user, ...updates };
        this.saveToCache('taskmaster_user', this.user);
        
        // 标记为待同步
        const pendingUpdates = this.getFromCache('taskmaster_pending_profile_updates') || {};
        this.saveToCache('taskmaster_pending_profile_updates', { ...pendingUpdates, ...updates });
      }
      
      return this.user!;
    }
  }

  // Task methods - 使用Supabase标准数据库操作
  async getTasks(): Promise<Task[]> {
    console.log('getTasks: Starting with Supabase database...');
    console.log('getTasks: User ID:', this.user?.id);
    console.log('getTasks: Is authenticated:', this.isAuthenticated());
    
    try {
      // 添加超时保护 - 2秒超时，提供更快的用户体验
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('getTasks timeout after 2 seconds')), 2000);
      });
      
      const queryPromise = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('getTasks: Executing Supabase query...');
      const result = await Promise.race([queryPromise, timeoutPromise]);
      const { data, error } = result as any;
      
      if (error) {
        console.error('getTasks: Supabase error:', error);
        throw error;
      }
      
      console.log('getTasks: Supabase success, got', data?.length || 0, 'tasks');
      
      const serverTasks = (data || []).map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        listId: task.list_id,
        dueDate: new Date(task.due_date),
        startTime: task.start_time || '',
        startDate: task.start_date ? new Date(task.start_date) : undefined,
        duration: task.duration || 60,
        isFixed: task.is_fixed || false,
        completed: task.completed || false,
        important: task.important || false,
        notes: task.notes || '',
        subtasks: task.subtasks || [],
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }));
      
      // 智能合并：保护本地离线更改
      const mergedTasks = this.mergeTasksWithOfflineChanges(serverTasks);
      
      // 保存合并后的数据到缓存
      this.saveToCache('taskmaster_tasks', mergedTasks);
      this.saveToCache('taskmaster_last_sync', Date.now());
      
      return mergedTasks;
    } catch (error) {
      console.error('getTasks: Error with Supabase:', error);
      
      // 如果是超时错误或RLS错误，回退到缓存数据
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          console.warn('getTasks: Query timeout, using cached data');
        } else if (error.message.includes('row-level security')) {
          console.warn('getTasks: RLS policy issue, check database permissions');
        }
      }
      
      // 回退到缓存数据
      const cachedTasks = this.getCachedTasks();
      console.log('getTasks: Using cached data, count:', cachedTasks.length);
      return cachedTasks;
    }
  }
  
  // 智能合并服务器数据和本地离线更改
  private mergeTasksWithOfflineChanges(serverTasks: Task[]): Task[] {
    const cachedTasks = this.getCachedTasks();
    const pendingUpdates = this.getFromCache('taskmaster_pending_updates') || {};
    const pendingCreates = this.getFromCache('taskmaster_pending_creates') || [];
    
    console.log('mergeTasksWithOfflineChanges: Merging data...');
    console.log('- Server tasks:', serverTasks.length);
    console.log('- Pending updates:', Object.keys(pendingUpdates).length);
    console.log('- Pending creates:', pendingCreates.length);
    
    // 从服务器任务开始
    let mergedTasks = [...serverTasks];
    
    // 应用本地待同步的更新
    Object.entries(pendingUpdates).forEach(([taskId, updates]) => {
      const index = mergedTasks.findIndex(task => task.id.toString() === taskId);
      if (index !== -1 && updates && typeof updates === 'object') {
        console.log(`mergeTasksWithOfflineChanges: Applying local update to task ${taskId}`);
        mergedTasks[index] = {
          ...mergedTasks[index],
          ...(updates as Partial<Task>),
          updatedAt: new Date().toISOString() // 标记为本地更新
        };
      }
    });
    
    // 添加本地创建的离线任务
    pendingCreates.forEach((offlineTask: Task) => {
      console.log(`mergeTasksWithOfflineChanges: Adding offline task ${offlineTask.id}`);
      mergedTasks.push(offlineTask);
    });
    
    console.log('mergeTasksWithOfflineChanges: Final merged count:', mergedTasks.length);
    return mergedTasks;
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
    console.log('createTask: Starting task creation with Supabase...', task.title);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description || '',
          list_id: task.listId,
          due_date: task.dueDate.toISOString(),
          start_time: task.startTime || '',
          start_date: task.startDate ? task.startDate.toISOString() : null,
          duration: task.duration,
          is_fixed: task.isFixed,
          completed: task.completed,
          important: task.important,
          notes: task.notes || '',
          subtasks: task.subtasks || [],
          user_id: this.user?.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('createTask: Supabase error:', error);
        throw error;
      }
      
      console.log('createTask: Supabase success:', data);
      
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        listId: data.list_id,
        dueDate: new Date(data.due_date),
        startTime: data.start_time || '',
        startDate: data.start_date ? new Date(data.start_date) : undefined,
        duration: data.duration,
        isFixed: data.is_fixed,
        completed: data.completed,
        important: data.important,
        notes: data.notes || '',
        subtasks: data.subtasks || [],
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      // 更新本地缓存
      const cachedTasks = this.getCachedTasks();
      cachedTasks.push(newTask);
      this.saveToCache('taskmaster_tasks', cachedTasks);
      console.log('createTask: Updated local cache with new task');
      
      return newTask;
    } catch (error) {
      console.error('createTask: Error with Supabase:', error);
      // 回退到离线创建
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
    try {
      // 如果是离线任务，直接本地更新
      if (String(id).startsWith('offline_')) {
        return this.updateTaskOffline(id, updates);
      }
      
      // 尝试使用Supabase更新
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.listId !== undefined) updateData.list_id = updates.listId;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate.toISOString();
      if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
      if (updates.startDate !== undefined) updateData.start_date = updates.startDate?.toISOString();
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      if (updates.isFixed !== undefined) updateData.is_fixed = updates.isFixed;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.important !== undefined) updateData.important = updates.important;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.subtasks !== undefined) updateData.subtasks = updates.subtasks;
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('updateTask: Supabase error:', error);
        throw error;
      }
      
      console.log('updateTask: Supabase success:', data);
      
      const updatedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        listId: data.list_id,
        dueDate: new Date(data.due_date),
        startTime: data.start_time || '',
        startDate: data.start_date ? new Date(data.start_date) : undefined,
        duration: data.duration,
        isFixed: data.is_fixed,
        completed: data.completed,
        important: data.important,
        notes: data.notes || '',
        subtasks: data.subtasks || [],
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      // 更新本地缓存
      const cachedTasks = this.getCachedTasks();
      const index = cachedTasks.findIndex(task => task.id === id);
      if (index !== -1) {
        cachedTasks[index] = updatedTask;
        this.saveToCache('taskmaster_tasks', cachedTasks);
      }
      
      return updatedTask;
    } catch (error) {
      console.error('updateTask: Error with Supabase:', error);
      // 回退到本地更新
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