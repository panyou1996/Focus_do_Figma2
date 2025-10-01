import { supabase } from './supabase/client';
import { 
  CheckinItem, 
  CheckinRecord, 
  CheckinBlog, 
  CheckinStats, 
  CheckinCalendarDay,
  CheckinService,
  BlogFilters,
  getStreakDays,
  getCompletionRate,
  CheckinCategory,
  CheckinMood
} from '../types/checkin';

class CheckinDataService implements CheckinService {
  private cache = {
    checkinItems: [] as CheckinItem[],
    checkinRecords: [] as CheckinRecord[],
    blogs: [] as CheckinBlog[],
    lastSyncTime: null as Date | null
  };

  private initialized = false;

  // 初始化服务（简化版）
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // 不再检查存储桶，简化初始化逻辑
      this.initialized = true;
      console.log('CheckinDataService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize CheckinDataService:', error);
      // 不抛出错误，允许应用继续运行
    }
  }

  // ================================
  // 打卡项目管理
  // ================================

  async getCheckinItems(): Promise<CheckinItem[]> {
    try {
      const { data, error } = await supabase
        .from('checkin_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checkin items:', error);
        throw error;
      }

      // 转换数据类型
      const items: CheckinItem[] = data.map(item => ({
        ...item,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }));

      this.cache.checkinItems = items;
      this.cache.lastSyncTime = new Date();
      
      return items;
    } catch (error) {
      console.error('Failed to fetch checkin items:', error);
      // 返回缓存数据作为回退
      return this.cache.checkinItems;
    }
  }

  async createCheckinItem(item: Omit<CheckinItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<CheckinItem> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('checkin_items')
        .insert({
          ...item,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating checkin item:', error);
        throw error;
      }

      const newItem: CheckinItem = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      // 更新缓存
      this.cache.checkinItems = [newItem, ...this.cache.checkinItems];
      
      return newItem;
    } catch (error) {
      console.error('Failed to create checkin item:', error);
      throw error;
    }
  }

  async updateCheckinItem(id: number | string, updates: Partial<CheckinItem>): Promise<CheckinItem> {
    try {
      const { data, error } = await supabase
        .from('checkin_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating checkin item:', error);
        throw error;
      }

      const updatedItem: CheckinItem = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      // 更新缓存
      const index = this.cache.checkinItems.findIndex(item => item.id === id);
      if (index !== -1) {
        this.cache.checkinItems[index] = updatedItem;
      }
      
      return updatedItem;
    } catch (error) {
      console.error('Failed to update checkin item:', error);
      throw error;
    }
  }

  async deleteCheckinItem(id: number | string): Promise<void> {
    try {
      const { error } = await supabase
        .from('checkin_items')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting checkin item:', error);
        throw error;
      }

      // 从缓存中移除
      this.cache.checkinItems = this.cache.checkinItems.filter(item => item.id !== id);
    } catch (error) {
      console.error('Failed to delete checkin item:', error);
      throw error;
    }
  }

  // ================================
  // 打卡记录管理
  // ================================

  async getCheckinRecords(itemId?: number | string, dateRange?: { start: Date; end: Date }): Promise<CheckinRecord[]> {
    try {
      let query = supabase
        .from('checkin_records')
        .select(`
          *,
          checkin_items!inner(title, icon, color, category)
        `)
        .order('checked_at', { ascending: false });

      if (itemId) {
        query = query.eq('checkin_item_id', itemId);
      }

      if (dateRange) {
        query = query
          .gte('checked_at', dateRange.start.toISOString())
          .lte('checked_at', dateRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching checkin records:', error);
        throw error;
      }

      const records: CheckinRecord[] = data.map(record => ({
        ...record,
        checked_at: new Date(record.checked_at),
        created_at: new Date(record.created_at)
      }));

      if (!itemId && !dateRange) {
        this.cache.checkinRecords = records;
      }
      
      return records;
    } catch (error) {
      console.error('Failed to fetch checkin records:', error);
      return itemId || dateRange ? [] : this.cache.checkinRecords;
    }
  }

  async createCheckinRecord(record: Omit<CheckinRecord, 'id' | 'created_at' | 'user_id'>): Promise<CheckinRecord> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('checkin_records')
        .insert({
          ...record,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating checkin record:', error);
        throw error;
      }

      const newRecord: CheckinRecord = {
        ...data,
        checked_at: new Date(data.checked_at),
        created_at: new Date(data.created_at)
      };

      // 更新缓存
      this.cache.checkinRecords = [newRecord, ...this.cache.checkinRecords];
      
      return newRecord;
    } catch (error) {
      console.error('Failed to create checkin record:', error);
      throw error;
    }
  }

  async updateCheckinRecord(id: number | string, updates: Partial<CheckinRecord>): Promise<CheckinRecord> {
    try {
      const { data, error } = await supabase
        .from('checkin_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating checkin record:', error);
        throw error;
      }

      const updatedRecord: CheckinRecord = {
        ...data,
        checked_at: new Date(data.checked_at),
        created_at: new Date(data.created_at)
      };

      // 更新缓存
      const index = this.cache.checkinRecords.findIndex(record => record.id === id);
      if (index !== -1) {
        this.cache.checkinRecords[index] = updatedRecord;
      }
      
      return updatedRecord;
    } catch (error) {
      console.error('Failed to update checkin record:', error);
      throw error;
    }
  }

  async deleteCheckinRecord(id: number | string): Promise<void> {
    try {
      const { error } = await supabase
        .from('checkin_records')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting checkin record:', error);
        throw error;
      }

      // 从缓存中移除
      this.cache.checkinRecords = this.cache.checkinRecords.filter(record => record.id !== id);
    } catch (error) {
      console.error('Failed to delete checkin record:', error);
      throw error;
    }
  }

  // ================================
  // 统计数据
  // ================================

  async getCheckinStats(timeRange?: { start: Date; end: Date }): Promise<CheckinStats> {
    try {
      const items = await this.getCheckinItems();
      const allRecords = await this.getCheckinRecords();
      
      const now = new Date();
      const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1); // 本月开始
      const defaultEnd = now;
      
      const start = timeRange?.start || defaultStart;
      const end = timeRange?.end || defaultEnd;
      
      const periodRecords = allRecords.filter(record => 
        record.checked_at >= start && record.checked_at <= end
      );

      // 今日打卡
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayRecords = allRecords.filter(record => 
        record.checked_at >= today && record.checked_at < tomorrow
      );

      // 本周打卡
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekRecords = allRecords.filter(record => 
        record.checked_at >= weekStart && record.checked_at <= now
      );

      // 本月打卡
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthRecords = allRecords.filter(record => 
        record.checked_at >= monthStart && record.checked_at <= now
      );

      // 连续天数
      const streakDays = getStreakDays(allRecords);

      // 最长连续天数（简化计算）
      const longestStreak = Math.max(streakDays, 0);

      // 完成率
      const completionRate = getCompletionRate(items, periodRecords, { start, end });

      // 最喜欢的分类
      const categoryCount: Record<CheckinCategory, number> = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<CheckinCategory, number>);
      
      const favoriteCategory = Object.entries(categoryCount).reduce((a, b) => 
        categoryCount[a[0] as CheckinCategory] > categoryCount[b[0] as CheckinCategory] ? a : b
      )[0] as CheckinCategory || 'other';

      // 心情分布
      const moodDistribution: Record<CheckinMood, number> = periodRecords.reduce((acc, record) => {
        if (record.mood) {
          acc[record.mood] = (acc[record.mood] || 0) + 1;
        }
        return acc;
      }, {} as Record<CheckinMood, number>);

      // Blog数量
      const blogs = await this.getBlogs();

      const stats: CheckinStats = {
        total_items: items.length,
        active_items: items.filter(item => item.is_active).length,
        total_records: allRecords.length,
        today_records: todayRecords.length,
        week_records: weekRecords.length,
        month_records: monthRecords.length,
        streak_days: streakDays,
        longest_streak: longestStreak,
        completion_rate: completionRate,
        favorite_category: favoriteCategory,
        total_blogs: blogs.length,
        mood_distribution: moodDistribution,
        category_distribution: categoryCount
      };

      return stats;
    } catch (error) {
      console.error('Failed to get checkin stats:', error);
      // 返回默认统计数据
      return {
        total_items: 0,
        active_items: 0,
        total_records: 0,
        today_records: 0,
        week_records: 0,
        month_records: 0,
        streak_days: 0,
        longest_streak: 0,
        completion_rate: 0,
        favorite_category: 'other',
        total_blogs: 0,
        mood_distribution: {} as Record<CheckinMood, number>,
        category_distribution: {} as Record<CheckinCategory, number>
      };
    }
  }

  async getCheckinCalendar(month: Date): Promise<CheckinCalendarDay[]> {
    try {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const records = await this.getCheckinRecords(undefined, {
        start: startOfMonth,
        end: endOfMonth
      });

      const calendar: CheckinCalendarDay[] = [];
      
      for (let day = 1; day <= endOfMonth.getDate(); day++) {
        const date = new Date(month.getFullYear(), month.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayRecords = records.filter(record => 
          record.checked_at.toISOString().split('T')[0] === dateStr
        );
        
        // 计算当日完成率（简化版）
        const items = await this.getCheckinItems();
        const dailyTargets = items.filter(item => item.target_type === 'daily').length;
        const completionRate = dailyTargets > 0 ? Math.round((dayRecords.length / dailyTargets) * 100) : 0;
        
        // 主要心情
        const moods = dayRecords.map(r => r.mood).filter(Boolean) as CheckinMood[];
        const mainMood = moods.length > 0 ? moods[0] : null;
        
        calendar.push({
          date: dateStr,
          records: dayRecords,
          completion_rate: Math.min(completionRate, 100),
          mood: mainMood
        });
      }
      
      return calendar;
    } catch (error) {
      console.error('Failed to get checkin calendar:', error);
      return [];
    }
  }

  // ================================
  // Blog管理
  // ================================

  async getBlogs(filters?: BlogFilters): Promise<CheckinBlog[]> {
    try {
      let query = supabase
        .from('checkin_blogs')
        .select('*');

      // 应用筛选器
      if (filters?.mood) {
        query = query.eq('mood', filters.mood);
      }
      
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      
      if (filters?.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.start.toISOString())
          .lte('created_at', filters.dateRange.end.toISOString());
      }
      
      // 排序
      const sortBy = filters?.sortBy || 'created_at';
      const sortOrder = filters?.sortOrder || 'desc';
      const ascending = sortOrder === 'asc';
      
      query = query.order(sortBy, { ascending });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blogs:', error);
        throw error;
      }

      const blogs: CheckinBlog[] = data.map(blog => ({
        ...blog,
        created_at: new Date(blog.created_at),
        updated_at: new Date(blog.updated_at)
      }));

      if (!filters) {
        this.cache.blogs = blogs;
      }
      
      return blogs;
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      return filters ? [] : this.cache.blogs;
    }
  }

  async getBlogById(id: number | string): Promise<CheckinBlog> {
    try {
      const { data, error } = await supabase
        .from('checkin_blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching blog:', error);
        throw error;
      }

      // 增加浏览量
      await supabase
        .from('checkin_blogs')
        .update({ view_count: data.view_count + 1 })
        .eq('id', id);

      return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        view_count: data.view_count + 1
      };
    } catch (error) {
      console.error('Failed to fetch blog by id:', error);
      throw error;
    }
  }

  async createBlog(blog: Omit<CheckinBlog, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'like_count' | 'view_count'>): Promise<CheckinBlog> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('checkin_blogs')
        .insert({
          ...blog,
          user_id: user.id,
          like_count: 0,
          view_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating blog:', error);
        throw error;
      }

      const newBlog: CheckinBlog = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      // 更新缓存
      this.cache.blogs = [newBlog, ...this.cache.blogs];
      
      return newBlog;
    } catch (error) {
      console.error('Failed to create blog:', error);
      throw error;
    }
  }

  async updateBlog(id: number | string, updates: Partial<CheckinBlog>): Promise<CheckinBlog> {
    try {
      const { data, error } = await supabase
        .from('checkin_blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating blog:', error);
        throw error;
      }

      const updatedBlog: CheckinBlog = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      // 更新缓存
      const index = this.cache.blogs.findIndex(blog => blog.id === id);
      if (index !== -1) {
        this.cache.blogs[index] = updatedBlog;
      }
      
      return updatedBlog;
    } catch (error) {
      console.error('Failed to update blog:', error);
      throw error;
    }
  }

  async deleteBlog(id: number | string): Promise<void> {
    try {
      const { error } = await supabase
        .from('checkin_blogs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog:', error);
        throw error;
      }

      // 从缓存中移除
      this.cache.blogs = this.cache.blogs.filter(blog => blog.id !== id);
    } catch (error) {
      console.error('Failed to delete blog:', error);
      throw error;
    }
  }

  async likeBlog(id: number | string): Promise<void> {
    try {
      // 先获取当前点赞数
      const { data: blog, error: fetchError } = await supabase
        .from('checkin_blogs')
        .select('like_count')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching blog for like:', fetchError);
        throw fetchError;
      }

      // 增加点赞数
      const { error } = await supabase
        .from('checkin_blogs')
        .update({ like_count: blog.like_count + 1 })
        .eq('id', id);

      if (error) {
        console.error('Error liking blog:', error);
        throw error;
      }

      // 更新缓存
      const index = this.cache.blogs.findIndex(b => b.id === id);
      if (index !== -1) {
        this.cache.blogs[index].like_count += 1;
      }
    } catch (error) {
      console.error('Failed to like blog:', error);
      throw error;
    }
  }

  // ================================
  // 图片上传
  // ================================

  async uploadImage(file: File): Promise<string> {
    try {
      const bucketName = 'images';
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `checkin-images/${fileName}`;

      // 直接尝试上传，不进行复杂的存储桶检查
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        
        // 如果是存储桶不存在的错误，提供明确的指导
        if (uploadError.message.includes('not found') || uploadError.message.includes('does not exist')) {
          throw new Error('存储桶"images"不存在。请在Supabase控制台中创建名为"images"的存储桶，并设置为公开访问。');
        }
        
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }

  // ================================
  // 工具方法
  // ================================

  getLastSyncTime(): Date | null {
    return this.cache.lastSyncTime;
  }

  clearCache(): void {
    this.cache = {
      checkinItems: [],
      checkinRecords: [],
      blogs: [],
      lastSyncTime: null
    };
  }

  // 检查是否有待同步的数据
  hasPendingChanges(): boolean {
    // 这里可以实现更复杂的离线同步逻辑
    return false;
  }
}

// 创建单例实例
export const checkinService = new CheckinDataService();
export default checkinService;