import React from "react";
import { Star, Check, Inbox, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

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
}

interface TodayPageProps {
  tasks: Task[];
  taskLists: TaskList[];
  recommendedCount: number;
  overdueCount: number;
  onTaskClick: (task: Task) => void;
  onToggleCompletion: (taskId: number) => void;
  onToggleImportance: (taskId: number) => void;
  onOpenRecommended: () => void;
  onOpenOverdue: () => void;
}

export default function TodayPage({
  tasks,
  taskLists,
  recommendedCount,
  overdueCount,
  onTaskClick,
  onToggleCompletion,
  onToggleImportance,
  onOpenRecommended,
  onOpenOverdue,
}: TodayPageProps) {
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

  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
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
          <div className="p-4 space-y-2">
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
                    
                    {/* Task Card */}
                    <motion.div 
                      className={`
                        relative bg-white border border-gray-100 rounded-lg p-4 shadow-sm
                        hover:shadow-md transition-all duration-200 cursor-pointer
                        ${task.completed ? 'opacity-60' : ''}
                      `}
                      onClick={() => onTaskClick(task)}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleImportance(task.id);
                                }}
                                className={`p-1.5 rounded-full ${task.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Star className={`h-5 w-5 ${task.important ? 'fill-current' : ''}`} />
                              </motion.button>
                              
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleCompletion(task.id);
                                }}
                                className={`
                                  w-7 h-7 rounded-full border-2 flex items-center justify-center
                                  ${task.completed 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-gray-300 hover:border-green-500'
                                  }
                                `}
                                whileTap={{ scale: 0.9 }}
                                animate={{
                                  scale: task.completed ? [1, 1.1, 1] : 1,
                                  backgroundColor: task.completed ? "#10B981" : "transparent"
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
                                  <Check className="h-4 w-4" />
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
                            
                            {task.important && (
                              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                                <Star className="h-2.5 w-2.5 mr-1 fill-current" />
                                Important
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
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}