import React from "react";
import { Star, Check, AlertTriangle, Trash2, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "./ui/drawer";
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

interface OverdueInboxDrawerProps {
  tasks: Task[];
  taskLists: TaskList[];
  onClose: () => void;
  onTaskClick: (task: Task) => void;
  onToggleCompletion: (taskId: number | string) => void;
  onToggleImportance: (taskId: number | string) => void;
  onAddToMyDay: (taskId: number | string) => void;
  onDeleteTask: (taskId: number | string) => void;
}

export default function OverdueInboxDrawer({
  tasks,
  taskLists,
  onClose,
  onTaskClick,
  onToggleCompletion,
  onToggleImportance,
  onAddToMyDay,
  onDeleteTask,
}: OverdueInboxDrawerProps) {
  const [deleteConfirmTask, setDeleteConfirmTask] = React.useState<Task | null>(null);
  const [addToMyDayConfirmTask, setAddToMyDayConfirmTask] = React.useState<Task | null>(null);
  const getTaskList = (listId: number) => {
    return taskLists.find(list => list.id === listId);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const formatOverdueDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // 过滤掉已完成的任务（overdue tasks已经由App.tsx正确过滤了）
  const filteredTasks = tasks.filter(task => !task.completed);

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
    <>
      <Drawer
        open
        onOpenChange={(isOpen) => !isOpen && onClose()}
      >
        <DrawerContent className="bg-white">
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          <DrawerHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <DrawerTitle className="text-lg font-medium">Overdue Tasks</DrawerTitle>
                <p className="text-sm text-gray-500">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} need attention
                </p>
              </div>
            </div>
          </DrawerHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 max-h-[60vh]">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-gray-500">No overdue tasks. Great job!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks
                  .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                  .map((task, index) => {
                    const taskList = getTaskList(task.listId);
                    
                    return (
                      <div
                        key={task.id}
                        className={`
                          bg-white border-l-4 border-l-red-500 border border-gray-100 rounded-lg p-4 shadow-sm
                          hover:shadow-md transition-all duration-200
                          ${task.completed ? 'opacity-60' : ''}
                        `}
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

                          <div className="flex-1" onClick={() => onTaskClick(task)}>
                            <p className={`
                              font-medium
                              ${task.completed ? 'line-through text-gray-500' : ''}
                            `}>
                              {task.title}
                            </p>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: taskList?.color || '#ccc' }}
                                ></div>
                                <span>{taskList?.name || 'Unlisted'}</span>
                              </div>
                              <span>|</span>
                              <div className="flex items-center gap-1 text-red-600 font-semibold">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{formatOverdueDate(task.dueDate)} ({getDaysOverdue(task.dueDate)})</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddToMyDayConfirmTask(task);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleImportance(task.id);
                              }}
                            >
                              <Star 
                                className={`h-4 w-4 ${task.important ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmTask(task);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <DrawerFooter>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Add to My Day Confirmation */}
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
    </>
  );
}