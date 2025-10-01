import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share, 
  MapPin, 
  Edit,
  Trash2,
  Clock
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
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // 长按处理
  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      setShowMore(true);
      NativeService.hapticMedium();
    }, 500); // 长按500ms触发
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };

  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    // 增加浏览量
    incrementViewCount();
    
    // 清理定时器
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [blog.id]);

  const incrementViewCount = async () => {
    try {
      await checkinService.getBlogById(blog.id);
    } catch (error) {
      console.error('Failed to increment view count:', error);
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const dateStr = `${year}/${month}/${day}`;
    const timeStr = `${hours}:${minutes}`;
    
    return { dateStr, timeStr };
  };

  const formatContent = (content: string) => {
    // 简单的Markdown渲染
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  const { dateStr, timeStr } = formatDate(blog.created_at);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Blog Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-[28px] p-6 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.1)] max-w-md w-full max-h-[80vh] overflow-hidden"
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section - Icon and Tags */}
        <div className="flex items-center justify-between mb-6">
          {/* Mood Icon - No Background */}
          <div className="flex items-center justify-center">
            <span className="text-3xl">{MOOD_CONFIG[blog.mood].emoji}</span>
          </div>
          
          {/* Tags Display */}
          <div className="flex flex-wrap gap-1 justify-end">
            {blog.tags.length > 0 ? (
              blog.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs px-2 py-1 text-gray-500">
                无标签
              </Badge>
            )}
            {blog.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{blog.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#333333] mb-4 leading-tight">
          {blog.title}
        </h1>

        {/* Content */}
        <div 
          className="text-base text-[#757575] leading-relaxed mb-6 max-h-32 overflow-y-auto"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(blog.content) 
          }}
        />

        {/* Hero Image with Date and Time Overlay */}
        {blog.cover_image_url && (
          <div className="relative rounded-[20px] overflow-hidden">
            <img 
              src={blog.cover_image_url} 
              alt={blog.title}
              className="w-full h-64 object-cover"
            />
            
            {/* Date and Time Overlay - Bottom Left */}
            <div className="absolute bottom-4 left-4 text-white">
              <div className="backdrop-blur-sm bg-black/30 rounded-lg px-3 py-2">
                {/* Date and Time Line */}
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-sm font-medium">
                    {dateStr}, {timeStr}
                  </span>
                </div>
                
                {/* Location Line */}
                {blog.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">
                      {blog.location.split(',')[0] || blog.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Tags if no image */}
        {!blog.cover_image_url && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{blog.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </motion.div>

      {/* More Actions Panel */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 min-w-[240px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1行显示所有操作按钮 */}
            <div className="flex items-center justify-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  handleShare();
                  setShowMore(false);
                }}
                className="flex-1 h-10"
              >
                <Share className="h-4 w-4 mr-1" />
                分享
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  onEdit(blog);
                  setShowMore(false);
                }}
                className="flex-1 h-10"
              >
                <Edit className="h-4 w-4 mr-1" />
                编辑
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  onDelete(blog.id);
                  setShowMore(false);
                }}
                className="flex-1 h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                删除
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}