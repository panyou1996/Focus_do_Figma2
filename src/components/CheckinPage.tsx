import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Filter,
  Search,
  Grid,
  List
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { NativeService } from "../utils/nativeService";
import checkinService from "../utils/checkinService";
import { CreateBlogDrawer } from "./BlogComponents";
import BlogDetailPage from "./BlogDetailPage";
import {
  CheckinItem,
  CheckinBlog,
  DEFAULT_CHECKIN_CATEGORIES
} from "../types/checkin";

interface CheckinPageProps {
  onNavigateToToday?: () => void;
}

export default function CheckinPage({ onNavigateToToday }: CheckinPageProps) {
  // 状态管理
  const [checkinItems, setCheckinItems] = useState<CheckinItem[]>([]);
  const [blogs, setBlogs] = useState<CheckinBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // 弹窗状态
  const [showCreateBlogDrawer, setShowCreateBlogDrawer] = useState(false);
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<CheckinBlog | null>(null);
  const [editBlog, setEditBlog] = useState<CheckinBlog | null>(null);

  // 调试：监控抽屉状态变化
  useEffect(() => {
    console.log('CheckinPage: showCreateBlogDrawer状态变化:', showCreateBlogDrawer);
  }, [showCreateBlogDrawer]);

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
      const [itemsData, blogsData] = await Promise.allSettled([
        checkinService.getCheckinItems(),
        checkinService.getBlogs()
      ]);

      if (itemsData.status === 'fulfilled') {
        setCheckinItems(itemsData.value);
      }
      if (blogsData.status === 'fulfilled') {
        setBlogs(blogsData.value);
      }
    } catch (error) {
      console.error('Error loading checkin data:', error);
    }
  };


  // 创建Blog
  const handleCreateBlog = async (blogData: Omit<CheckinBlog, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'like_count' | 'view_count'>) => {
    try {
      // 将checkin items的ID作为tags处理
      const processedBlogData = {
        ...blogData,
        tags: blogData.tags || [],
        checkin_records: blogData.checkin_records || []
      };
      
      const newBlog = await checkinService.createBlog(processedBlogData);
      setBlogs(prev => [newBlog, ...prev]);
      
      await NativeService.showToast('发布成功！');
    } catch (error) {
      console.error('Failed to create blog:', error);
      await NativeService.showToast('发布失败，请重试');
    }
  };

  // 更新Blog
  const handleUpdateBlog = async (blogId: number | string, updates: Partial<CheckinBlog>) => {
    try {
      const updatedBlog = await checkinService.updateBlog(blogId, updates);
      setBlogs(prev => prev.map(blog => 
        blog.id === blogId ? updatedBlog : blog
      ));
      
      await NativeService.showToast('更新成功！');
    } catch (error) {
      console.error('Failed to update blog:', error);
      await NativeService.showToast('更新失败，请重试');
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
  const handleEditBlog = (blog: CheckinBlog) => {
    setEditBlog(blog);
    setShowBlogDetail(false); // 关闭详情页
    setShowCreateBlogDrawer(true); // 打开编辑抽屉
  };

  // 获取标签项目
  const getTagItem = (tagId: string) => {
    return checkinItems.find(item => item.id.toString() === tagId);
  };

  // 关闭Blog详情页
  const handleCloseBlogDetail = () => {
    setShowBlogDetail(false);
    setSelectedBlog(null);
    setEditBlog(null); // 清除编辑状态
  };

  // 获取筛选后的Blogs
  const getFilteredBlogs = () => {
    let filtered = blogs;

    // 根据搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 根据标签筛选
    if (selectedTag !== 'all') {
      filtered = filtered.filter(blog => 
        blog.tags && blog.tags.includes(selectedTag)
      );
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // 渲染Blog卡片
  const renderBlogCard = (blog: CheckinBlog) => {
    const getTagItem = (tagId: string) => {
      return checkinItems.find(item => item.id.toString() === tagId);
    };

    return (
      <motion.div
        key={blog.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
        onClick={() => handleOpenBlogDetail(blog)}
        whileTap={{ scale: 0.98 }}
      >
        {/* Blog图片 */}
        {blog.cover_image_url && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={blog.cover_image_url} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Blog内容 */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {blog.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {blog.content}
          </p>
          
          {/* 标签 */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {blog.tags.map((tagId) => {
                const tagItem = getTagItem(tagId);
                if (!tagItem) return null;
                
                return (
                  <Badge 
                    key={tagId}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                    style={{ 
                      backgroundColor: `${tagItem.color}20`,
                      color: tagItem.color
                    }}
                  >
                    {tagItem.icon} {tagItem.title}
                  </Badge>
                );
              })}
            </div>
          )}
          
          {/* Blog元信息 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>❤️ {blog.like_count || 0}</span>
              <span>👀 {blog.view_count || 0}</span>
            </div>
            <span>
              {new Date(blog.created_at).toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-medium">Blog</h1>
          <p className="text-sm text-gray-500">
            {blogs.length} articles
          </p>
        </div>
        
        <Button 
          variant="ghost"
          size="sm" 
          onClick={() => setShowCreateBlogDrawer(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          {/* Search and filter bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Tag filter */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {checkinItems.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.icon} {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>

          {/* Blog list */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3"></div>
                      <div className="flex gap-2 mb-3">
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : getFilteredBlogs().length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || selectedTag !== 'all' ? 'No blogs found' : 'No blogs yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedTag !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'Write your first blog to get started'
                }
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1' : 'grid-cols-1'}`}>
              <AnimatePresence>
                {getFilteredBlogs().map(renderBlogCard)}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      
      {/* 弹窗组件 */}
      <AnimatePresence>
        {showCreateBlogDrawer && (
          <CreateBlogDrawer
            isOpen={showCreateBlogDrawer}
            onClose={() => {
              setShowCreateBlogDrawer(false);
              setEditBlog(null); // 关闭时清除编辑状态
            }}
            onCreate={handleCreateBlog}
            onUpdate={handleUpdateBlog}
            checkinRecords={[]}
            editBlog={editBlog || undefined}
          />
        )}
      </AnimatePresence>

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