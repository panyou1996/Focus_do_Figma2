import React, { useState } from "react";
import { Plus, Calendar, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { motion } from "framer-motion";

interface Task {
  id: number;
  title: string;
  description: string;
  listId: number;
  dueDate: Date;
  startTime: string;
  duration: number;
  isFixed: boolean;
  completed: boolean;
  important: boolean;
  notes: string;
}

interface TaskList {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface AddTaskDrawerProps {
  taskLists: TaskList[];
  initialDueDate?: Date;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export default function AddTaskDrawer({
  taskLists,
  initialDueDate,
  onClose,
  onAddTask,
}: AddTaskDrawerProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    listId: taskLists[0]?.id || 1,
    dueDate: initialDueDate || new Date(),
    startTime: "",
    duration: 60,
    isFixed: false,
    completed: false,
    important: false,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;
    
    onAddTask({
      ...newTask,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      notes: newTask.notes.trim(),
    });
    
    onClose();
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (dateString: string) => {
    setNewTask(prev => ({
      ...prev,
      dueDate: new Date(dateString)
    }));
  };

  const selectedList = taskLists.find(list => list.id === newTask.listId);

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
        onClick={onClose}
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-medium">Add New Task</h1>
              <p className="text-sm text-gray-500">Create a new task</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What needs to be done?"
                className="mt-1"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add more details..."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* List Selection */}
            <div>
              <Label htmlFor="list">List</Label>
              <Select
                value={newTask.listId.toString()}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, listId: parseInt(value) }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue>
                    {selectedList && (
                      <div className="flex items-center gap-2">
                        <span>{selectedList.icon}</span>
                        <span>{selectedList.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {taskLists.map((list) => (
                    <SelectItem key={list.id} value={list.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{list.icon}</span>
                        <span>{list.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formatDateForInput(newTask.dueDate)}
                onChange={(e) => handleDateChange(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Time & Duration */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Scheduling</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newTask.startTime}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startTime: e.target.value }))}
                    disabled={newTask.isFixed && !newTask.startTime}
                    className="mt-1"
                  />
                  {!newTask.startTime && (
                    <p className="text-xs text-gray-500 mt-1">Leave empty to schedule later</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newTask.duration}
                    onChange={(e) => setNewTask(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    className="mt-1"
                    min="1"
                    step="15"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFixed"
                  checked={newTask.isFixed}
                  onCheckedChange={(checked) => setNewTask(prev => ({ ...prev, isFixed: checked }))}
                />
                <Label htmlFor="isFixed" className="text-sm">
                  Fixed time (cannot be rescheduled)
                </Label>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center space-x-2">
              <Switch
                id="important"
                checked={newTask.important}
                onCheckedChange={(checked) => setNewTask(prev => ({ ...prev, important: checked }))}
              />
              <Star className={`h-4 w-4 ${newTask.important ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
              <Label htmlFor="important" className="text-sm">
                Mark as important
              </Label>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newTask.notes}
                onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes..."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button 
                type="submit" 
                className="flex-1"
                style={{ backgroundColor: selectedList?.color }}
                disabled={!newTask.title.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}