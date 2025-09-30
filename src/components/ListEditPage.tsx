import React, { useState } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { motion } from "framer-motion";

interface TaskList {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface ListEditPageProps {
  list: TaskList;
  onClose: () => void;
  onUpdateList: (updatedList: TaskList) => void;
  onDeleteList: (listId: number) => void;
}

const icons = [
  "💼", "🏠", "🏃", "📚", "🛒", "❤️", "⭐", "💻", "📈", "📁", 
  "📞", "😊", "✈️", "🎁", "💪", "🥗", "🧘", "💡", "✍️", "🔬", 
  "🛍️", "💳", "🍎", "🎵", "🎬", "🗑️", "✨", "🎉", "📌", "🔑"
];

const colors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA",
  "#F0B8D9", "#8A2BE2", "#FFD700", "#32CD32", "#FF4500"
];

export default function ListEditPage({ 
  list, 
  onClose, 
  onUpdateList, 
  onDeleteList 
}: ListEditPageProps) {
  const [editingList, setEditingList] = useState<TaskList>({ ...list });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateList(editingList);
    onClose();
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDeleteList(list.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      className="absolute inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* 修复了这里的语法错误 */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* 添加了阻止事件冒泡的关键代码 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header with back and delete buttons */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <h1 className="text-lg font-medium">Edit List</h1>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Delete confirmation banner */}
        {showDeleteConfirm && (
          <div className="bg-red-50 p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800">Delete this list?</p>
              <p className="text-sm text-red-600 mt-1">
                All tasks in "{editingList.name}" will be deleted.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  onDeleteList(list.id);
                  onClose();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">List Name *</Label>
              <Input
                id="name"
                value={editingList.name}
                onChange={(e) => 
                  setEditingList(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Work, Groceries, etc."
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2 mt-1 overflow-y-auto text-sm">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => 
                      setEditingList(prev => ({ ...prev, icon }))
                    }
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-2xl ${
                      editingList.icon === icon 
                        ? 'ring-2 ring-blue-500 bg-blue-100' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => 
                      setEditingList(prev => ({ ...prev, color }))
                    }
                    className={`w-8 h-8 rounded-full ${
                      editingList.color === color 
                        ? 'ring-2 ring-offset-2 ring-blue-500' 
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingList.description}
                onChange={(e) => 
                  setEditingList(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Add a short description..."
                className="mt-1"
                rows={2}
              />
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                type="submit"
                className="flex-1"
                style={{ backgroundColor: editingList.color }}
                disabled={!editingList.name.trim()}
              >
                Update List
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}