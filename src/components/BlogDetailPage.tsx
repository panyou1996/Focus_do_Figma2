import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Heart, 
  Eye, 
  Share, 
  MapPin, 
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { NativeService } from "../utils/nativeService";
import checkinService from "../utils/checkinService";
import {
  CheckinBlog,
  CheckinRecord,
  MOOD_CONFIG
} from "../types/checkin";

interface BlogDetailPageProps {
  blog: CheckinBlog;
  onClose: () => void;
  onEdit: (blog: CheckinBlog) => void;
  onDelete: (blogId: number | string) => void;
  onLike: (blogId: number | string) => void;
  checkinRecords?: CheckinRecord[];
}

export default function BlogDetailPage({
  blog,
  onClose,
  onEdit,
  onDelete,
  onLike,
  checkinRecords = []
}: BlogDetailPageProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [relatedRecords, setRelatedRecords] = useState<CheckinRecord[]>([]);

  useEffect(() => {
    // 增加浏览量
    incrementViewCount();
    
    // 加载关联的打卡记录详情
    loadRelatedRecords();
  }, [blog.id]);

  const incrementViewCount = async () => {
    try {
      await checkinService.getBlogById(blog.id);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  const loadRelatedRecords = async () => {
    if (blog.checkin_records.length > 0) {
      try {
        const records = checkinRecords.filter(record => 
          blog.checkin_records.includes(Number(record.id))
        );
        setRelatedRecords(records);
      } catch (error) {
        console.error('Failed to load related records:', error);
      }
    }
  };

  const handleLike = async () => {
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

  const handleShare = async () => {
    try {
      await NativeService.hapticLight();
      
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.content.substring(0, 200) + '...',
          url: window.location.href
        });
      } else {
        // 降级到复制链接
        await navigator.clipboard.writeText(window.location.href);
        await NativeService.showToast('链接已复制');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const formatDate = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  const formatContent = (content: string) => {
    // 简单的Markdown渲染
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  const { month, day } = formatDate(blog.created_at);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowMore(!showMore)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* More Actions Panel */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border-b border-gray-100 px-4 py-2"
          >
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(blog)}>
                <Edit className="h-4 w-4 mr-1" />
                编辑
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(blog.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                删除
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          {/* Modern Blog Card - 参考blog_view.md设计 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[28px] p-6 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.1)] mb-6"
          >
            {/* Header Section - Tag and Date */}
            <div className="flex items-center justify-between mb-6">
              {/* Tag */}
              <div className="bg-[#2D2D2D] text-white px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium">
                  {MOOD_CONFIG[blog.mood].name}
                </span>
              </div>
              
              {/* Date */}
              <div className="flex items-center">
                <div className="bg-[#2D2D2D] text-white px-3 py-1.5 rounded-l-full">
                  <span className="text-sm font-bold">{month}</span>
                </div>
                <div className="bg-white border border-[#2D2D2D] text-[#2D2D2D] px-3 py-1.5 rounded-r-full border-l-0">
                  <span className="text-sm font-bold">{day}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-[#333333] mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Content Preview */}
            <div 
              className="text-base text-[#757575] leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ 
                __html: formatContent(blog.content.substring(0, 200) + '...') 
              }}
            />

            {/* Hero Image */}
            {blog.cover_image_url && (
              <div className="relative rounded-[20px] overflow-hidden mb-4">
                <img 
                  src={blog.cover_image_url} 
                  alt={blog.title}
                  className="w-full h-64 object-cover"
                />
                
                {/* Image Overlay - Location Info */}
                {blog.location && (
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-white" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }} />
                      <div style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
                        <div className="font-medium text-sm">
                          {blog.location.split(',')[0] || blog.location}
                        </div>
                        {blog.location.includes(',') && (
                          <div className="text-xs opacity-90">
                            {blog.location.split(',').slice(1).join(',').trim()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Full Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900">完整内容</h2>
            <div 
              className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
            />
          </motion.div>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">详细信息</h3>
            
            <div className="space-y-3">
              {/* 基本信息 */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{blog.created_at.toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{blog.created_at.toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>

              {blog.location && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{blog.location}</span>
                </div>
              )}

              {blog.weather && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-base">
                    {blog.weather === 'sunny' && '☀️'}
                    {blog.weather === 'cloudy' && '☁️'}
                    {blog.weather === 'rainy' && '🌧️'}
                    {blog.weather === 'snowy' && '❄️'}
                    {blog.weather === 'windy' && '💨'}
                    {blog.weather === 'foggy' && '🌫️'}
                  </span>
                  <span>
                    {blog.weather === 'sunny' && '晴天'}
                    {blog.weather === 'cloudy' && '多云'}
                    {blog.weather === 'rainy' && '下雨'}
                    {blog.weather === 'snowy' && '下雪'}
                    {blog.weather === 'windy' && '有风'}
                    {blog.weather === 'foggy' && '有雾'}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-lg">{MOOD_CONFIG[blog.mood].emoji}</span>
                <span>心情：{MOOD_CONFIG[blog.mood].name}</span>
              </div>
            </div>

            {/* 标签 */}
            {blog.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">标签</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Related Checkin Records */}
          {relatedRecords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm mb-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">关联打卡</h3>
              <div className="space-y-3">
                {relatedRecords.map((record) => (
                  <div key={record.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {record.mood && (
                      <span className="text-lg">{MOOD_CONFIG[record.mood].emoji}</span>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {record.checked_at.toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} 打卡
                      </div>
                      {record.note && (
                        <div className="text-xs text-gray-600 mt-1">{record.note}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-sm sticky bottom-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{blog.view_count + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{blog.is_public ? '🌍' : '🔒'}</span>
                  <span>{blog.is_public ? '公开' : '私密'}</span>
                </div>
              </div>
              
              <Button
                variant={isLiking ? "secondary" : "ghost"}
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isLiking ? 'text-red-500' : ''}`} />
                <span>{blog.like_count}</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}