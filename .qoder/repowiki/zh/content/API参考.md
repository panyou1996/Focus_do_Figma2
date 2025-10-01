# API参考文档

<cite>
**本文档中引用的文件**
- [src/utils/dataService.tsx](file://src/utils/dataService.tsx)
- [src/utils/checkinService.ts](file://src/utils/checkinService.ts)
- [src/utils/supabase/client.ts](file://src/utils/supabase/client.ts)
- [src/supabase/functions/server/index.tsx](file://src/supabase/functions/server/index.tsx)
- [src/types/checkin.ts](file://src/types/checkin.ts)
</cite>

## 目录
1. [简介](#简介)
2. [Supabase客户端](#supabase客户端)
3. [DataService API](#dataservice-api)
4. [CheckinService API](#checkinservice-api)
5. [Supabase边缘函数](#supabase边缘函数)
6. [数据模型](#数据模型)
7. [错误处理](#错误处理)
8. [使用示例](#使用示例)

## 简介

本文档提供了Focus.do应用程序中所有关键服务接口的详细API参考。主要包含以下核心服务：
- **DataService**：负责任务CRUD操作和用户认证
- **CheckinService**：处理打卡、博客和统计功能
- **Supabase客户端**：封装的数据库访问层
- **边缘函数**：服务器端API端点

## Supabase客户端

### 客户端初始化

```typescript
import { supabase } from './supabase/client'
```

### 认证方法

#### `signIn(email: string, password: string): Promise<User>`
- **描述**：用户登录
- **参数**：
  - `email` (string) - 用户邮箱
  - `password` (string) - 用户密码
- **返回值**：`Promise<User>` - 登录成功的用户信息
- **异常**：当认证失败时抛出错误
- **使用示例**：
```typescript
try {
  const user = await supabase.signIn('user@example.com', 'password123');
  console.log('登录成功:', user);
} catch (error) {
  console.error('登录失败:', error.message);
}
```

#### `signOut(): Promise<void>`
- **描述**：用户登出
- **返回值**：`Promise<void>`
- **异常**：无
- **使用示例**：
```typescript
await supabase.signOut();
console.log('已登出');
```

#### `signUp(email: string, password: string, name: string): Promise<User>`
- **描述**：用户注册
- **参数**：
  - `email` (string) - 用户邮箱
  - `password` (string) - 用户密码
  - `name` (string) - 用户姓名
- **返回值**：`Promise<User>` - 注册成功的用户信息
- **异常**：当注册失败时抛出错误
- **使用示例**：
```typescript
try {
  const user = await supabase.signUp('newuser@example.com', 'password123', '新用户');
  console.log('注册成功:', user);
} catch (error) {
  console.error('注册失败:', error.message);
}
```

**章节来源**
- [src/utils/supabase/client.ts](file://src/utils/supabase/client.ts#L1-L12)

## DataService API

DataService类提供了完整的任务管理和用户认证功能。

### 构造函数

```typescript
constructor()
```

### 任务管理

#### `getTasks(): Promise<Task[]>`
- **描述**：获取用户的全部任务
- **返回值**：`Promise<Task[]>` - 任务列表
- **异常**：网络错误或数据库查询失败时抛出
- **使用示例**：
```typescript
try {
  const tasks = await dataService.getTasks();
  console.log('获取任务成功:', tasks);
} catch (error) {
  console.error('获取任务失败:', error.message);
}
```

#### `createTask(task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task>`
- **描述**：创建新任务
- **参数**：
  - `task` (Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) - 任务数据
- **返回值**：`Promise<Task>` - 创建的任务对象
- **异常**：当创建失败时抛出
- **使用示例**：
```typescript
const newTask = {
  title: '完成项目报告',
  description: '撰写季度业务报告',
  listId: 1,
  dueDate: new Date(),
  startTime: '09:00',
  duration: 120,
  isFixed: true,
  completed: false,
  important: true,
  isMyDay: false,
  notes: ''
};

const createdTask = await dataService.createTask(newTask);
```

#### `updateTask(id: string | number, updates: Partial<Task>): Promise<Task>`
- **描述**：更新任务信息
- **参数**：
  - `id` (string | number) - 任务ID
  - `updates` (Partial<Task>) - 需要更新的字段
- **返回值**：`Promise<Task>` - 更新后的任务对象
- **异常**：当更新失败时抛出
- **使用示例**：
```typescript
const updatedTask = await dataService.updateTask(taskId, {
  completed: true,
  notes: '已完成'
});
```

#### `deleteTask(id: string | number): Promise<void>`
- **描述**：删除任务
- **参数**：
  - `id` (string | number) - 任务ID
- **返回值**：`Promise<void>`
- **异常**：当删除失败时抛出
- **使用示例**：
```typescript
await dataService.deleteTask(taskId);
console.log('任务已删除');
```

### 用户认证

#### `signUp(email: string, password: string, name: string): Promise<User>`
- **描述**：注册新用户
- **参数**：同上
- **返回值**：同上
- **异常**：同上

#### `signIn(email: string, password: string): Promise<User>`
- **描述**：登录用户
- **参数**：同上
- **返回值**：同上
- **异常**：同上

#### `signOut(): Promise<void>`
- **描述**：登出用户
- **参数**：无
- **返回值**：同上
- **异常**：无

#### `getCurrentUser(): User | null`
- **描述**：获取当前登录用户
- **返回值**：`User | null` - 当前用户信息或null
- **异常**：无

#### `isAuthenticated(): boolean`
- **描述**：检查用户是否已认证
- **返回值**：`boolean` - 是否已认证
- **异常**：无

### 同步功能

#### `syncData(): Promise<void>`
- **描述**：同步本地和远程数据
- **返回值**：`Promise<void>`
- **异常**：无
- **使用示例**：
```typescript
await dataService.syncData();
console.log('数据同步完成');
```

#### `getLastSyncTime(): Date | null`
- **描述**：获取上次同步时间
- **返回值**：`Date | null` - 最后一次同步时间
- **异常**：无

**章节来源**
- [src/utils/dataService.tsx](file://src/utils/dataService.tsx#L1-L879)

## CheckinService API

CheckinService类提供了完整的打卡、博客和统计功能。

### 构造函数

```typescript
constructor()
```

### 打卡项目管理

#### `getCheckinItems(): Promise<CheckinItem[]>`
- **描述**：获取所有活跃的打卡项目
- **返回值**：`Promise<CheckinItem[]>` - 打卡项目列表
- **异常**：当获取失败时抛出
- **使用示例**：
```typescript
const items = await checkinService.getCheckinItems();
console.log('打卡项目:', items);
```

#### `createCheckinItem(item: Omit<CheckinItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<CheckinItem>`
- **描述**：创建新的打卡项目
- **参数**：
  - `item` (Omit<CheckinItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>) - 打卡项目数据
- **返回值**：`Promise<CheckinItem>` - 创建的打卡项目
- **异常**：当创建失败时抛出
- **使用示例**：
```typescript
const newItem = await checkinService.createCheckinItem({
  title: '每天阅读30分钟',
  description: '培养阅读习惯',
  icon: '📚',
  color: '#8B5CF6',
  category: 'habit',
  target_type: 'daily',
  target_count: 1,
  is_active: true
});
```

#### `updateCheckinItem(id: number | string, updates: Partial<CheckinItem>): Promise<CheckinItem>`
- **描述**：更新打卡项目
- **参数**：同上
- **返回值**：同上
- **异常**：同上

#### `deleteCheckinItem(id: number | string): Promise<void>`
- **描述**：删除打卡项目（软删除）
- **参数**：
  - `id` (number | string) - 打卡项目ID
- **返回值**：`Promise<void>`
- **异常**：当删除失败时抛出
- **使用示例**：
```typescript
await checkinService.deleteCheckinItem(projectId);
console.log('打卡项目已删除');
```

### 打卡记录管理

#### `getCheckinRecords(itemId?: number | string, dateRange?: { start: Date; end: Date }): Promise<CheckinRecord[]>`
- **描述**：获取打卡记录
- **参数**：
  - `itemId` (number | string) - 可选的打卡项目ID
  - `dateRange` ({ start: Date; end: Date }) - 可选的时间范围
- **返回值**：`Promise<CheckinRecord[]>` - 打卡记录列表
- **异常**：当获取失败时抛出
- **使用示例**：
```typescript
// 获取某项目的全部记录
const records = await checkinService.getCheckinRecords(projectId);

// 获取某段时间内的记录
const dateRange = {
  start: new Date('2024-01-01'),
  end: new Date('2024-01-31')
};
const monthlyRecords = await checkinService.getCheckinRecords(null, dateRange);
```

#### `createCheckinRecord(record: Omit<CheckinRecord, 'id' | 'created_at' | 'user_id'>): Promise<CheckinRecord>`
- **描述**：创建打卡记录
- **参数**：
  - `record` (Omit<CheckinRecord, 'id' | 'created_at' | 'user_id'>) - 打卡记录数据
- **返回值**：`Promise<CheckinRecord>` - 创建的打卡记录
- **异常**：当创建失败时抛出
- **使用示例**：
```typescript
const newRecord = await checkinService.createCheckinRecord({
  checkin_item_id: projectId,
  checked_at: new Date(),
  note: '完成了今天的阅读目标',
  mood: 'good',
  location: '书房'
});
```

#### `updateCheckinRecord(id: number | string, updates: Partial<CheckinRecord>): Promise<CheckinRecord>`
- **描述**：更新打卡记录
- **参数**：同上
- **返回值**：同上
- **异常**：同上

#### `deleteCheckinRecord(id: number | string): Promise<void>`
- **描述**：删除打卡记录
- **参数**：同上
- **返回值**：同上
- **异常**：同上

### 统计数据

#### `getCheckinStats(timeRange?: { start: Date; end: Date }): Promise<CheckinStats>`
- **描述**：获取打卡统计数据
- **参数**：
  - `timeRange` ({ start: Date; end: Date }) - 可选的时间范围
- **返回值**：`Promise<CheckinStats>` - 统计数据
- **异常**：当获取失败时抛出
- **使用示例**：
```typescript
const stats = await checkinService.getCheckinStats({
  start: new Date('2024-01-01'),
  end: new Date('2024-01-31')
});
console.log('统计结果:', stats);
```

#### `getCheckinCalendar(month: Date): Promise<CheckinCalendarDay[]>`
- **描述**：获取月度打卡日历
- **参数**：
  - `month` (Date) - 月份
- **返回值**：`Promise<CheckinCalendarDay[]>` - 日历数据
- **异常**：当获取失败时抛出
- **使用示例**：
```typescript
const calendar = await checkinService.getCheckinCalendar(new Date());
calendar.forEach(day => {
  console.log(`${day.date}: ${day.records.length}次打卡`);
});
```

### Blog管理

#### `getBlogs(filters?: BlogFilters): Promise<CheckinBlog[]>`
- **描述**：获取博客列表
- **参数**：
  - `filters` (BlogFilters) - 可选的筛选条件
- **返回值**：`Promise<CheckinBlog[]>` - 博客列表
- **异常**：当获取失败时抛出
- **使用示例**：
```typescript
const blogs = await checkinService.getBlogs({
  sortBy: 'created_at',
  sortOrder: 'desc',
  mood: 'good'
});
```

#### `getBlogById(id: number | string): Promise<CheckinBlog>`
- **描述**：通过ID获取博客详情
- **参数**：
  - `id` (number | string) - 博客ID
- **返回值**：`Promise<CheckinBlog>` - 博客详情
- **异常**：当获取失败时抛出
- **使用示例**：
```typescript
const blog = await checkinService.getBlogById(blogId);
console.log('博客内容:', blog.content);
```

#### `createBlog(blog: Omit<CheckinBlog, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'like_count' | 'view_count'>): Promise<CheckinBlog>`
- **描述**：创建新博客
- **参数**：同上
- **返回值**：同上
- **异常**：同上
- **使用示例**：
```typescript
const newBlog = await checkinService.createBlog({
  title: '我的第一篇博客',
  content: '# 标题\n这是博客内容',
  mood: 'excellent',
  tags: ['日记', '生活'],
  is_public: true
});
```

#### `updateBlog(id: number | string, updates: Partial<CheckinBlog>): Promise<CheckinBlog>`
- **描述**：更新博客
- **参数**：同上
- **返回值**：同上
- **异常**：同上

#### `deleteBlog(id: number | string): Promise<void>`
- **描述**：删除博客
- **参数**：同上
- **返回值**：同上
- **异常**：同上

#### `likeBlog(id: number | string): Promise<void>`
- **描述**：为博客点赞
- **参数**：同上
- **返回值**：同上
- **异常**：当点赞失败时抛出
- **使用示例**：
```typescript
await checkinService.likeBlog(blogId);
console.log('已点赞');
```

### 图片上传

#### `uploadImage(file: File): Promise<string>`
- **描述**：上传图片到存储桶
- **参数**：
  - `file` (File) - 图片文件
- **返回值**：`Promise<string>` - 图片的公共URL
- **异常**：当上传失败时抛出
- **使用示例**：
```typescript
const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
const file = fileInput.files?.[0];
if (file) {
  try {
    const imageUrl = await checkinService.uploadImage(file);
    console.log('图片上传成功:', imageUrl);
  } catch (error) {
    console.error('图片上传失败:', error.message);
  }
}
```

**章节来源**
- [src/utils/checkinService.ts](file://src/utils/checkinService.ts#L1-L760)

## Supabase边缘函数

边缘函数部署在Supabase平台上，提供RESTful API端点。

### 健康检查

#### GET `/make-server-724a4c6b/health`
- **描述**：检查服务健康状态
- **响应**：
```json
{
  "status": "ok"
}
```

### 认证端点

#### POST `/make-server-724a4c6b/auth/signup`
- **描述**：用户注册
- **请求体**：
```json
{
  "email": "string",
  "password": "string", 
  "name": "string"
}
```
- **响应**：
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "onboarding_completed": false
  }
}
```
- **状态码**：
  - `200` - 成功
  - `400` - 参数错误
  - `500` - 服务器错误

#### POST `/make-server-724a4c6b/auth/signin`
- **描述**：用户登录
- **请求体**：同上
- **响应**：
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "onboarding_completed": false
  },
  "access_token": "string"
}
```
- **状态码**：同上

### 用户资料端点

#### GET `/make-server-724a4c6b/user/profile`
- **描述**：获取用户资料
- **请求头**：
  - `Authorization: Bearer <access_token>`
- **响应**：
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "onboarding_completed": false
  }
}
```
- **状态码**：
  - `200` - 成功
  - `401` - 未授权
  - `500` - 服务器错误

#### PUT `/make-server-724a4c6b/user/profile`
- **描述**：更新用户资料
- **请求头**：同上
- **请求体**：
```json
{
  "name": "string",
  "onboarding_completed": true
}
```
- **响应**：同上
- **状态码**：同上

### 任务管理端点

#### GET `/make-server-724a4c6b/tasks`
- **描述**：获取用户任务
- **请求头**：同上
- **响应**：
```json
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "userId": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```
- **状态码**：同上

#### POST `/make-server-724a4c6b/tasks`
- **描述**：创建新任务
- **请求头**：同上
- **请求体**：
```json
{
  "title": "string",
  "description": "string",
  "listId": "number",
  "dueDate": "string",
  "startTime": "string",
  "duration": "number",
  "isFixed": "boolean",
  "completed": "boolean",
  "important": "boolean",
  "isMyDay": "boolean",
  "notes": "string"
}
```
- **响应**：
```json
{
  "task": {
    "id": "string",
    "title": "string",
    "description": "string",
    "userId": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```
- **状态码**：同上

#### PUT `/make-server-724a4c6b/tasks/:id`
- **描述**：更新任务
- **路径参数**：
  - `id` (string) - 任务ID
- **请求头**：同上
- **请求体**：同上
- **响应**：同上
- **状态码**：
  - `200` - 成功
  - `401` - 未授权
  - `404` - 任务不存在
  - `500` - 服务器错误

#### DELETE `/make-server-724a4c6b/tasks/:id`
- **描述**：删除任务
- **路径参数**：同上
- **请求头**：同上
- **响应**：
```json
{
  "success": true
}
```
- **状态码**：同上

**章节来源**
- [src/supabase/functions/server/index.tsx](file://src/supabase/functions/server/index.tsx#L1-L263)

## 数据模型

### Task模型

```typescript
interface Task {
  id: number | string;
  title: string;
  description: string;
  listId: number;
  dueDate: Date;
  startTime: string;
  startDate?: Date;
  duration: number; // in minutes
  isFixed: boolean;
  completed: boolean;
  important: boolean;
  isMyDay: boolean;
  addedToMyDayAt?: Date;
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
```

### CheckinItem模型

```typescript
interface CheckinItem {
  id: number | string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  category: CheckinCategory;
  target_type: 'daily' | 'weekly' | 'custom';
  target_count: number;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  is_active: boolean;
}
```

### CheckinRecord模型

```typescript
interface CheckinRecord {
  id: number | string;
  checkin_item_id: number | string;
  user_id: string;
  checked_at: Date;
  note?: string;
  mood?: CheckinMood;
  location?: string;
  photo_url?: string;
  created_at: Date;
}
```

### CheckinBlog模型

```typescript
interface CheckinBlog {
  id: number | string;
  title: string;
  content: string;
  cover_image_url?: string;
  location?: string;
  tags: string[];
  checkin_records: number[];
  mood: CheckinMood;
  weather?: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  is_public: boolean;
  like_count: number;
  view_count: number;
}
```

### CheckinStats模型

```typescript
interface CheckinStats {
  total_items: number;
  active_items: number;
  total_records: number;
  today_records: number;
  week_records: number;
  month_records: number;
  streak_days: number;
  longest_streak: number;
  completion_rate: number;
  favorite_category: CheckinCategory;
  total_blogs: number;
  mood_distribution: Record<CheckinMood, number>;
  category_distribution: Record<CheckinCategory, number>;
}
```

**章节来源**
- [src/types/checkin.ts](file://src/types/checkin.ts#L1-L284)

## 错误处理

### 常见错误类型

1. **网络错误**
   - 状态码：`-1`
   - 消息："You are offline. Please check your connection."

2. **认证错误 (401)**
   - 状态码：`401`
   - 消息：`"HTTP 401 - Unauthorized"`

3. **超时错误**
   - 状态码：`-1`
   - 消息：`"getTasks timeout after 2 seconds"` 或 `"getSession timeout"`

4. **行级安全策略错误**
   - 状态码：`400`
   - 消息：`"row-level security policy violation"`

### 错误处理最佳实践

```typescript
try {
  const tasks = await dataService.getTasks();
} catch (error) {
  if (error.message.includes('offline')) {
    // 处理离线情况
    console.warn('应用处于离线状态');
  } else if (error.message.includes('401')) {
    // 处理认证问题
    console.error('需要重新登录');
  } else if (error.message.includes('timeout')) {
    // 处理超时情况
    console.warn('请求超时，使用缓存数据');
  } else {
    // 处理其他错误
    console.error('未知错误:', error.message);
  }
}
```

## 使用示例

### 完整的工作流程示例

```typescript
// 1. 用户注册
async function registerUser() {
  try {
    const user = await supabase.signUp(
      'user@example.com', 
      'securePassword123', 
      '张三'
    );
    console.log('注册成功:', user);
  } catch (error) {
    console.error('注册失败:', error.message);
  }
}

// 2. 创建任务
async function createNewTask() {
  const dataService = new DataService();
  
  const newTask = {
    title: '完成项目开发',
    description: '实现新功能模块',
    listId: 1,
    dueDate: new Date('2024-02-15'),
    startTime: '09:00',
    duration: 180,
    isFixed: true,
    completed: false,
    important: true,
    isMyDay: false,
    notes: '需要与团队讨论需求'
  };
  
  try {
    const task = await dataService.createTask(newTask);
    console.log('任务创建成功:', task);
  } catch (error) {
    console.error('任务创建失败:', error.message);
  }
}

// 3. 打卡项目管理
async function manageCheckinItems() {
  const checkinService = new CheckinDataService();
  
  // 创建打卡项目
  const newItem = await checkinService.createCheckinItem({
    title: '每天运动30分钟',
    description: '保持身体健康',
    icon: '🏃‍♂️',
    color: '#EF4444',
    category: 'fitness',
    target_type: 'daily',
    target_count: 1,
    is_active: true
  });
  
  // 获取打卡项目
  const items = await checkinService.getCheckinItems();
  console.log('打卡项目:', items);
  
  // 创建打卡记录
  const record = await checkinService.createCheckinRecord({
    checkin_item_id: newItem.id,
    checked_at: new Date(),
    note: '完成了30分钟跑步',
    mood: 'good'
  });
  
  // 获取统计数据
  const stats = await checkinService.getCheckinStats();
  console.log('统计信息:', stats);
}
```

### 错误恢复机制

```typescript
class ErrorHandler {
  static handleDataServiceError(error: Error, operation: string) {
    if (error.message.includes('offline')) {
      return {
        success: false,
        message: '请检查您的网络连接',
        retryOperation: true
      };
    } else if (error.message.includes('401')) {
      return {
        success: false,
        message: '认证已过期，请重新登录',
        redirect: '/login'
      };
    } else if (error.message.includes('timeout')) {
      return {
        success: false,
        message: '请求超时，正在使用缓存数据',
        useCache: true
      };
    }
    
    return {
      success: false,
      message: `操作失败: ${error.message}`,
      retryOperation: false
    };
  }
}
```

这个API参考文档涵盖了Focus.do应用程序中所有关键服务接口的详细信息，包括完整的参数说明、返回值类型、异常处理和实际使用示例。开发者可以根据此文档快速集成和使用这些接口。