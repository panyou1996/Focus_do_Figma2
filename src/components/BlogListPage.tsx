import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Grid, 
  List,
  ChevronDown,
  X,
  Heart,
  Eye,
  MapPin,
  Calendar,
  Tag,
  Plus,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { NativeService } from "../utils/nativeService";
import { BlogCard } from "./BlogComponents";
import {
  CheckinBlog,
  BlogFilters,
  CheckinMood,
  MOOD_CONFIG
} from "../types/checkin";

interface BlogListPageProps {
  blogs: CheckinBlog[];
  onBlogClick: (blog: CheckinBlog) => void;
  onCreateBlog: () => void;
  onLikeBlog: (blogId: number | string) => void;
  onDeleteBlog: (blogId: number | string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export default function BlogListPage({
  blogs,
  onBlogClick,
  onCreateBlog,
  onLikeBlog,
  onDeleteBlog,
  onLoadMore,
  hasMore = false,
  isLoading = false
}: BlogListPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'created_at' | 'like_count' | 'view_count'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedMood, setSelectedMood] = useState<CheckinMood | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  
  // 无限滚动相关
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver>();
  const lastBlogElementRef = useRef<HTMLDivElement>(null);

  // 获取所有唯一标签
  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));

  // 筛选和排序Blog
  const filteredAndSortedBlogs = React.useMemo(() => {
    let filtered = blogs;

    // 搜索筛选
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        (blog.location && blog.location.toLowerCase().includes(searchLower))
      );
    }

    // 心情筛选
    if (selectedMood !== 'all') {
      filtered = filtered.filter(blog => blog.mood === selectedMood);
    }

    // 标签筛选
    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog => 
        selectedTags.some(tag => blog.tags.includes(tag))
      );
    }

    // 日期筛选
    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(blog => blog.created_at >= startDate);
    }

    // 排序
    return filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case 'like_count':
          aValue = a.like_count;
          bValue = b.like_count;
          break;
        case 'view_count':
          aValue = a.view_count;
          bValue = b.view_count;
          break;
        default: // created_at
          aValue = a.created_at.getTime();
          bValue = b.created_at.getTime();
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
  }, [blogs, searchTerm, selectedMood, selectedTags, dateRange, sortBy, sortOrder]);

  // 无限滚动观察器
  useEffect(() => {
    if (isLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    });

    if (lastBlogElementRef.current) {
      observerRef.current.observe(lastBlogElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isLoading, hasMore, onLoadMore]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // 重置页码
  };

  const handleToggleTag = async (tag: string) => {
    await NativeService.hapticLight();
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = async () => {
    await NativeService.hapticLight();
    setSearchTerm("");
    setSelectedMood('all');
    setSelectedTags([]);
    setDateRange('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (selectedMood !== 'all') count++;
    if (selectedTags.length > 0) count++;
    if (dateRange !== 'all') count++;
    return count;
  };

  // 渲染网格视图
  const renderGridView = () => (
    <div className="grid grid-cols-2 gap-3 p-4">
      <AnimatePresence>
        {filteredAndSortedBlogs.map((blog, index) => (
          <div 
            key={blog.id}
            ref={index === filteredAndSortedBlogs.length - 1 ? lastBlogElementRef : null}
          >
            <BlogCard
              blog={blog}
              onBlogClick={onBlogClick}
              onLike={onLikeBlog}
              onDelete={onDeleteBlog}
              showActions={true}
            />
          </div>
        ))}
      </AnimatePresence>
      
      {/* 加载更多指示器 */}
      {hasMore && (
        <div className="col-span-2 flex justify-center py-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  // 渲染列表视图
  const renderListView = () => (
    <div className="p-4 space-y-3">
      <AnimatePresence>
        {filteredAndSortedBlogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            ref={index === filteredAndSortedBlogs.length - 1 ? lastBlogElementRef : null}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onBlogClick(blog)}
          >
            <div className="flex gap-3">
              {/* 首图缩略图 */}
              {blog.cover_image_url && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={blog.cover_image_url} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* 内容区域 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm line-clamp-2 flex-1">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <span className="text-lg">{MOOD_CONFIG[blog.mood].emoji}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {blog.content.replace(/[#*`]/g, '')}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{blog.created_at.toLocaleDateString('zh-CN')}</span>
                    {blog.location && (
                      <>
                        <MapPin className="h-3 w-3" />
                        <span>{blog.location}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {blog.like_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {blog.view_count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* 加载更多指示器 */}
      {hasMore && (
        <div className="flex justify-center py-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  // 渲染筛选面板
  const renderFiltersPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white border-b border-gray-100 overflow-hidden"
        >
          <div className="p-4 space-y-4">
            {/* 排序选项 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600">排序方式</Label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">时间</SelectItem>
                    <SelectItem value="like_count">点赞数</SelectItem>
                    <SelectItem value="view_count">浏览量</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">排序顺序</Label>
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">降序</SelectItem>
                    <SelectItem value="asc">升序</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 心情筛选 */}
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">心情</Label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedMood('all')}
                  className={`
                    px-3 py-1 rounded-full text-xs border transition-all
                    ${selectedMood === 'all' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  全部
                </button>
                {Object.entries(MOOD_CONFIG).map(([mood, config]) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood as CheckinMood)}
                    className={`
                      px-3 py-1 rounded-full text-xs border transition-all flex items-center gap-1
                      ${selectedMood === mood 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    <span>{config.emoji}</span>
                    <span>{config.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 时间范围 */}
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">时间范围</Label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: '全部' },
                  { value: 'week', label: '本周' },
                  { value: 'month', label: '本月' },
                  { value: 'year', label: '今年' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateRange(option.value as any)}
                    className={`
                      px-3 py-1 rounded-full text-xs border transition-all
                      ${dateRange === option.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 标签筛选 */}
            {allTags.length > 0 && (
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">标签</Label>
                <div className="flex gap-2 flex-wrap">
                  {allTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`
                        px-3 py-1 rounded-full text-xs border transition-all
                        ${selectedTags.includes(tag) 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }
                      `}
                    >
                      <Tag className="inline h-3 w-3 mr-1" />
                      {tag}
                    </button>
                  ))}
                  {allTags.length > 10 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{allTags.length - 10}...
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 清除筛选按钮 */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  清除筛选 ({getActiveFiltersCount()})
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Blog</h1>
            <p className="text-sm text-gray-500">
              {filteredAndSortedBlogs.length} 篇文章
            </p>
          </div>
          
          <Button 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={onCreateBlog}
          >
            <Plus className="h-4 w-4 mr-1" />
            写Blog
          </Button>
        </div>

        {/* 搜索和工具栏 */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索标题、内容、标签..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative ${getActiveFiltersCount() > 0 ? 'border-blue-500 text-blue-600' : ''}`}
            >
              <Filter className="h-4 w-4" />
              {getActiveFiltersCount() > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-500 text-white"
                >
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* 筛选面板 */}
        {renderFiltersPanel()}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-lg font-medium mb-2">
              {blogs.length === 0 ? '还没有Blog' : '没有找到匹配的Blog'}
            </h3>
            <p className="text-gray-500 mb-4">
              {blogs.length === 0 
                ? '分享你的打卡心得和生活感悟' 
                : '试试调整搜索条件或筛选器'
              }
            </p>
            {blogs.length === 0 ? (
              <Button onClick={onCreateBlog}>
                <Plus className="h-4 w-4 mr-1" />
                写第一篇Blog
              </Button>
            ) : (
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-1" />
                清除筛选
              </Button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
          </>
        )}
      </div>
    </div>
  );
}