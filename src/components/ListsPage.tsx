import React from "react";
import { Search, Plus, ChevronLeft, Star, Check, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { AnimatePresence, motion } from "framer-motion";

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
  description: string;
}

interface ListsPageProps {
  tasks: Task[];
  taskLists: TaskList[];
  selectedListId: number | null;
  searchTerm: string;
  onTaskClick: (task: Task) => void;
  onToggleCompletion: (taskId: number) => void;
  onToggleImportance: (taskId: number) => void;
  onSearchChange: (term: string) => void;
  onListSelect: (listId: number | null) => void;
  onAddList: () => void;
  onEditList: (list: TaskList) => void;
  onDeleteList: (listId: number) => void;
}

export default function ListsPage({
  tasks,
  taskLists,
  selectedListId,
  searchTerm,
  onTaskClick,
  onToggleCompletion,
  onToggleImportance,
  onSearchChange,
  onListSelect,
  onAddList,
  onEditList,
  onDeleteList,
}: ListsPageProps) {
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
  const displayTasks = selectedListId ? getTasksForList(selectedListId).filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  const handleLongPress = (list: TaskList) => {
    onEditList(list);
  };

  const handleDelete = (listId: number) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      onDeleteList(listId);
    }
  };

  return (
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
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddList}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!selectedListId ? (
            <motion.div
              key="lists"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4">
                <div className="grid gap-3">
                  {taskLists.map((list) => {
                    const listTasks = getTasksForList(list.id);
                    const completedTasks = listTasks.filter(task => task.completed);
                    const pendingTasks = listTasks.filter(task => !task.completed);
                    const importantTasks = listTasks.filter(task => task.important && !task.completed);
                    
                    return (
                      <motion.div
                        key={list.id}
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => onListSelect(list.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleDelete(list.id);
                        }}
                        onDoubleClick={() => handleLongPress(list)}
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
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
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
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`
                            bg-white border border-gray-100 rounded-lg p-4 shadow-sm
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
                              
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs"
                                >
                                  Due: {formatDueDate(task.dueDate)}
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
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </div>
  );
}