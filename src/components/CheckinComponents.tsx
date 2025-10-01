import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Camera, MapPin, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
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
import {
  CheckinItem,
  CheckinRecord,
  CheckinCategory,
  CheckinMood,
  DEFAULT_CHECKIN_CATEGORIES,
  MOOD_CONFIG
} from "../types/checkin";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "./ui/drawer";

interface CreateCheckinItemProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<CheckinItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
}

export function CreateCheckinItemDrawer({ isOpen, onClose, onSave }: CreateCheckinItemProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '📝',
    color: '#3B82F6',
    category: 'other' as CheckinCategory,
    target_type: 'daily' as 'daily' | 'weekly' | 'custom',
    target_count: 1,
    is_active: true
  });

  const handleSave = async () => {
    if (!formData.title.trim()) {
      await NativeService.showToast('请输入项目名称');
      return;
    }

    try {
      await NativeService.hapticLight();
      onSave(formData);
      onClose();
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        icon: '📝',
        color: '#3B82F6',
        category: 'other',
        target_type: 'daily',
        target_count: 1,
        is_active: true
      });
    } catch (error) {
      console.error('Failed to create checkin item:', error);
      await NativeService.showToast('创建失败，请重试');
    }
  };

  const categoryOptions = Object.entries(DEFAULT_CHECKIN_CATEGORIES).map(([key, config]) => ({
    value: key as CheckinCategory,
    label: config.name,
    icon: config.icon,
    color: config.color,
    examples: config.examples
  }));

  const iconOptions = ['📝', '💧', '🏃', '📚', '🧘', '💼', '🎨', '👥', '🍎', '💊', '🚴', '🎵', '🌱', '⭐', '🎯'];
  const colorOptions = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280'];

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>创建打卡项目</DrawerTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DrawerHeader>

        <div className="p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">项目名称 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="例如：每日喝水"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述这个打卡项目的目标和意义"
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* 图标选择 */}
            <div>
              <Label>图标</Label>
              <div className="grid grid-cols-8 gap-2 mt-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`
                      w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all
                      ${formData.icon === icon 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* 颜色选择 */}
            <div>
              <Label>主题颜色</Label>
              <div className="flex gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all
                      ${formData.color === color 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-200'
                      }
                    `}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* 分类选择 */}
            <div>
              <Label>分类</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as CheckinCategory }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 目标设置 */}
            <div className="space-y-4">
              <Label>目标</Label>
              <Select 
                value={formData.target_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, target_type: value as 'daily' | 'weekly' | 'custom' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">每日</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                  <SelectItem value="custom">自定义</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={formData.target_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_count: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="w-24"
                />
                <span>次 / {formData.target_type === 'daily' ? '天' : formData.target_type === 'weekly' ? '周' : '自定义周期'}</span>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleSave} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            创建
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface CheckinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: CheckinItem | null;
  onConfirm: (note?: string, mood?: CheckinMood, location?: string, photoUrl?: string) => void;
}

export function CheckinDialog({ isOpen, onClose, item, onConfirm }: CheckinDialogProps) {
  const [note, setNote] = useState('');
  const [mood, setMood] = useState<CheckinMood | undefined>();
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleConfirm = async () => {
    try {
      await NativeService.hapticMedium();
      onConfirm(note || undefined, mood, location || undefined, photoUrl || undefined);
      
      // 重置表单
      setNote('');
      setMood(undefined);
      setLocation('');
      setPhotoUrl('');
      
      onClose();
    } catch (error) {
      console.error('Checkin confirmation failed:', error);
      await NativeService.showToast('打卡失败，请重试');
    }
  };

  const moodOptions = Object.entries(MOOD_CONFIG).map(([key, config]) => ({
    value: key as CheckinMood,
    emoji: config.emoji,
    name: config.name,
    color: config.color
  }));

  if (!item) return null;

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

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-sm text-gray-500">记录这次打卡</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-4 overflow-y-auto">
                {/* 心情选择 */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    <Smile className="inline h-4 w-4 mr-1" />
                    今天的心情如何？
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {moodOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMood(mood === option.value ? undefined : option.value)}
                        className={`
                          p-3 rounded-xl border-2 text-center transition-all
                          ${mood === option.value 
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

                {/* 备注 */}
                <div>
                  <Label htmlFor="note" className="text-sm font-medium">
                    备注（可选）
                  </Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="记录今天的感受或进展..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                {/* 地点 */}
                <div>
                  <Label htmlFor="location" className="text-sm font-medium">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    地点（可选）
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="在哪里完成的？"
                    className="mt-1"
                  />
                </div>

                {/* 拍照（暂时简化） */}
                <div>
                  <Label className="text-sm font-medium">
                    <Camera className="inline h-4 w-4 mr-1" />
                    记录照片（可选）
                  </Label>
                  <Button
                    variant="outline"
                    className="w-full mt-1"
                    onClick={() => {
                      // TODO: 实现拍照功能
                      NativeService.showToast('拍照功能即将推出');
                    }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    拍照记录
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    取消
                  </Button>
                  <Button className="flex-1" onClick={handleConfirm}>
                    完成打卡
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}