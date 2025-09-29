import React from "react";
import { Star, Check, Inbox } from "lucide-react";
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

interface RecommendedInboxDrawerProps {
  tasks: Task[];
  taskLists: TaskList[];
  onClose: () => void;
  onTaskClick: (task: Task) => void;
  onToggleCompletion: (taskId: number) => void;
  onToggleImportance: (taskId: number) => void;
}

export default function RecommendedInboxDrawer({
  tasks,
  taskLists,
  onClose,
  onTaskClick,
  onToggleCompletion,
  onToggleImportance,
}: RecommendedInboxDrawerProps) {
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
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} suggested
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[60vh]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-gray-500">No recommended tasks at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const taskList = getTaskList(task.listId);
                
                return (
                  <motion.div
                    key={task.id}
                    className={`
                      bg-white border border-gray-100 rounded-lg p-4 shadow-sm
                      hover:shadow-md transition-all duration-200 cursor-pointer
                      ${task.completed ? 'opacity-60' : ''}
                    `}
                    onClick={() => onTaskClick(task)}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
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
                            <Star className={`h-4 w-4 ${task.important ? 'fill-current' : ''}`} />
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
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}