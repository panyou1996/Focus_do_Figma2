// 打卡相关的数据模型和接口定义

// 打卡项目类型
export interface CheckinItem {
  id: number | string;
  title: string;                    // 打卡项目名称
  description?: string;             // 描述
  icon: string;                     // 图标emoji
  color: string;                    // 主题颜色
  category: CheckinCategory;        // 分类
  target_type: 'daily' | 'weekly' | 'custom'; // 目标类型
  target_count: number;             // 目标次数
  created_at: Date;
  updated_at: Date;
  user_id: string;
  is_active: boolean;               // 是否激活
}

// 打卡分类
export type CheckinCategory = 
  | 'health'      // 健康
  | 'fitness'     // 运动
  | 'learning'    // 学习
  | 'habit'       // 习惯
  | 'work'        // 工作
  | 'hobby'       // 爱好
  | 'social'      // 社交
  | 'other';      // 其他

// 打卡记录
export interface CheckinRecord {
  id: number | string;
  checkin_item_id: number | string;
  user_id: string;
  checked_at: Date;                 // 打卡时间
  note?: string;                    // 打卡备注
  mood?: CheckinMood;               // 心情状态
  location?: string;                // 地点
  photo_url?: string;               // 照片URL
  created_at: Date;
}

// 心情状态
export type CheckinMood = 
  | 'excellent'   // 😄
  | 'good'        // 😊
  | 'neutral'     // 😐
  | 'tired'       // 😴
  | 'stressed';   // 😰

// Blog文章
export interface CheckinBlog {
  id: number | string;
  title: string;                    // 标题
  content: string;                  // 内容（支持markdown）
  cover_image_url?: string;         // 首图URL
  location?: string;                // 地点
  tags: string[];                   // 标签
  checkin_records: number[];        // 关联的打卡记录ID
  mood: CheckinMood;                // 当时心情
  weather?: string;                 // 天气
  created_at: Date;
  updated_at: Date;
  user_id: string;
  is_public: boolean;               // 是否公开
  like_count: number;               // 点赞数
  view_count: number;               // 浏览数
}

// 打卡统计数据
export interface CheckinStats {
  total_items: number;              // 总打卡项目数
  active_items: number;             // 活跃项目数
  total_records: number;            // 总打卡次数
  today_records: number;            // 今日打卡次数
  week_records: number;             // 本周打卡次数
  month_records: number;            // 本月打卡次数
  streak_days: number;              // 连续打卡天数
  longest_streak: number;           // 最长连续天数
  completion_rate: number;          // 完成率
  favorite_category: CheckinCategory; // 最喜欢的分类
  total_blogs: number;              // Blog总数
  mood_distribution: Record<CheckinMood, number>; // 心情分布
  category_distribution: Record<CheckinCategory, number>; // 分类分布
}

// 打卡日历数据
export interface CheckinCalendarDay {
  date: string;                     // YYYY-MM-DD格式
  records: CheckinRecord[];         // 该日的打卡记录
  completion_rate: number;          // 完成率
  mood: CheckinMood | null;         // 主要心情
}

// 组件Props接口
export interface CheckinPageProps {
  onNavigateToToday?: () => void;
}

export interface CheckinItemCardProps {
  item: CheckinItem;
  todayRecord?: CheckinRecord;
  onCheckin: (itemId: number | string, note?: string, mood?: CheckinMood) => void;
  onEditItem: (item: CheckinItem) => void;
  onDeleteItem: (itemId: number | string) => void;
}

export interface CheckinStatsProps {
  stats: CheckinStats;
  timeRange: 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'year') => void;
}

export interface BlogCardProps {
  blog: CheckinBlog;
  onBlogClick: (blog: CheckinBlog) => void;
  onLike: (blogId: number | string) => void;
  onDelete?: (blogId: number | string) => void;
}

export interface BlogListProps {
  blogs: CheckinBlog[];
  onBlogClick: (blog: CheckinBlog) => void;
  onCreateBlog: () => void;
  onFilterChange: (filters: BlogFilters) => void;
  filters: BlogFilters;
}

export interface BlogDetailProps {
  blog: CheckinBlog;
  onClose: () => void;
  onEdit: (blog: CheckinBlog) => void;
  onDelete: (blogId: number | string) => void;
  onLike: (blogId: number | string) => void;
}

export interface CreateBlogProps {
  checkinRecords: CheckinRecord[];
  onClose: () => void;
  onSave: (blog: Omit<CheckinBlog, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'like_count' | 'view_count'>) => void;
}

