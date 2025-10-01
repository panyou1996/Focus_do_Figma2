
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "./ui/drawer";

interface TaskList {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface AddListDrawerProps {
  onClose: () => void;
  onAddList: (list: Omit<TaskList, 'id'>) => void;
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

export default function AddListDrawer({ onClose, onAddList }: AddListDrawerProps) {
  const [newList, setNewList] = useState({
    name: "",
    icon: "💼",
    color: "#FF6B6B",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newList.name.trim()) return;
    onAddList(newList);
    onClose();
  };

  return (
    <Drawer
      open
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DrawerContent className="bg-white">
        {/* Top indicator */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-9 h-1 bg-gray-300 rounded-full" />
        </div>
        
        <DrawerHeader className="text-center">
          <DrawerTitle>Add New List</DrawerTitle>
          <p className="text-sm text-gray-500">Create a new list to organize your tasks.</p>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* List Name */}
            <div className="mt-6">
              <Input
                id="name"
                value={newList.name}
                onChange={(e) => setNewList(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Work, Groceries, etc."
                className="h-14 px-4 text-base border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ marginBottom: '28px' }}
                required
              />
            </div>

            {/* Icon & Color Section */}
            <div className="mb-7">
              <Label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 block">ICON & COLOR</Label>
              
              {/* Icon Selector */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 mb-5">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewList(prev => ({ ...prev, icon }))}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 transition-all ${
                      newList.icon === icon 
                        ? 'text-white' 
                        : 'bg-gray-100 text-gray-500'
                    }`}
                    style={{ 
                      backgroundColor: newList.icon === icon ? newList.color : undefined 
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              
              {/* Color Selector */}
              <div className="flex gap-4">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewList(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full transition-all ${
                      newList.color === color 
                        ? 'ring-2 ring-white ring-offset-1' 
                        : ''
                    }`}
                    style={{ 
                      backgroundColor: color,
                      boxShadow: newList.color === color ? `0 0 0 1px ${color}` : undefined
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Description */}
            <div className="mb-8">
              <Textarea
                id="description"
                value={newList.description}
                onChange={(e) => setNewList(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a short description..."
                className="h-20 px-4 py-4 text-base border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            
            {/* Action Buttons */}
            <DrawerFooter>
              <div className="flex gap-3 pt-8 pb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 border border-gray-200 text-gray-900 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-white rounded-lg"
                  style={{ backgroundColor: newList.color }}
                  disabled={!newList.name.trim()}
                >
                  Add List
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
