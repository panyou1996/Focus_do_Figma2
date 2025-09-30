import React, { useState, useRef } from "react";
import { Search, Plus, Filter, Star, Check, MoreHorizontal, ArrowLeft, Trash2, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import AddListDrawer from "./AddListDrawer";
import ListEditPage from "./ListEditPage";
import { motion, AnimatePresence } from "framer-motion";
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
  description: string;
}

interface ListsPageProps {
  tasks: Task[];
  taskLists: TaskList[];
  selectedListId: number | null;
  searchTerm: string;
  onTaskClick: (task: Task) => void;
  onToggleCompletion: (taskId: number | string) => void;
  onToggleImportance: (taskId: number | string) => void;
  onToggleFixed: (taskId: number | string) => void;
  onSearchChange: (term: string) => void;
  onListSelect: (listId: number | null) => void;
  onAddList: (list: Omit<TaskList, 'id'>) => void;
  onListLongPress: (listId: number) => void;
  onUpdateList: (list: TaskList) => void;
  onDeleteList: (listId: number) => void;
  onDeleteTask: (taskId: number | string) => void;
  onAddToMyDay?: (taskId: number | string) => void;
  onRemoveFromMyDay?: (taskId: number | string) => void;
}

export default function ListsPage({
  tasks,
  taskLists,
  selectedListId,
  searchTerm,
  onTaskClick,
  onToggleCompletion,
  onToggleImportance,
  onToggleFixed,
  onSearchChange,
  onListSelect,
  onAddList,
  onListLongPress,
  onUpdateList,
  onDeleteList,
  onDeleteTask,
  onAddToMyDay,
  onRemoveFromMyDay,
}: ListsPageProps) {
  const [isAddListDrawerOpen, setIsAddListDrawerOpen] = useState(false);
  const [isEditListDrawerOpen, setIsEditListDrawerOpen] = useState(false);
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const [pressingListId, setPressingListId] = useState<number | null>(null);
  const [pressingTaskId, setPressingTaskId] = useState<number | null>(null);
  
  // 使用数字类型存储定时器ID
  const longPressTimerRef = useRef<number | null>(null);
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

  const handleAddListClick = () => {
    setIsAddListDrawerOpen(true);
  };

  const handleCloseAddListDrawer = () => {
    setIsAddListDrawerOpen(false);
  };

  // 处理长按事件
  const handleListLongPress = (list: TaskList) => {
    setEditingList(list);
    setIsEditListDrawerOpen(true);
    onListLongPress(list.id);
    setPressingListId(null);
  };

  // 启动长按定时器
  const startLongPressTimer = (list: TaskList, event: React.MouseEvent | React.TouchEvent) => {
    // 阻止默认行为，避免移动端弹出菜单
    event.preventDefault();
    
    clearLongPressTimer();
    
    // 设置按压状态
    setPressingListId(list.id);
    
    longPressTimerRef.current = window.setTimeout(() => {
      handleListLongPress(list);
    }, 500) as unknown as number;
  };

  // 清除定时器
  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setPressingListId(null);
  };

  // 处理任务长按事件
  const handleTaskLongPress = (task: Task) => {
    // 标记长按已激活
    isLongPressActivated.current = true;
    
    // 触发震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50ms 震动
    }
    
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

// 在ListsPage组件中
const handleUpdateList = (updatedList: TaskList) => {
  onUpdateList(updatedList);
  setIsEditListDrawerOpen(false);
};

