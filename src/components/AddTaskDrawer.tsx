import React, { useState } from "react";
import { Plus, Calendar, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "./ui/drawer";

interface Task {
  id: number | string;
  title: string;
  description: string;
  listId: number;
  dueDate: Date;
  startTime: string;
  duration: number;
  isFixed: boolean;
  completed: boolean;
  important: boolean;
  isMyDay: boolean;
  addedToMyDayAt?: Date;
  notes: string;
  subtasks?: Array<{
    id: number;
    title: string;
    completed: boolean;
  }>;
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
    listId: taskLists[0]?.id || 1,
    dueDate: initialDueDate || new Date(),
    startTime: "",
    startDate: initialDueDate || new Date(), // 恢复startDate字段，这是关键功能
    duration: 60,
    isFixed: false,
    completed: false,
    important: false,
    isMyDay: false, // 新增：默认不在MyDay中
    notes: "",
    subtasks: [] as Array<{
      id: number;
      title: string;
      completed: boolean;
    }>
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;
    
    onAddTask({
      ...newTask,
      title: newTask.title.trim(),
      description: "", // Remove description field
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
    <Drawer
      open
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DrawerContent className="bg-white">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <DrawerHeader>
          <DrawerTitle>Add New Task</DrawerTitle>
        </DrawerHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <div className="p-4 pb-0">
            <div className="space-y-4">
              {/* Title with Important icon */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewTask(prev => ({ ...prev, important: !prev.important }))}
                  className={`p-2 rounded ${newTask.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                  <Star className={`h-5 w-5 ${newTask.important ? 'fill-current' : ''}`} />
                </button>
                <div className="flex-1">
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What needs to be done?"
                    className="text-lg font-medium border-none shadow-none px-0 focus-visible:ring-0"
                    required
                  />
                </div>
              </div>

              {/* List and Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-600">List</Label>
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
                <div>
                  <Label className="text-sm text-gray-600">Duration (min)</Label>
                  <Input
                    type="number"
                    value={newTask.duration}
                    onChange={(e) => setNewTask(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Fixed Time Toggle and Due Day */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFixed"
                    checked={newTask.isFixed}
                    onCheckedChange={(checked) => setNewTask(prev => ({ ...prev, isFixed: checked }))}
                  />
                  <Label htmlFor="isFixed" className="text-sm text-gray-600">
                    Fixed Time
                  </Label>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Due Date</Label>
                  <Input
                    type="date"
                    value={formatDateForInput(newTask.dueDate)}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Start Time (Date + Time) */}
              <div>
                <Label className="text-sm text-gray-600">Start Time</Label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <Input
                    type="date"
                    value={formatDateForInput(newTask.startDate)}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  />
                  <Input
                    type="time"
                    value={newTask.startTime}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startTime: e.target.value }))}
                    placeholder="--:--"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-sm text-gray-600">Notes</Label>
                <Textarea
                  value={newTask.notes}
                  onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes..."
                  className="mt-1"
                  rows={2}
                />
              </div>

              {/* Subtasks */}
              <div>
                <Label className="text-sm text-gray-600">Subtasks</Label>
                <div className="mt-1 space-y-2">
                  {newTask.subtasks.map((subtask, index) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) => {
                          const updatedSubtasks = [...newTask.subtasks];
                          updatedSubtasks[index] = { ...subtask, completed: e.target.checked };
                          setNewTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <Input
                        value={subtask.title}
                        onChange={(e) => {
                          const updatedSubtasks = [...newTask.subtasks];
                          updatedSubtasks[index] = { ...subtask, title: e.target.value };
                          setNewTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
                        }}
                        placeholder="Subtask..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedSubtasks = newTask.subtasks.filter((_, i) => i !== index);
                          setNewTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
                        }}
                        className="text-red-500"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newSubtask = {
                        id: Date.now(),
                        title: '',
                        completed: false
                      };
                      setNewTask(prev => ({ 
                        ...prev, 
                        subtasks: [...prev.subtasks, newSubtask] 
                      }));
                    }}
                    className="w-full"
                  >
                    + Add Subtask
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fixed bottom buttons */}
          <DrawerFooter>
            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit}
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
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}