import React, { useState, useRef } from "react";
import { Star, Check, Inbox, AlertTriangle, Trash2, Plus, Minus, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { NativeService } from "../utils/nativeService";
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

interface TodayPageProps {
  tasks: Task[];
  taskLists: TaskList[];
  recommendedCount: number;
  overdueCount: number;
  onTaskClick: (task: Task) => void;
  onToggleCompletion: (taskId: number | string) => void;
  onToggleImportance: (taskId: number | string) => void;
  onToggleFixed: (taskId: number | string) => void;
  onOpenRecommended: () => void;
  onOpenOverdue: () => void;
  onDeleteTask: (taskId: number | string) => void;
  onAddToMyDay?: (taskId: number | string) => void;
  onRemoveFromMyDay?: (taskId: number | string) => void;
  onAddTask?: () => void;
  onOpenSettings?: () => void;
}

export default function TodayPage({
  tasks,
  taskLists,
  recommendedCount,
  overdueCount,
  onTaskClick,
  onToggleCompletion,
  onToggleImportance,
  onToggleFixed,
  onOpenRecommended,
  onOpenOverdue,
  onDeleteTask,
  onAddToMyDay,
  onRemoveFromMyDay,
  onAddTask,
  onOpenSettings,
}: TodayPageProps) {
  const [pressingTaskId, setPressingTaskId] = useState<number | null>(null);
  const taskLongPressTimerRef = useRef<number | null>(null);
  const isLongPressActivated = useRef<boolean>(false);
  
  // 滑动相关状态
  const [swipingTaskId, setSwipingTaskId] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeX, setSwipeX] = useState(0);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<Task | null>(null);
  const [myDayConfirmTask, setMyDayConfirmTask] = useState<Task | null>(null);
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const isSwipeActive = useRef(false);
  
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

  // 处理任务长按事件
  const handleTaskLongPress = async (task: Task) => {
    // 标记长按已激活
    isLongPressActivated.current = true;
    
    // 触发原生震动反馈
    await NativeService.hapticMedium();
    
    onToggleFixed(task.id);
    setPressingTaskId(null);
  };

  // 启动任务长按定时器
  const startTaskLongPressTimer = (task: Task, event: React.MouseEvent | React.TouchEvent) => {
    // 阻止默认行为，避免移动端弹出菜单
    event.preventDefault();
    
    clearTaskLongPressTimer();
    
    // 设置按压状态
    setPressingTaskId(task.id);
    
    taskLongPressTimerRef.current = window.setTimeout(() => {
      handleTaskLongPress(task);
    }, 500) as unknown as number;
  };

  // 清除任务长按定时器
  const clearTaskLongPressTimer = () => {
    if (taskLongPressTimerRef.current !== null) {
      clearTimeout(taskLongPressTimerRef.current);
      taskLongPressTimerRef.current = null;
    }
    setPressingTaskId(null);
    
    // 延迟重置长按标记，防止点击事件立即触发
    setTimeout(() => {
      isLongPressActivated.current = false;
    }, 100);
  };

  const completedTasks = tasks.filter(task => task.completed);

  // 处理任务点击事件
  const handleTaskClick = (task: Task) => {
    // 如果刚刚执行了长按或滑动，则不触发点击事件
    if (isLongPressActivated.current || isSwipeActive.current) {
      return;
    }
    onTaskClick(task);
  };

  // 滑动处理函数
  const handleSwipeStart = (task: Task, event: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    swipeStartX.current = clientX;
    swipeStartY.current = clientY;
    setSwipingTaskId(task.id);
    setSwipeX(0);
    setSwipeDirection(null);
    isSwipeActive.current = false;
  };

  const handleSwipeMove = (event: React.TouchEvent | React.MouseEvent) => {
    if (swipingTaskId === null) return;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const deltaX = clientX - swipeStartX.current;
    const deltaY = clientY - swipeStartY.current;
    
    // 检查是否为水平滑动（而非垂直滑动）
    if (Math.abs(deltaY) > Math.abs(deltaX) || Math.abs(deltaX) < 10) {
      return;
    }
    
    event.preventDefault();
    isSwipeActive.current = true;
    
    const direction = deltaX > 0 ? 'right' : 'left';
    const distance = Math.min(Math.abs(deltaX), 120); // 限制最大滑动距离
    
    setSwipeDirection(direction);
    setSwipeX(deltaX > 0 ? distance : -distance);
  };

  const handleSwipeEnd = (task: Task) => {
    if (swipingTaskId === null) return;
    
    const threshold = 60; // 触发阈值
    
    if (Math.abs(swipeX) > threshold) {
      if (swipeDirection === 'left') {
        // 左滑删除
        setDeleteConfirmTask(task);
      } else if (swipeDirection === 'right') {
        // 右滑移除MyDay（Today页面只显示MyDay任务，所以右滑总是移除）
        setMyDayConfirmTask(task);
      }
    }
    
    // 重置滑动状态
    setSwipingTaskId(null);
    setSwipeX(0);
    setSwipeDirection(null);
    
    // 延迟重置滑动标记
    setTimeout(() => {
      isSwipeActive.current = false;
    }, 100);
  };

  // 确认删除任务
  const handleConfirmDelete = () => {
    if (deleteConfirmTask) {
      onDeleteTask(deleteConfirmTask.id);
      setDeleteConfirmTask(null);
    }
  };

  // 确认MyDay操作
  const handleConfirmMyDay = (action: 'add' | 'remove') => {
    if (myDayConfirmTask) {
      if (action === 'add' && onAddToMyDay) {
        onAddToMyDay(myDayConfirmTask.id);
      } else if (action === 'remove' && onRemoveFromMyDay) {
        onRemoveFromMyDay(myDayConfirmTask.id);
      }
      setMyDayConfirmTask(null);
    }
  };

  // 检查任务是否在MyDay中
  const isTaskInMyDay = (task: Task | null) => {
    if (!task) return false;
    return task.isMyDay;
  };

  return (
    <>
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-medium">Today</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onAddTask && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddTask}
                className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}
            {onOpenSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSettings}
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Inbox Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenRecommended}
            className="flex-1 h-12 flex flex-col items-center justify-center border-blue-200 hover:bg-blue-50"
          >
            <Inbox className="h-4 w-4 text-blue-600 mb-1" />
            <div className="flex items-center gap-1">
              <span className="text-xs text-blue-600">Recommended</span>
              {recommendedCount > 0 && (
                <Badge variant="secondary" className="text-xs h-4 px-1.5 bg-blue-100 text-blue-600">
                  {recommendedCount}
                </Badge>
              )}
            </div>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenOverdue}
            className="flex-1 h-12 flex flex-col items-center justify-center border-red-200 hover:bg-red-50"
          >
            <AlertTriangle className="h-4 w-4 text-red-600 mb-1" />
            <div className="flex items-center gap-1">
              <span className="text-xs text-red-600">Overdue</span>
              {overdueCount > 0 && (
                <Badge variant="secondary" className="text-xs h-4 px-1.5 bg-red-100 text-red-600">
                  {overdueCount}
                </Badge>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-medium mb-2">All clear for today!</h3>
            <p className="text-gray-500">No tasks scheduled. Enjoy your day!</p>
          </div>
        ) : (
          <div className="p-4 space-y-2 pb-24">{/* 添加底部内边距避免被导航栏遮挡 */}
            {/* Task Timeline */}
            <div className="space-y-1">
              {tasks.map((task, index) => {
                const taskList = getTaskList(task.listId);
                const isLast = index === tasks.length - 1;
                
                return (
                  <div key={task.id} className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-12 top-16 w-0.5 bg-gray-200" 
                         style={{ height: isLast ? '0px' : '24px' }} />
                    
                    {/* 滑动操作背景 */}
                    <div className="relative overflow-hidden rounded-lg">
                      {/* 左滑删除背景 */}
                      <motion.div
                        className="absolute inset-0 bg-red-500 flex items-center justify-end pr-4"
                        initial={{ x: '100%' }}
                        animate={{ x: swipingTaskId === task.id && swipeDirection === 'left' ? '0%' : '100%' }}
                        transition={{ duration: 0.2 }}
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </motion.div>
                      
                      {/* 右滑移除MyDay背景 */}
                      <motion.div
                        className="absolute inset-0 bg-red-500 flex items-center justify-start pl-4"
                        initial={{ x: '-100%' }}
                        animate={{ x: swipingTaskId === task.id && swipeDirection === 'right' ? '0%' : '-100%' }}
                        transition={{ duration: 0.2 }}
                      >
                        <Minus className="h-5 w-5 text-white" />
                      </motion.div>

                      {/* Task Card */}
                      <motion.div 
                        className={`
                          relative bg-white border border-gray-100 rounded-lg p-4 transition-all duration-200 cursor-pointer
                          ${task.completed ? 'opacity-60' : ''}
                          ${task.isFixed 
                            ? 'shadow-md border-blue-100 bg-blue-50/30' 
                            : 'shadow-sm hover:shadow-md'
                          }
                          ${pressingTaskId === task.id ? 'ring-2 ring-blue-500 scale-95' : ''}
                        `}
                        animate={{ x: swipingTaskId === task.id ? swipeX : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={() => handleTaskClick(task)}
                        onMouseDown={(e) => {
                          startTaskLongPressTimer(task, e);
                          handleSwipeStart(task, e);
                        }}
                        onMouseMove={handleSwipeMove}
                        onMouseUp={() => {
                          clearTaskLongPressTimer();
                          handleSwipeEnd(task);
                        }}
                        onMouseLeave={() => {
                          clearTaskLongPressTimer();
                          handleSwipeEnd(task);
                        }}
                        onTouchStart={(e) => {
                          startTaskLongPressTimer(task, e);
                          handleSwipeStart(task, e);
                        }}
                        onTouchMove={handleSwipeMove}
                        onTouchEnd={() => {
                          clearTaskLongPressTimer();
                          handleSwipeEnd(task);
                        }}
                        onTouchCancel={() => {
                          clearTaskLongPressTimer();
                          handleSwipeEnd(task);
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                      <div className="flex items-start gap-4">
                        {/* Start Time */}
                        <div className="flex-shrink-0 text-center min-w-[60px]">
                          <div className={`
                            text-sm font-medium
                            ${task.isFixed ? 'text-blue-600' : 'text-gray-600'}
                            ${task.completed ? 'line-through opacity-60' : ''}
                          `}>
                            {formatTime(task.startTime)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatDuration(task.duration)}
                          </div>
                          {task.isFixed && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1" />
                          )}
                        </div>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <motion.button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await NativeService.hapticLight();
                                  onToggleImportance(task.id);
                                }}
                                className={`p-1.5 rounded-full ${task.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Star className={`h-5 w-5 ${task.important ? 'fill-current' : ''}`} />
                              </motion.button>
                              
                              <motion.button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await NativeService.hapticLight();
                                  onToggleCompletion(task.id);
                                }}
                                className={`
                                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                                  ${task.completed 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-gray-300 hover:border-green-500'
                                  }
                                `}
                                whileTap={{ scale: 0.9 }}
                                animate={{
                                  scale: task.completed ? [1, 1.1, 1] : 1,
                                  backgroundColor: task.completed ? "#10B981" : "rgba(0, 0, 0, 0)"
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <motion.div
                                  initial={false}
                                  animate={{
                                    scale: task.completed ? 1 : 0,
                                    opacity: task.completed ? 1 : 0
                                  }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <Check className="h-3 w-3" />
                                </motion.div>
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {taskList && (
                              <Badge 
                                variant="secondary" 
                                className="text-xs px-2 py-0.5"
                                style={{ 
                                  backgroundColor: `${taskList.color}20`,
                                  color: taskList.color
                                }}
                              >
                                {taskList.icon} {taskList.name}
                              </Badge>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className={`text-sm text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* 删除确认对话框 */}
    <AlertDialog open={!!deleteConfirmTask} onOpenChange={() => setDeleteConfirmTask(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除任务</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除任务“{deleteConfirmTask?.title}”吗？此操作不可撤销。
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

    {/* MyDay移除确认对话框 */}
    <AlertDialog open={!!myDayConfirmTask} onOpenChange={() => setMyDayConfirmTask(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>从"My Day"中移除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要从"My Day"中移除任务"${myDayConfirmTask?.title}"吗？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleConfirmMyDay('remove')}
            className="bg-red-500 hover:bg-red-600"
          >
            移除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}