import React from "react";
import { Star, Check, Inbox, Trash2, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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
}

interface TaskList {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface RecommendedInboxDrawerProps {
  tasks: Task[];
  taskLists: TaskList[];
  onClose: () => void;
  onTaskClick: (task: Task) => void;
  onToggleCompletion: (taskId: number | string) => void;
  onToggleImportance: (taskId: number | string) => void;
  onAddToMyDay: (taskId: number | string) => void;
  onDeleteTask: (taskId: number | string) => void;
}

export default function RecommendedInboxDrawer({
  tasks,
  taskLists,
  onClose,
  onTaskClick,
  onToggleCompletion,
  onToggleImportance,
  onAddToMyDay,
  onDeleteTask,
}: RecommendedInboxDrawerProps) {
  const [deleteConfirmTask, setDeleteConfirmTask] = React.useState<Task | null>(null);
  const [addToMyDayConfirmTask, setAddToMyDayConfirmTask] = React.useState<Task | null>(null);
  const getTaskList = (listId: number) => {
    return taskLists.find(list => list.id === listId);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Not set";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // 检查任务是否已在Today中
  const isTaskInToday = (task: Task) => {
    const today = new Date();
    return task.dueDate.toDateString() === today.toDateString();
  };

  // 过滤掉已在Today中的任务
  const filteredTasks = tasks.filter(task => !isTaskInToday(task));

  const handleConfirmDelete = () => {
    if (deleteConfirmTask) {
      onDeleteTask(deleteConfirmTask.id);
      setDeleteConfirmTask(null);
    }
  };

  const handleConfirmAddToMyDay = () => {
    if (addToMyDayConfirmTask) {
      onAddToMyDay(addToMyDayConfirmTask.id);
      setAddToMyDayConfirmTask(null);
    }
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
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Inbox className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-medium">Recommended for Today</h1>
              <p className="text-sm text-gray-500">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} suggested
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[60vh]">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-gray-500">No recommended tasks at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => {
                const taskList = getTaskList(task.listId);
                
                return (
                  <motion.div
                    key={task.id}
                    className={`
                      bg-white border border-gray-100 rounded-lg p-4 shadow-sm
                      hover:shadow-md transition-all duration-200
                      ${task.completed ? 'opacity-60' : ''}
                    `}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompletion(task.id);
                        }}
                        className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                          ${task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-500'
                          }
                        `}
                      >
                        {task.completed && <Check className="h-3 w-3" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleImportance(task.id);
                            }}
                            className={`p-1 rounded ${task.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                          >
                            <Star className={`h-5 w-5 ${task.important ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2">
                          {taskList && (
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
                          )}
                          
                          {task.isFixed && task.startTime && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                              Fixed: {formatTime(task.startTime)}
                            </Badge>
                          )}
                          
                          <Badge variant="outline" className="text-xs">
                            {formatDuration(task.duration)}
                          </Badge>
                          
                          {task.important && (
                            <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                              <Star className="h-2.5 w-2.5 mr-1 fill-current" />
                              Important
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-gray-500">
                          {task.isFixed && task.startTime 
                            ? `Fixed appointment at ${formatTime(task.startTime)}`
                            : "Due today - add to your schedule"
                          }
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddToMyDayConfirmTask(task);
                        }}
                        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to My Day
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmTask(task);
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50 px-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmTask} onOpenChange={() => setDeleteConfirmTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除任务</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除任务"{deleteConfirmTask?.title}"吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add to My Day Confirmation Dialog */}
      <AlertDialog open={!!addToMyDayConfirmTask} onOpenChange={() => setAddToMyDayConfirmTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>添加到"My Day"</AlertDialogTitle>
            <AlertDialogDescription>
              确定要将任务"{addToMyDayConfirmTask?.title}"添加到今天的计划中吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAddToMyDay} className="bg-blue-500 hover:bg-blue-600">
              添加
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}