const handleDeleteList = (listId: number) => {
  onDeleteList(listId);
  setIsEditListDrawerOpen(false);
  // 如果删除当前选中的列表，返回列表视图
  if (selectedListId === listId) {
    onListSelect(null);
  }
};

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
        // 右滑添加/移除MyDay
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
    if (!task || !task.dueDate) return false;
    const today = new Date();
    return task.dueDate.toDateString() === today.toDateString();
  };

  const getTaskList = (listId: number) => {
    return taskLists.find(list => list.id === listId);
  };

  const getTasksForList = (listId: number) => {
    return tasks.filter(task => task.listId === listId);
  };

  const formatDueDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const selectedList = selectedListId ? getTaskList(selectedListId) : null;
  const displayTasks = selectedListId ? tasks : [];

  return (
    <>
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-medium">
            {selectedList ? selectedList.name : "Lists"}
          </h1>
          <p className="text-sm text-gray-500">
            {selectedList 
              ? selectedList.description 
              : `${taskLists.length} lists • ${tasks.length} tasks`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedListId ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onListSelect(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddListClick}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      {selectedListId && (
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!selectedListId ? (
          /* Lists Overview */
          <div className="p-4">
            <div className="grid gap-3">
              {taskLists.map((list) => {
                const listTasks = getTasksForList(list.id);
                const completedTasks = listTasks.filter(task => task.completed);
                const pendingTasks = listTasks.filter(task => !task.completed);
                const importantTasks = listTasks.filter(task => task.important && !task.completed);
                
                return (
                  <div
                    key={list.id}
                    className={`bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                      ${pressingListId === list.id ? 'ring-2 ring-blue-500 bg-gray-50' : ''}
                    `}
                    onClick={() => onListSelect(list.id)}
                    // 传递事件对象
                    onMouseDown={(e) => startLongPressTimer(list, e)}
                    onMouseUp={clearLongPressTimer}
                    onMouseLeave={clearLongPressTimer}
                    onTouchStart={(e) => startLongPressTimer(list, e)}
                    onTouchEnd={clearLongPressTimer}
                    onTouchCancel={clearLongPressTimer}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${list.color}20` }}
                      >
                        {list.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{list.name}</h3>
                          <div className="flex items-center gap-2">
                            {importantTasks.length > 0 && (
                              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                {importantTasks.length}
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {pendingTasks.length}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{list.description}</p>
                        
                        {listTasks.length > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${(completedTasks.length / listTasks.length) * 100}%`,
                                  backgroundColor: list.color
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {completedTasks.length}/{listTasks.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Tasks in Selected List */
          <div className="p-4">
            {displayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-4">{selectedList?.icon}</div>
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-gray-500">
                  {searchTerm ? "Try a different search term" : "Add your first task to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayTasks.map((task) => {
                  const taskList = getTaskList(task.listId);
                  
                  return (
                    <div key={task.id} className="relative overflow-hidden rounded-lg">
                      {/* 滑动操作背景 */}
                      {/* 左滑删除背景 */}
                      <motion.div
                        className="absolute inset-0 bg-red-500 flex items-center justify-end pr-4"
                        initial={{ x: '100%' }}
                        animate={{ x: swipingTaskId === task.id && swipeDirection === 'left' ? '0%' : '100%' }}
                        transition={{ duration: 0.2 }}
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </motion.div>
                      
                      {/* 右滑MyDay背景 */}
                      <motion.div
                        className="absolute inset-0 bg-blue-500 flex items-center justify-start pl-4"
                        initial={{ x: '-100%' }}
                        animate={{ x: swipingTaskId === task.id && swipeDirection === 'right' ? '0%' : '-100%' }}
                        transition={{ duration: 0.2 }}
                      >
                        {isTaskInMyDay(task) ? (
                          <Minus className="h-5 w-5 text-white" />
                        ) : (
                          <Plus className="h-5 w-5 text-white" />
                        )}
                      </motion.div>

                      <motion.div
                        className={`
                          bg-white border border-gray-100 rounded-lg p-4 transition-all duration-200 cursor-pointer
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
                          
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                            >
                              {formatDueDate(task.dueDate)}
                            </Badge>
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
                          </div>
                        </div>
                      </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Task Button (when list is selected) */}
      {selectedListId && (
        <div className="p-4 border-t border-gray-100">
          <Button className="w-full" style={{ backgroundColor: selectedList?.color }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      )}

      {/* Add List Drawer */}
      {isAddListDrawerOpen && (
        <AddListDrawer 
          onClose={handleCloseAddListDrawer}
          onAddList={onAddList}
        />
      )}
      
      {/* Edit List Drawer - 修正props传递 */}
      {isEditListDrawerOpen && editingList && (
        <ListEditPage
          list={editingList}
          onClose={() => setIsEditListDrawerOpen(false)}
          onUpdateList={handleUpdateList}
          onDeleteList={handleDeleteList}
        />
      )}
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

    {/* MyDay确认对话框 */}
    <AlertDialog open={!!myDayConfirmTask} onOpenChange={() => setMyDayConfirmTask(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {myDayConfirmTask && isTaskInMyDay(myDayConfirmTask) ? '从“My Day”中移除' : '添加到“My Day”'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {myDayConfirmTask && (isTaskInMyDay(myDayConfirmTask) 
              ? `确定要从“My Day”中移除任务“${myDayConfirmTask.title}”吗？`
              : `确定要将任务“${myDayConfirmTask.title}”添加到“My Day”吗？`
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleConfirmMyDay(myDayConfirmTask && isTaskInMyDay(myDayConfirmTask) ? 'remove' : 'add')}
          >
            {myDayConfirmTask && isTaskInMyDay(myDayConfirmTask) ? '移除' : '添加'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}