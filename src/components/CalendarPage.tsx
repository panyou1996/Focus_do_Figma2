import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Star, Check, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";

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



interface CalendarPageProps {
  tasks: Task[];
  taskLists: TaskList[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onToggleCompletion: (taskId: number | string) => void;
  onToggleImportance: (taskId: number | string) => void;
  onAddTask?: (dueDate: Date) => void;
}

export default function CalendarPage({
  tasks,
  taskLists,
  selectedDate,
  onDateSelect,
  onTaskClick,
  onToggleCompletion,
  onToggleImportance,
  onAddTask,
}: CalendarPageProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const getTaskList = (listId: number) => {
    return taskLists.find(list => list.id === listId);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate.toDateString() === date.toDateString()
    );
  };

  const getSelectedDateTasks = () => {
    return getTasksForDate(selectedDate).sort((a, b) => {
      // If both have start times, sort by time
      if (a.startTime && b.startTime) {
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        const minutesA = timeA[0] * 60 + timeA[1];
        const minutesB = timeB[0] * 60 + timeB[1];
        return minutesA - minutesB;
      }
      // Fixed tasks with start time come first
      if (a.isFixed && a.startTime && (!b.isFixed || !b.startTime)) {
        return -1;
      }
      if (b.isFixed && b.startTime && (!a.isFixed || !a.startTime)) {
        return 1;
      }
      // Tasks with start time come before those without
      if (a.startTime && !b.startTime) {
        return -1;
      }
      if (b.startTime && !a.startTime) {
        return 1;
      }
      // Then by importance
      if (a.important !== b.important) {
        return b.important ? 1 : -1;
      }
      return 0;
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Not set";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDateHeader = (date: Date) => {
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

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Previous month days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getCurrentWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const handleLongPress = (date: Date, event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    if (onAddTask) {
      onAddTask(date);
    }
  };

  const handleTouchStart = (date: Date) => {
    const timer = setTimeout(() => {
      handleLongPress(date, {} as React.TouchEvent);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };

  const calendarDays = generateCalendarDays();
  const selectedDateTasks = getSelectedDateTasks();

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-medium">Calendar</h1>
          <p className="text-sm text-gray-500">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-center p-4 border-b border-gray-100 relative">
        <AnimatePresence>
          {isCalendarExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
          className="flex items-center gap-2 text-gray-600"
        >
          <h2 className="font-medium">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          {isCalendarExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        <AnimatePresence>
          {isCalendarExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Compact Week View / Expandable Calendar */}
        <div className="border-b border-gray-100">
          {!isCalendarExpanded ? (
            /* Compact Week View */
            <div className="p-4">
              
              
              <div className="grid grid-cols-7 gap-2">
                {getCurrentWeekDays().map((date, index) => {
                  const dayTasks = getTasksForDate(date);
                  const importantTasks = dayTasks.filter(task => task.important && !task.completed);
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => onDateSelect(date)}
                      onTouchStart={() => handleTouchStart(date)}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={() => handleTouchStart(date)}
                      onMouseUp={handleTouchEnd}
                      onMouseLeave={handleTouchEnd}
                      className={`
                        relative p-3 rounded-xl transition-all duration-200 min-h-[60px]
                        ${isSelected 
                          ? 'bg-blue-500 text-white shadow-lg' 
                          : 'hover:bg-gray-100'
                        }
                        ${isToday && !isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-black-500 mb-1 py-0">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
                        </span>
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
                          {date.getDate()}
                        </span>
                        {dayTasks.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-wrap gap-0.3 justify-center">
                            {Array.from({ length: Math.min(dayTasks.length, 6) }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  importantTasks.length > 0 && i <importantTasks.length
                                    ? (isSelected ? 'bg-yellow-500' : 'bg-yellow-500')
                                    : (isSelected ? 'bg-white/70' : 'bg-gray-400')
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Full Calendar View */
            <AnimatePresence>
              <motion.div
                initial={{ height: 60 }}
                animate={{ height: "auto" }}
                exit={{ height: 60 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4">


                  {/* Week headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((dayInfo, index) => {
                      const dayTasks = getTasksForDate(dayInfo.date);
                      const importantTasks = dayTasks.filter(task => task.important && !task.completed);
                      const isSelected = dayInfo.date.toDateString() === selectedDate.toDateString();
                      const isToday = dayInfo.date.toDateString() === new Date().toDateString();

                      return (
                        <button
                          key={index}
                          onClick={() => onDateSelect(dayInfo.date)}
                          onTouchStart={() => handleTouchStart(dayInfo.date)}
                          onTouchEnd={handleTouchEnd}
                          onMouseDown={() => handleTouchStart(dayInfo.date)}
                          onMouseUp={handleTouchEnd}
                          onMouseLeave={handleTouchEnd}
                          className={`
                            relative aspect-square p-0 text-sm rounded-lg transition-all duration-200 min-h-[40px] flex flex-col items-center justify-start
                            ${isSelected 
                              ? 'bg-blue-500 text-white' 
                              : 'hover:bg-gray-100'
                            }
                            ${!dayInfo.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                            ${isToday && !isSelected ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                          `}
                        >
                          <span className="mt-1">{dayInfo.day}</span>
                          {dayTasks.length > 0 && (
                            <div className="flex flex-wrap gap-px justify-center mt-1 w-full px-1">
                              {Array.from({ length: Math.min(dayTasks.length, 8) }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    importantTasks.length > 0 && i <importantTasks.length
                                      ? (isSelected ? 'bg-yellow-500' : 'bg-yellow-500')
                                      : (isSelected ? 'bg-white/70' : 'bg-gray-400')
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Selected Date Tasks */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">

            {selectedDateTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No tasks for this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => {
                  const taskList = getTaskList(task.listId);
                  
                  return (
                    <div
                      key={task.id}
                      className={`
                        bg-white border border-gray-100 rounded-lg p-3 shadow-sm
                        hover:shadow-md transition-all duration-200 cursor-pointer
                        ${task.completed ? 'opacity-60' : ''}
                      `}
                      onClick={() => onTaskClick(task)}
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
                            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleImportance(task.id);
                              }}
                              className={`p-1 rounded ${task.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                            >
                              <Star className={`h-4 w-4 ${task.important ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>{formatTime(task.startTime)}</span>
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
                          
                          {task.description && (
                            <p className={`text-sm text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
