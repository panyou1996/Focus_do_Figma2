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
      onOpenChange={(isOpen: boolean) => !isOpen && onClose()}
    >
      <DrawerContent className="bg-white">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <DrawerHeader className="text-center">
          <DrawerTitle>Add New Task</DrawerTitle>
        </DrawerHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Title Input */}
          <div className="px-4 pb-4">
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
          </div>

          {/* Task List */}
          <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
            <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">Task List</p>
            <div className="shrink-0">
              <Select
                value={newTask.listId.toString()}
                onValueChange={(value: string) => setNewTask(prev => ({ ...prev, listId: parseInt(value) }))}
              >
                <SelectTrigger className="border-none shadow-none focus:ring-0 bg-white">
                  <SelectValue>
                    {selectedList && (
                      <span className="text-[#111418] text-base font-normal leading-normal">{selectedList.name}</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
          </div>

          {/* Duration */}
          <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
            <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">Duration</p>
            <div className="shrink-0 flex items-center gap-1">
              <Input
                type="number"
                value={newTask.duration}
                onChange={(e) => setNewTask(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                className="border-none shadow-none focus-visible:ring-0 text-right w-16"
                placeholder="60"
              />
              <span className="text-[#111418] text-base font-normal leading-normal">min</span>
            </div>
          </div>

          {/* Fixed Time */}
          <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
            <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">Fixed Time</p>
            <div className="shrink-0">
              <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#f0f2f4] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#1172d4]">
                <div className="h-full w-[27px] rounded-full bg-white" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px'}}></div>
                <input 
                  type="checkbox" 
                  className="invisible absolute"
                  checked={newTask.isFixed}
                  onChange={(e) => setNewTask(prev => ({ ...prev, isFixed: e.target.checked }))}
                />
              </label>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
            <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">Due Date</p>
            <div className="shrink-0">
              <Input
                type="date"
                value={formatDateForInput(newTask.dueDate)}
                onChange={(e) => handleDateChange(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0 text-right cursor-pointer"
              />
            </div>
          </div>

          {/* Start Time */}
          <div className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
            <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">Start Time</p>
            <div className="shrink-0 flex items-center gap-1">
              <Input
                type="date"
                value={formatDateForInput(newTask.startDate)}
                onChange={(e) => setNewTask(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                className="border-none shadow-none focus-visible:ring-0 text-right w-24 cursor-pointer"
              />
              <Input
                type="time"
                value={newTask.startTime}
                onChange={(e) => setNewTask(prev => ({ ...prev, startTime: e.target.value }))}
                className="border-none shadow-none focus-visible:ring-0 text-right w-16 cursor-pointer"
                placeholder="10:00"
              />
            </div>
          </div>

          {/* Subtasks */}
          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Subtasks</h3>
            <Button
              type="button"
              variant="ghost"
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
              className="w-8 h-8 p-0 text-blue-500 hover:text-blue-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {newTask.subtasks.map((subtask, index) => (
            <div key={subtask.id} className="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
              <Input
                value={subtask.title}
                onChange={(e) => {
                  const updatedSubtasks = [...newTask.subtasks];
                  updatedSubtasks[index] = { ...subtask, title: e.target.value };
                  setNewTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
                }}
                placeholder={`Subtask ${index + 1}`}
                className="text-[#111418] text-base font-normal leading-normal flex-1 truncate border-none shadow-none focus-visible:ring-0"
              />
              <div className="shrink-0 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) => {
                      const updatedSubtasks = [...newTask.subtasks];
                      updatedSubtasks[index] = { ...subtask, completed: e.target.checked };
                      setNewTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
                    }}
                    className="h-5 w-5 rounded border-[#dbe0e6] border-2 bg-transparent text-[#1172d4] checked:bg-[#1172d4] checked:border-[#1172d4] focus:ring-0 focus:ring-offset-0 focus:border-[#dbe0e6] focus:outline-none"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updatedSubtasks = newTask.subtasks.filter((_, i) => i !== index);
                    setNewTask(prev => ({ ...prev, subtasks: updatedSubtasks }));
                  }}
                  className="text-red-500 w-6 h-6 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
          ))}

          {/* Notes */}
          <div className="px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111418] text-base font-medium leading-normal pb-2">Notes</p>
              <Textarea
                value={newTask.notes}
                onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] min-h-36 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                placeholder="Add any additional notes..."
              />
            </label>
          </div>
          
          {/* Fixed bottom buttons */}
          <DrawerFooter>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1"
                style={{ backgroundColor: selectedList?.color }}
                disabled={!newTask.title.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}