export interface BlogFilters {
  mood?: CheckinMood;
  tags?: string[];
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy: 'created_at' | 'like_count' | 'view_count';
  sortOrder: 'asc' | 'desc';
}

// 服务接口
export interface CheckinService {
  // 打卡项目管理
  getCheckinItems(): Promise<CheckinItem[]>;
  createCheckinItem(item: Omit<CheckinItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<CheckinItem>;
  updateCheckinItem(id: number | string, updates: Partial<CheckinItem>): Promise<CheckinItem>;
  deleteCheckinItem(id: number | string): Promise<void>;

  // 打卡记录管理
  getCheckinRecords(itemId?: number | string, dateRange?: { start: Date; end: Date }): Promise<CheckinRecord[]>;
  createCheckinRecord(record: Omit<CheckinRecord, 'id' | 'created_at' | 'user_id'>): Promise<CheckinRecord>;
  updateCheckinRecord(id: number | string, updates: Partial<CheckinRecord>): Promise<CheckinRecord>;
  deleteCheckinRecord(id: number | string): Promise<void>;

  // 统计数据
  getCheckinStats(timeRange?: { start: Date; end: Date }): Promise<CheckinStats>;
  getCheckinCalendar(month: Date): Promise<CheckinCalendarDay[]>;

  // Blog管理
  getBlogs(filters?: BlogFilters): Promise<CheckinBlog[]>;
  getBlogById(id: number | string): Promise<CheckinBlog>;
  createBlog(blog: Omit<CheckinBlog, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'like_count' | 'view_count'>): Promise<CheckinBlog>;
  updateBlog(id: number | string, updates: Partial<CheckinBlog>): Promise<CheckinBlog>;
  deleteBlog(id: number | string): Promise<void>;
  likeBlog(id: number | string): Promise<void>;

  // 图片上传
  uploadImage(file: File): Promise<string>; // 返回图片URL
}

// 默认打卡分类配置
export const DEFAULT_CHECKIN_CATEGORIES = {
  health: { 
    name: '健康', 
    icon: '🏥', 
    color: '#10B981',
    examples: ['喝水', '吃药', '体检', '早睡']
  },
  fitness: { 
    name: '运动', 
    icon: '💪', 
    color: '#EF4444',
    examples: ['跑步', '健身', '瑜伽', '骑行']
  },
  learning: { 
    name: '学习', 
    icon: '📚', 
    color: '#8B5CF6',
    examples: ['读书', '上课', '练字', '背单词']
  },
  habit: { 
    name: '习惯', 
    icon: '⭐', 
    color: '#F59E0B',
    examples: ['冥想', '感恩', '整理', '计划']
  },
  work: { 
    name: '工作', 
    icon: '💼', 
    color: '#3B82F6',
    examples: ['开会', '写代码', '报告', '学习']
  },
  hobby: { 
    name: '爱好', 
    icon: '🎨', 
    color: '#EC4899',
    examples: ['画画', '音乐', '摄影', '手工']
  },
  social: { 
    name: '社交', 
    icon: '👥', 
    color: '#06B6D4',
    examples: ['聚会', '电话', '志愿', '分享']
  },
  other: { 
    name: '其他', 
    icon: '📝', 
    color: '#6B7280',
    examples: ['自定义项目']
  }
} as const;

// 心情配置
export const MOOD_CONFIG = {
  excellent: { name: '超棒', emoji: '😄', color: '#10B981' },
  good: { name: '不错', emoji: '😊', color: '#3B82F6' },
  neutral: { name: '一般', emoji: '😐', color: '#6B7280' },
  tired: { name: '疲惫', emoji: '😴', color: '#F59E0B' },
  stressed: { name: '焦虑', emoji: '😰', color: '#EF4444' }
} as const;

// 工具函数
export const getStreakDays = (records: CheckinRecord[]): number => {
  if (records.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasRecord = records.some(record => 
      record.checked_at.toISOString().split('T')[0] === dateStr
    );
    
    if (hasRecord) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

export const getCompletionRate = (items: CheckinItem[], records: CheckinRecord[], timeRange: { start: Date; end: Date }): number => {
  if (items.length === 0) return 0;
  
  const totalTargets = items.reduce((sum, item) => {
    const days = Math.ceil((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24));
    return sum + (item.target_type === 'daily' ? days * item.target_count : item.target_count);
  }, 0);
  
  const completedCount = records.filter(record => 
    record.checked_at >= timeRange.start && record.checked_at <= timeRange.end
  ).length;
  
  return totalTargets > 0 ? Math.round((completedCount / totalTargets) * 100) : 0;
};