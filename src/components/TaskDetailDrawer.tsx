import React, { useState } from "react";
import { Calendar, Clock, Star, Edit, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { motion } from "framer-motion";

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

interface TaskDetailDrawerProps {
  task: Task;
  taskList: TaskList;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: number | string) => void;
}

export default function TaskDetailDrawer({
  task,
  taskList,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({
    ...task,
    subtasks: task.subtasks || []
  });

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask({ ...task, subtasks: task.subtasks || [] });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (dateString: string) => {
    setEditedTask(prev => ({
      ...prev,
      dueDate: new Date(dateString)
    }));
  };

  const toggleSubtaskCompletion = (subtaskId: number) => {
    const updatedSubtasks = editedTask.subtasks?.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    ) || [];
    
    setEditedTask(prev => ({
      ...prev,
      subtasks: updatedSubtasks
    }));
    
    if (!isEditing) {
      onUpdate({ ...task, subtasks: updatedSubtasks });
    }
  };

  const addSubtask = () => {
    const newSubtask = {
      id: Date.now(),
      title: '',
      completed: false
    };
    setEditedTask(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtask]
    }));
  };

  const removeSubtask = (subtaskId: number) => {
    setEditedTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.filter(s => s.id !== subtaskId) || []
    }));
  };

  const updateSubtaskTitle = (subtaskId: number, title: string) => {
    setEditedTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.map(s =>
        s.id === subtaskId ? { ...s, title } : s
      ) || []
    }));
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

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
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium flex-1 text-center">
              {isEditing ? 'Edit Task' : 'Task Details'}
            </h1>
            {!isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <div className="p-4 pb-0">
            {isEditing ? (
              <div className="space-y-4">
                {/* Title with Important icon */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditedTask(prev => ({ ...prev, important: !prev.important }))}
                    className={`p-2 rounded ${editedTask.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                  >
                    <Star className={`h-5 w-5 ${editedTask.important ? 'fill-current' : ''}`} />
                  </button>
                  <div className="flex-1">
                    <Input
                      value={editedTask.title}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Task title"
                      className="text-lg font-medium border-none shadow-none px-0 focus-visible:ring-0"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label className="text-sm text-gray-600">Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={editedTask.duration}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    className="mt-1"
                  />
                </div>

                {/* Fixed Time Toggle and Due Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editedTask.isFixed}
                      onCheckedChange={(checked) => setEditedTask(prev => ({ ...prev, isFixed: checked }))}
                    />
                    <Label className="text-sm text-gray-600">Fixed Time</Label>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Due Date</Label>
                    <Input
                      type="date"
                      value={formatDateForInput(editedTask.dueDate)}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <Label className="text-sm text-gray-600">Start Time</Label>
                  <Input
                    type="time"
                    value={editedTask.startTime}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, startTime: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label className="text-sm text-gray-600">Notes</Label>
                  <Textarea
                    value={editedTask.notes}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* Subtasks */}
                <div>
                  <Label className="text-sm text-gray-600">Subtasks</Label>
                  <div className="mt-1 space-y-2">
                    {editedTask.subtasks?.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtaskCompletion(subtask.id)}
                          className="w-4 h-4 rounded"
                        />
                        <Input
                          value={subtask.title}
                          onChange={(e) => updateSubtaskTitle(subtask.id, e.target.value)}
                          placeholder="Subtask..."
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubtask(subtask.id)}
                          className="text-red-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSubtask}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subtask
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Task Title and Status */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onUpdate({ ...task, completed: !task.completed })}
                    className="w-5 h-5 mt-1 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h2>
                      {task.important && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>

                {/* Task Info */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: taskList.color }}
                    />
                    <span className="font-medium">{taskList.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(task.dueDate)}</span>
                    {task.startTime && (
                      <>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{task.startTime}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(task.duration)}</span>
                    {task.isFixed && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        Fixed
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {task.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Notes</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{task.notes}</p>
                  </div>
                )}

                {/* Subtasks */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Subtasks</h3>
                    <div className="space-y-2">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => toggleSubtaskCompletion(subtask.id)}
                            className="w-5 h-5 rounded"
                          />
                          <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fixed bottom buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
            {isEditing ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  style={{ backgroundColor: taskList.color }}
                  disabled={!editedTask.title.trim()}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={onClose} variant="outline" className="w-full">
                Close
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}