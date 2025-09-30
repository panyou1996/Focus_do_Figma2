import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  BookOpen,
  Filter,
  Search,
  Grid,
  List
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { NativeService } from "../utils/nativeService";
import checkinService from "../utils/checkinService";
import { CreateCheckinItemDrawer, CheckinDialog } from "./CheckinComponents";
import { CreateBlogDrawer, BlogCard } from "./BlogComponents";
import BlogListPage from "./BlogListPage";
import CheckinStatsPage from "./CheckinStatsPage";
import BlogDetailPage from "./BlogDetailPage";
import {
  CheckinItem,
  CheckinRecord,
  CheckinBlog,
  CheckinStats,
  CheckinMood,
  DEFAULT_CHECKIN_CATEGORIES,
  MOOD_CONFIG
} from "../types/checkin";

interface CheckinPageProps {
  onNavigateToToday?: () => void;
}

export default function CheckinPage({ onNavigateToToday }: CheckinPageProps) {
  // 状态管理
  const [activeTab, setActiveTab] = useState<'checkin' | 'stats' | 'blogs'>('checkin');
  const [checkinItems, setCheckinItems] = useState<CheckinItem[]>([]);
  const [checkinRecords, setCheckinRecords] = useState<CheckinRecord[]>([]);
  const [blogs, setBlogs] = useState<CheckinBlog[]>([]);
  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // 弹窗状态
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showCheckinDialog, setShowCheckinDialog] = useState(false);
  const [showCreateBlogDrawer, setShowCreateBlogDrawer] = useState(false);
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CheckinItem | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<CheckinBlog | null>(null);

  // 初始化数据加载
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      // 先初始化服务（创建存储桶等）
      await checkinService.initialize();
      
      // 并行加载所有数据，不阻塞UI
      setIsLoading(false); // 立即停止loading，先显示界面
      
      // 后台异步加载数据
      const [itemsData, recordsData, blogsData, statsData] = await Promise.allSettled([
        checkinService.getCheckinItems(),
        checkinService.getCheckinRecords(),
        checkinService.getBlogs(),
        checkinService.getCheckinStats()
      ]);

      if (itemsData.status === 'fulfilled') {
        setCheckinItems(itemsData.value);
      }
      if (recordsData.status === 'fulfilled') {
        setCheckinRecords(recordsData.value);
      }
      if (blogsData.status === 'fulfilled') {
        setBlogs(blogsData.value);
      }
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      }
    } catch (error) {
      console.error('Error loading checkin data:', error);
    }
  };

  // 创建打卡项目
  const handleCreateCheckinItem = async (itemData: Omit<CheckinItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const newItem = await checkinService.createCheckinItem(itemData);
      setCheckinItems(prev => [newItem, ...prev]);
      
      // 刷新统计数据
      const newStats = await checkinService.getCheckinStats();
      setStats(newStats);
      
      await NativeService.showToast('创建成功！');
    } catch (error) {
      console.error('Failed to create checkin item:', error);
      await NativeService.showToast('创建失败，请重试');
    }
  };

  // 打开打卡对话框
  const handleOpenCheckinDialog = (item: CheckinItem) => {
    setSelectedItem(item);
    setShowCheckinDialog(true);
  };
  // 创建Blog
  const handleCreateBlog = async (blogData: Omit<CheckinBlog, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'like_count' | 'view_count'>) => {
    try {
      const newBlog = await checkinService.createBlog(blogData);
      setBlogs(prev => [newBlog, ...prev]);
      
      // 刷新统计数据
      const newStats = await checkinService.getCheckinStats();
      setStats(newStats);
      
      await NativeService.showToast('发布成功！');
    } catch (error) {
      console.error('Failed to create blog:', error);
      await NativeService.showToast('发布失败，请重试');
    }
  };

  // 点赞Blog
  const handleLikeBlog = async (blogId: number | string) => {
    try {
      await checkinService.likeBlog(blogId);
      
      // 更新本地Blog数据
      setBlogs(prev => prev.map(blog => 
        blog.id === blogId 
          ? { ...blog, like_count: blog.like_count + 1 }
          : blog
      ));
    } catch (error) {
      console.error('Failed to like blog:', error);
      await NativeService.showToast('点赞失败');
    }
  };

  // 删除Blog
  const handleDeleteBlog = async (blogId: number | string) => {
    try {
      await checkinService.deleteBlog(blogId);
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
      
      // 刷新统计数据
      const newStats = await checkinService.getCheckinStats();
      setStats(newStats);
      
      await NativeService.showToast('删除成功');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      await NativeService.showToast('删除失败');
    }
  };

  // 打开Blog详情页
  const handleOpenBlogDetail = (blog: CheckinBlog) => {
    setSelectedBlog(blog);
    setShowBlogDetail(true);
  };

  // 编辑Blog
  const handleEditBlog = async (blog: CheckinBlog) => {
    // TODO: 实现Blog编辑功能
    console.log('Edit blog:', blog);
    await NativeService.showToast('编辑功能即将开放');
  };

  // 关闭Blog详情页
  const handleCloseBlogDetail = () => {
    setShowBlogDetail(false);
    setSelectedBlog(null);
  };
  // 打卡确认处理
  const handleCheckinConfirm = async (note?: string, mood?: CheckinMood, location?: string, photoUrl?: string) => {
    if (!selectedItem) return;
    
    try {
      await NativeService.hapticLight();
      
      const record = await checkinService.createCheckinRecord({
        checkin_item_id: selectedItem.id,
        checked_at: new Date(),
        note,
        mood,
        location,
        photo_url: photoUrl
      });

      setCheckinRecords(prev => [record, ...prev]);
      
      // 刷新统计数据
      const newStats = await checkinService.getCheckinStats();
      setStats(newStats);
      
      // 成功反馈
      await NativeService.showToast('打卡成功！');
    } catch (error) {
      console.error('Checkin failed:', error);
      await NativeService.showToast('打卡失败，请重试');
    }
  };

  // 筛选已打卡项目
  const getTodayCheckedItems = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = checkinRecords.filter(record => 
      record.checked_at.toISOString().split('T')[0] === today
    );
    return todayRecords.map(record => record.checkin_item_id);
  };

  // 渲染打卡项目卡片
  const renderCheckinItemCard = (item: CheckinItem) => {
    const isCheckedToday = getTodayCheckedItems().includes(item.id);
    const categoryConfig = DEFAULT_CHECKIN_CATEGORIES[item.category];

    return (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`
          relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
          ${isCheckedToday 
            ? 'border-green-200 bg-green-50 shadow-sm' 
            : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm hover:shadow-md'
          }
        `}
        onClick={() => !isCheckedToday && handleOpenCheckinDialog(item)}
        whileTap={{ scale: 0.98 }}
      >
        {/* 状态指示器 */}
        {isCheckedToday && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}

        {/* 项目图标和信息 */}
        <div className="flex items-start gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${item.color}20` }}
          >
            {item.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm mb-1 ${isCheckedToday ? 'text-green-800' : 'text-gray-900'}`}>
              {item.title}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5"
                style={{ 
                  backgroundColor: `${categoryConfig.color}15`,
                  color: categoryConfig.color
                }}
              >
                {categoryConfig.icon} {categoryConfig.name}
              </Badge>
              
              <span className="text-xs text-gray-500">
                {item.target_type === 'daily' ? `${item.target_count}/天` : `${item.target_count}/周`}
              </span>
            </div>
            
            {item.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* 进度指示 */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: isCheckedToday ? '100%' : '0%',
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
          
          <span className="text-xs text-gray-500 ml-2">
            {isCheckedToday ? '已完成' : '待打卡'}
          </span>
        </div>
      </motion.div>
    );
  };

  // 渲染统计卡片
  const renderStatsCard = (title: string, value: string | number, icon: React.ReactNode, color: string) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-medium text-gray-900">打卡</h1>
            <p className="text-sm text-gray-500">
              记录每日成长，分享生活点滴
            </p>
          </div>
          
          <Button 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => setShowCreateDrawer(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            新建
          </Button>
        </div>

        {/* 快速统计 */}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.today_records}</div>
              <div className="text-xs text-gray-500">今日打卡</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.streak_days}</div>
              <div className="text-xs text-gray-500">连续天数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{stats.completion_rate}%</div>
              <div className="text-xs text-gray-500">完成率</div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-50 m-4 rounded-lg">
            <TabsTrigger value="checkin" className="text-sm">
              📝 打卡
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-sm">
              📊 统计
            </TabsTrigger>
            <TabsTrigger value="blogs" className="text-sm">
              📖 Blog
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'checkin' && (
            <motion.div
              key="checkin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto p-4"
            >
              {/* 搜索和视图切换 */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索打卡项目..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>

              {/* 打卡项目列表 */}
              {isLoading ? (
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : checkinItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium mb-2">还没有打卡项目</h3>
                  <p className="text-gray-500 mb-4">创建你的第一个打卡项目，开始记录生活</p>
                  <Button onClick={() => setShowCreateDrawer(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    创建打卡项目
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-1' : 'grid-cols-1'}`}>
                  <AnimatePresence>
                    {checkinItems
                      .filter(item => 
                        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(renderCheckinItemCard)
                    }
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto"
            >
              <CheckinStatsPage 
                stats={stats} 
                onRefreshStats={async () => {
                  const newStats = await checkinService.getCheckinStats();
                  setStats(newStats);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'blogs' && (
            <motion.div
              key="blogs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-hidden"
            >
              <BlogListPage
                blogs={blogs}
                onBlogClick={handleOpenBlogDetail}
                onCreateBlog={() => setShowCreateBlogDrawer(true)}
                onLikeBlog={handleLikeBlog}
                onDeleteBlog={handleDeleteBlog}
                onLoadMore={() => {
                  // TODO: 实现无限滚动加载
                  console.log('Load more blogs');
                }}
                hasMore={false}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 弹窗组件 */}
      <CreateCheckinItemDrawer
        isOpen={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        onSave={handleCreateCheckinItem}
      />
      
      <CheckinDialog
        isOpen={showCheckinDialog}
        onClose={() => {
          setShowCheckinDialog(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onConfirm={handleCheckinConfirm}
      />
      
      <CreateBlogDrawer
        isOpen={showCreateBlogDrawer}
        onClose={() => setShowCreateBlogDrawer(false)}
        onSave={handleCreateBlog}
        checkinRecords={checkinRecords}
      />

      {/* Blog详情页 */}
      <AnimatePresence>
        {showBlogDetail && selectedBlog && (
          <BlogDetailPage
            blog={selectedBlog}
            onClose={handleCloseBlogDetail}
            onEdit={handleEditBlog}
            onDelete={(blogId) => {
              handleDeleteBlog(blogId);
              handleCloseBlogDetail();
            }}
            onLike={handleLikeBlog}
          />
        )}
      </AnimatePresence>
    </div>
  );
}