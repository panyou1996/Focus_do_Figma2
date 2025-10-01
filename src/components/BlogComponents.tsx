import React, { useState, useRef, useEffect } from 'react';
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
  Clock,
  Globe,
  Star,
  Plus,
  ChevronRight,
  Navigation
} from "lucide-react";
import AMapLoader from '@amap/amap-jsapi-loader';
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
  CheckinItem,
  CheckinMood,
  MOOD_CONFIG
} from "../types/checkin";

interface CreateBlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (blog: Omit<CheckinBlog, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'like_count' | 'view_count'>) => void;
  onUpdate?: (blogId: number | string, updates: Partial<CheckinBlog>) => void;
  checkinRecords: CheckinRecord[];
  checkinItems?: CheckinItem[];
  editBlog?: CheckinBlog; // 可选的编辑博客数据
}

export function CreateBlogDrawer({ isOpen, onClose, onCreate, onUpdate, checkinRecords, checkinItems = [], editBlog }: CreateBlogDrawerProps) {
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
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 调试：监控抽屉状态
  useEffect(() => {
    console.log('CreateBlogDrawer: isOpen状态变化:', isOpen);
  }, [isOpen]);

  // 编辑模式：预填充数据
  useEffect(() => {
    if (editBlog && isOpen) {
      setFormData({
        title: editBlog.title,
        content: editBlog.content,
        cover_image_url: editBlog.cover_image_url || '',
        location: editBlog.location || '',
        tags: editBlog.tags || [],
        checkin_records: editBlog.checkin_records || [],
        mood: editBlog.mood,
        weather: editBlog.weather || '',
        is_public: editBlog.is_public
      });
    } else if (!editBlog && isOpen) {
      // 新建模式：重置表单
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
    }
  }, [editBlog, isOpen]);

  // 确保关闭函数可靠
  const handleClose = () => {
    console.log('CreateBlogDrawer: 尝试关闭抽屉');
    onClose();
  };

  // 获取今日打卡记录作为可选择的关联记录
  const todayRecords = checkinRecords.filter(record => {
    const today = new Date().toISOString().split('T')[0];
    return record.checked_at.toISOString().split('T')[0] === today;
  });

  const handleSave = async () => {
    if (!formData.title.trim()) {
      await NativeService.showToast('Please enter a title');
      return;
    }
    
    if (!formData.content.trim()) {
      await NativeService.showToast('Please enter content');
      return;
    }

    try {
      await NativeService.hapticLight();
      
      if (editBlog && onUpdate) {
        // 编辑模式：调用更新方法
        await onUpdate(editBlog.id, formData);
      } else if (onCreate) {
        // 新建模式：调用创建方法
        await onCreate(formData);
      }
      
      onClose();
      
      // 只在新建模式下重置表单
      if (!editBlog) {
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
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
      await NativeService.showToast('Failed to save, please try again');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      await NativeService.showToast('Image size cannot exceed 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      await NativeService.showToast('Please select an image file');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await checkinService.uploadImage(file);
      setFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
      await NativeService.showToast('Image uploaded successfully');
    } catch (error: any) {
      console.error('Image upload failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Image upload failed';
      
      if (error?.message?.includes('Storage bucket') && error?.message?.includes('not found')) {
        errorMessage = 'Storage bucket not created, please create "images" bucket in Supabase console';
      } else if (error?.message?.includes('Bucket not found')) {
        errorMessage = 'Storage configuration error, please create storage bucket in Supabase';
      } else if (error?.message?.includes('Permission denied')) {
        errorMessage = 'No upload permission, please check login status';
      } else if (error?.message?.includes('File size')) {
        errorMessage = 'File too large, please select image under 5MB';
      }
      
      await NativeService.showToast(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset file input to allow re-uploading the same file
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

  // 高德地图API相关
  const amapKey = import.meta.env.VITE_AMAP_API_KEY || 'your-amap-api-key';
  const amapSecurityJsCode = import.meta.env.VITE_AMAP_SECURITY_JS_CODE || 'your-security-js-code';

  // 获取当前位置
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      // 检查API密钥
      if (amapKey === 'your-amap-api-key' || amapSecurityJsCode === 'your-security-js-code') {
        await NativeService.showToast('请先配置高德地图API密钥和安全密钥');
        return;
      }

      // 使用浏览器地理位置API
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });
      
      const { latitude, longitude } = position.coords;
      console.log('获取到坐标:', { latitude, longitude });
      
      // 设置安全密钥
      (window as any)._AMapSecurityConfig = {
        securityJsCode: amapSecurityJsCode,
      };
      
      // 使用高德JS API进行逆地理编码
      AMapLoader.load({
        key: amapKey,
        version: '2.0',
        plugins: ['AMap.Geocoder']
      }).then((AMap) => {
        const geocoder = new AMap.Geocoder();
        const lnglat = new AMap.LngLat(longitude, latitude);
        
        geocoder.getAddress(lnglat, (status: string, result: any) => {
          console.log('高德API响应:', { status, result });
          
          if (status === 'complete' && result.info === 'OK') {
            const address = result.regeocode.formattedAddress;
            setFormData(prev => ({ ...prev, location: address }));
            NativeService.showToast('位置获取成功');
          } else {
            throw new Error('位置解析失败');
          }
          setIsGettingLocation(false);
        });
      }).catch((error) => {
        console.error('高德API加载失败:', error);
        throw error;
      });
      
    } catch (error: any) {
      console.error('获取位置失败:', error);
      let errorMessage = '获取位置失败';
      
      if (error.code === 1) {
        errorMessage = '位置权限被拒绝，请在设置中允许位置访问';
      } else if (error.code === 2) {
        errorMessage = '位置不可用，请检查GPS设置';
      } else if (error.code === 3) {
        errorMessage = '获取位置超时，请重试';
      } else if (error.message.includes('API错误')) {
        errorMessage = error.message;
      } else {
        // 如果是API问题，提供备用方案
        console.warn('API失败，使用备用定位方案');
        const basicLocation = `纬度: ${error.coords?.latitude?.toFixed(4) || '未知'}, 经度: ${error.coords?.longitude?.toFixed(4) || '未知'}`;
        setFormData(prev => ({ ...prev, location: basicLocation }));
        setShowLocationPicker(true);
        errorMessage = '已获取基础坐标信息，请手动选择具体位置';
      }
      
      await NativeService.showToast(errorMessage);
      setIsGettingLocation(false);
    }
  };

  // 搜索地址
  const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    
    // 检查API密钥
    if (amapKey === 'your-amap-api-key' || amapSecurityJsCode === 'your-security-js-code') {
      await NativeService.showToast('请先配置高德地图API密钥和安全密钥');
      return;
    }
    
    try {
      // 设置安全密钥
      (window as any)._AMapSecurityConfig = {
        securityJsCode: amapSecurityJsCode,
      };
      
      // 使用高德JS API进行地点搜索
      AMapLoader.load({
        key: amapKey,
        version: '2.0',
        plugins: ['AMap.PlaceSearch']
      }).then((AMap) => {
        const placeSearch = new AMap.PlaceSearch({
          city: '全国',
          citylimit: false
        });
        
        placeSearch.search(query, (status: string, result: any) => {
          console.log('搜索结果:', { status, result });
          
          if (status === 'complete' && result.info === 'OK' && result.poiList.pois.length > 0) {
            const poi = result.poiList.pois[0];
            const address = poi.name + ' ' + poi.address;
            setFormData(prev => ({ ...prev, location: address }));
            setCustomLocation('');
            setShowLocationPicker(false);
            NativeService.showToast('位置设置成功');
          } else {
            NativeService.showToast('未找到该地址，请重新输入');
          }
        });
      }).catch((error) => {
        console.error('高德API加载失败:', error);
        throw error;
      });
      
    } catch (error: any) {
      console.error('搜索地址失败:', error);
      await NativeService.showToast('搜索失败，请检查网络连接');
    }
  };

  const commonTags = ['Life', 'Health', 'Exercise', 'Study', 'Work', 'Food', 'Travel', 'Thoughts'];
  
  // 备用位置选项（当API不可用时）
  const fallbackLocations = [
    '家',
    '公司',
    '学校',
    '咖啡厅',
    '图书馆',
    '健身房',
    '公园',
    '商场'
  ];

  // 如果不是打开状态，不渲染任何内容
  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="absolute inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Drawer */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-medium text-center">{editBlog ? 'Edit Blog' : 'New Blog'}</h1>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <div className="p-4 pb-0">
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's on your mind?"
                  className="text-lg font-medium border-none shadow-none px-0 focus-visible:ring-0"
                  required
                />
              </div>

              {/* Content Textarea */}
              <div>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your thoughts..."
                  className="min-h-[120px] border-none shadow-none px-0 focus-visible:ring-0 resize-none"
                  rows={6}
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <Label className="text-sm text-gray-600">Cover Image</Label>
                {formData.cover_image_url ? (
                  <div className="relative w-full mt-1" style={{ aspectRatio: '16/9' }}>
                    <img 
                      src={formData.cover_image_url} 
                      alt="Cover" 
                      className="w-full h-full object-cover rounded-lg"
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
                    className="w-full h-24 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors mt-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Add cover image</span>
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

              {/* Mood */}
              <div>
                <Label className="text-sm text-gray-600">Mood</Label>
                <div className="flex gap-2 mt-1 overflow-x-auto pb-2">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, mood: option.value }))}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 transition-all ${
                        formData.mood === option.value 
                          ? 'text-white bg-blue-500' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {option.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <Label className="text-sm text-gray-600">Location</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex-1"
                    >
                      {isGettingLocation ? (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Navigation className="h-4 w-4 mr-2" />
                      )}
                      Current Location
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLocationPicker(!showLocationPicker)}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {showLocationPicker && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          placeholder="Enter location"
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && searchLocation(customLocation)}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => searchLocation(customLocation)}
                        >
                          Search
                        </Button>
                      </div>
                      
                      {/* 快捷位置选项 */}
                      <div>
                        <Label className="text-xs text-gray-500">快捷选择</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {fallbackLocations.map((location) => (
                            <Badge 
                              key={location}
                              variant="outline" 
                              className="cursor-pointer hover:bg-blue-50 text-xs"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, location }));
                                setShowLocationPicker(false);
                              }}
                            >
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.location && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {formData.location}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, location: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-sm text-gray-600">Tags</Label>
                
                {/* Added tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
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
                
                {/* Add tag */}
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button variant="outline" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Common tags */}
                <div className="flex flex-wrap gap-2 mt-2">
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

              {/* Privacy Setting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <Label className="text-sm text-gray-600">Public Post</Label>
                </div>
                <Switch
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                />
              </div>
            </div>
          </div>
          
          {/* Fixed bottom buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <Button 
                onClick={handleSave}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                disabled={!formData.title.trim() || !formData.content.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {editBlog ? 'Update' : 'Publish'}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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