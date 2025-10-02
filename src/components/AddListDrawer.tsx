
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
      onOpenChange={(isOpen: boolean) => !isOpen && onClose()}
    >
      <DrawerContent className="bg-white">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        <DrawerHeader className="text-center">
          <DrawerTitle>Add New List</DrawerTitle>
        </DrawerHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          {/* List Name */}
          <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
            <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">List Name</p>
            <div className="shrink-0 flex-1 max-w-[200px]">
              <Input
                value={newList.name}
                onChange={(e) => setNewList(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Work, Groceries"
                className="border-none shadow-none focus-visible:ring-0 text-right"
                required
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div className="px-4 py-3">
            <p className="text-[#111418] text-base font-medium leading-normal pb-2">Icon</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {icons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewList(prev => ({ ...prev, icon }))}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                    newList.icon === icon 
                      ? 'ring-2 ring-blue-500 bg-blue-100' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="px-4 py-3">
            <p className="text-[#111418] text-base font-medium leading-normal pb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewList(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full ${
                    newList.color === color 
                      ? 'ring-2 ring-offset-2 ring-blue-500' 
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Description</p>
              <Textarea
                value={newList.description}
                onChange={(e) => setNewList(prev => ({ ...prev, description: e.target.value }))}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] min-h-24 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                placeholder="Add a description for your list"
                rows={3}
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <DrawerFooter>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              style={{ backgroundColor: newList.color }}
              disabled={!newList.name.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add List
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
