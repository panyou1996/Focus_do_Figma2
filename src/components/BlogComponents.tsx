import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Camera, 
  MapPin, 
  Smile, 
  Tag,
  Save,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Calendar,
  Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { NativeService } from "../utils/nativeService";
import checkinService from "../utils/checkinService";
import {
  CheckinBlog,
  CheckinRecord,
  CheckinMood,
  MOOD_CONFIG
} from "../types/checkin";

interface CreateBlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blog: Omit<CheckinBlog, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'like_count' | 'view_count'>) => void;
  checkinRecords: CheckinRecord[];
}

export function CreateBlogDrawer({ isOpen, onClose, onSave, checkinRecords }: CreateBlogDrawerProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    cover_image_url: '',
    location: '',
    tags: [] as string[],
    checkin_records: [] as number[],
    mood: 'good' as CheckinMood,
    weather: '',
    is_public: false
  });
  
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取今日打卡记录作为可选择的关联记录
  const todayRecords = checkinRecords.filter(record => {
    const today = new Date().toISOString().split('T')[0];
    return record.checked_at.toISOString().split('T')[0] === today;
  });

  const handleSave = async () => {
    if (!formData.title.trim()) {
      await NativeService.showToast('请输入标题');
      return;
    }
    
    if (!formData.content.trim()) {
      await NativeService.showToast('请输入内容');
      return;
    }

    try {
      await NativeService.hapticLight();
      onSave(formData);
      onClose();
      
      // 重置表单
      setFormData({
        title: '',
        content: '',
        cover_image_url: '',
        location: '',
        tags: [],
        checkin_records: [],
        mood: 'good',
        weather: '',
        is_public: false
      });
      setNewTag('');
    } catch (error) {
      console.error('Failed to create blog:', error);
      await NativeService.showToast('发布失败，请重试');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件大小（5MB限制）
    if (file.size > 5 * 1024 * 1024) {
      await NativeService.showToast('图片大小不能超过5MB');
      return;
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      await NativeService.showToast('请选择图片文件');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await checkinService.uploadImage(file);
      setFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
      await NativeService.showToast('图片上传成功');
    } catch (error: any) {
      console.error('Image upload failed:', error);
      
      // 提供更具体的错误信息
      let errorMessage = '图片上传失败';
      
      if (error?.message?.includes('Storage bucket') && error?.message?.includes('not found')) {
        errorMessage = '存储桶未创建，请在Supabase控制台中创建"images"桶';
      } else if (error?.message?.includes('Bucket not found')) {
        errorMessage = '存储配置错误，请在Supabase中创建存储桶';
      } else if (error?.message?.includes('Permission denied')) {
        errorMessage = '没有上传权限，请检查登录状态';
      } else if (error?.message?.includes('File size')) {
        errorMessage = '文件过大，请选择小于5MB的图片';
      }
      
      await NativeService.showToast(errorMessage);
    } finally {
      setIsUploading(false);
      // 重置文件输入框以允许重新上传同一文件
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const toggleCheckinRecord = (recordId: number) => {
    setFormData(prev => ({
      ...prev,
      checkin_records: prev.checkin_records.includes(recordId)
        ? prev.checkin_records.filter(id => id !== recordId)
        : [...prev.checkin_records, recordId]
    }));
  };

  const moodOptions = Object.entries(MOOD_CONFIG).map(([key, config]) => ({
    value: key as CheckinMood,
    emoji: config.emoji,
    name: config.name,
    color: config.color
  }));

  const commonTags = ['生活', '健康', '运动', '学习', '工作', '美食', '旅行', '感悟'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[95vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">写Blog</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="p-4 space-y-6">
                {/* 标题 */}
                <div>
                  <Label htmlFor="title">标题 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="给你的Blog起个标题"
                    className="mt-1"
                  />
                </div>

                {/* 首图上传 */}
                <div>
                  <Label>首图</Label>
                  <div className="mt-2">
                    {formData.cover_image_url ? (
                      <div className="relative">
                        <img 
                          src={formData.cover_image_url} 
                          alt="Cover" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData(prev => ({ ...prev, cover_image_url: '' }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                            <span className="text-sm text-gray-500">上传中...</span>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">点击上传首图</span>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* 内容 */}
                <div>
                  <Label htmlFor="content">内容 *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="分享你的想法、感受或经历..."
                    className="mt-1 resize-none"
                    rows={8}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    支持Markdown格式，{formData.content.length}/2000字符
                  </div>
                </div>

                {/* 心情选择 */}
                <div>
                  <Label className="mb-3 block">
                    <Smile className="inline h-4 w-4 mr-1" />
                    心情状态
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {moodOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFormData(prev => ({ ...prev, mood: option.value }))}
                        className={`
                          p-3 rounded-xl border-2 text-center transition-all
                          ${formData.mood === option.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="text-xl mb-1">{option.emoji}</div>
                        <div className="text-xs text-gray-600">{option.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 地点和天气 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      地点
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="在哪里？"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="weather">天气</Label>
                    <Select 
                      value={formData.weather} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, weather: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="选择天气" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunny">☀️ 晴天</SelectItem>
                        <SelectItem value="cloudy">☁️ 多云</SelectItem>
                        <SelectItem value="rainy">🌧️ 下雨</SelectItem>
                        <SelectItem value="snowy">❄️ 下雪</SelectItem>
                        <SelectItem value="windy">💨 有风</SelectItem>
                        <SelectItem value="foggy">🌫️ 有雾</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 标签 */}
                <div>
                  <Label>
                    <Tag className="inline h-4 w-4 mr-1" />
                    标签
                  </Label>
                  
                  {/* 已添加的标签 */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      {formData.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="px-2 py-1 text-xs cursor-pointer hover:bg-red-100"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* 添加标签 */}
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="添加标签"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button variant="outline" size="sm" onClick={addTag}>
                      添加
                    </Button>
                  </div>
                  
                  {/* 常用标签 */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {commonTags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline" 
                        className="cursor-pointer hover:bg-blue-50 text-xs"
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, tag]
                            }));
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 关联打卡记录 */}
                {todayRecords.length > 0 && (
                  <div>
                    <Label>关联今日打卡</Label>
                    <div className="mt-2 space-y-2">
                      {todayRecords.map((record) => (
                        <div 
                          key={record.id} 
                          className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={formData.checkin_records.includes(Number(record.id))}
                            onChange={() => toggleCheckinRecord(Number(record.id))}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">打卡记录</div>
                            <div className="text-xs text-gray-500">
                              {record.checked_at.toLocaleTimeString('zh-CN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                              {record.note && ` - ${record.note}`}
                            </div>
                          </div>
                          {record.mood && (
                            <span className="text-lg">{MOOD_CONFIG[record.mood].emoji}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 隐私设置 */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {formData.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <div>
                      <div className="text-sm font-medium">公开Blog</div>
                      <div className="text-xs text-gray-500">
                        {formData.is_public ? '所有人都可以看到' : '仅自己可见'}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  取消
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleSave}
                  disabled={!formData.title.trim() || !formData.content.trim()}
                >
                  <Save className="h-4 w-4 mr-1" />
                  发布Blog
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface BlogCardProps {
  blog: CheckinBlog;
  onBlogClick: (blog: CheckinBlog) => void;
  onLike: (blogId: number | string) => void;
  onDelete?: (blogId: number | string) => void;
  showActions?: boolean;
}

export function BlogCard({ blog, onBlogClick, onLike, onDelete, showActions = true }: BlogCardProps) {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    
    try {
      setIsLiking(true);
      await NativeService.hapticLight();
      onLike(blog.id);
    } catch (error) {
      console.error('Like failed:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      await NativeService.hapticMedium();
      onDelete(blog.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onBlogClick(blog)}
    >
      {/* 首图 */}
      {blog.cover_image_url && (
        <div className="aspect-[4/3] bg-gray-100 relative">
          <img 
            src={blog.cover_image_url} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          {/* 心情overlay */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <span className="text-lg">{MOOD_CONFIG[blog.mood].emoji}</span>
          </div>
        </div>
      )}
      
      <div className="p-3">
        {/* 标题和时间 */}
        <div className="mb-2">
          <h3 className="font-medium text-sm mb-1 line-clamp-2">{blog.title}</h3>
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
        </div>
        
        {/* 内容预览 */}
        <p className="text-xs text-gray-600 line-clamp-3 mb-3">
          {blog.content.replace(/[#*`]/g, '')}
        </p>
        
        {/* 标签 */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {blog.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs px-1.5 py-0.5">
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                +{blog.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* 底部信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                isLiking ? 'opacity-50' : ''
              }`}
            >
              <span>❤️</span>
              <span>{blog.like_count}</span>
            </button>
            <span className="flex items-center gap-1">
              <span>👁️</span>
              <span>{blog.view_count}</span>
            </span>
          </div>
          
          {!blog.is_public && (
            <Badge variant="outline" className="text-xs">
              <EyeOff className="h-3 w-3 mr-1" />
              私密
            </Badge>
          )}
          
          {showActions && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}