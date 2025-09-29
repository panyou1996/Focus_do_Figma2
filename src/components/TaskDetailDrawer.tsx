import React, { useState } from "react";
import { Star, Check, Clock, Calendar, FileText, Trash2, Edit3 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
}

interface TaskDetailDrawerProps {
  task: Task;
  taskList: TaskList;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskDetailDrawer({
  task,
  taskList,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const formatTime = (timeString: string) => {
    if (!timeString) return "Not set";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const toggleCompletion = () => {
    const updatedTask = { ...task, completed: !task.completed };
    onUpdate(updatedTask);
  };

  const toggleImportance = () => {
    const updatedTask = { ...task, important: !task.important };
    onUpdate(updatedTask);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const isOverdue = !task.completed && task.dueDate < new Date();

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
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden"
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
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-medium">Task Details</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[60vh]">
          <div className="space-y-6">
            {/* Task Status & Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleCompletion}
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center
                  ${task.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-500'
                  }
                `}
              >
                {task.completed && <Check className="h-4 w-4" />}
              </button>
              
              <button
                onClick={toggleImportance}
                className={`p-2 rounded ${task.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                <Star className={`h-5 w-5 ${task.important ? 'fill-current' : ''}`} />
              </button>

              <div className="flex gap-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${taskList.color}20`,
                    color: taskList.color
                  }}
                >
                  {taskList.icon} {taskList.name}
                </Badge>
                
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
                
                {task.important && (
                  <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Important
                  </Badge>
                )}

                {task.isFixed && (
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                    Fixed Time
                  </Badge>
                )}
              </div>
            </div>

            {/* Task Title & Description */}
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h2>
                  {task.description && (
                    <p className={`text-gray-600 mt-2 ${task.completed ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Time & Duration */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={editedTask.startTime}
                        onChange={(e) => setEditedTask({ ...editedTask, startTime: e.target.value })}
                        disabled={editedTask.isFixed}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (min)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={editedTask.duration}
                        onChange={(e) => setEditedTask({ ...editedTask, duration: parseInt(e.target.value) || 0 })}
                        className="mt-1"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFixed"
                      checked={editedTask.isFixed}
                      onCheckedChange={(checked) => setEditedTask({ ...editedTask, isFixed: checked })}
                    />
                    <Label htmlFor="isFixed">Fixed time (cannot be rescheduled)</Label>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Schedule</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Start Time:</span>
                      <div>{formatTime(task.startTime)}</div>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <div>{formatDuration(task.duration)}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Due Date:</span> {formatDate(task.dueDate)}
                  </div>
                </>
              )}
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Notes</span>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedTask.notes}
                  onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
                  placeholder="Add notes..."
                  rows={4}
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                  {task.notes ? (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.notes}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No notes added</p>
                  )}
                </div>
              )}
            </div>

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Check className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Subtasks</span>
                  <Badge variant="secondary" className="text-xs">
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`
                        w-4 h-4 rounded border-2 flex items-center justify-center
                        ${subtask.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300'
                        }
                      `}>
                        {subtask.completed && <Check className="h-2.5 w-2.5" />}
                      </div>
                      <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}