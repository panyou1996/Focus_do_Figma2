import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner@2.0.3";

// Import all page components
import AuthPage from "./components/AuthPage";
import OnboardingPage from "./components/OnboardingPage";
import TodayPage from "./components/TodayPage";
import ListsPage from "./components/ListsPage";
import CalendarPage from "./components/CalendarPage";
import ReviewPage from "./components/ReviewPage";
import TaskDetailDrawer from "./components/TaskDetailDrawer";
import RecommendedInboxDrawer from "./components/RecommendedInboxDrawer";
import OverdueInboxDrawer from "./components/OverdueInboxDrawer";
import AddTaskDrawer from "./components/AddTaskDrawer";
import BottomNavbar from "./components/BottomNavbar";
import FloatingActionButton from "./components/FloatingActionButton";
import PullToRefresh from "./components/PullToRefresh";
import ListEditPage from "./components/ListEditPage";
import ListEdit from "./components/ListEdit";
import SvgIcon from "./components/shared/SvgIcon";
import SvgIcon from "./components/shared/SvgIcon";

// Import data service
import {
  dataService,
  Task,
  User,
  TaskList,
} from "./utils/dataService";

import svgPaths from "./imports/svg-42raqsyfh4";

import svgPaths from "./imports/svg-42raqsyfh4";

// Enhanced task data with new structure
const TASK_LISTS = [
  {
    id: 1,
    name: "Work",
    icon: "💼",
    color: "#3B82F6",
    description: "Professional tasks and projects",
  },
  {
    id: 2,
    name: "Personal",
    icon: "🏠",
    color: "#10B981",
    description: "Personal goals and activities",
  },
  {
    id: 3,
    name: "Health",
    icon: "🏃",
    color: "#F59E0B",
    description: "Fitness and wellness tasks",
  },
  {
    id: 4,
    name: "Learning",
    icon: "📚",
    color: "#8B5CF6",
    description: "Education and skill development",
  },
  {
    id: 5,
    name: "Shopping",
    icon: "🛒",
    color: "#EF4444",
    description: "Items to buy and errands",
  },
];

const TASKS = [
  {
    id: 1,
    title: "Complete project proposal",
    description:
      "Finish the Q1 marketing proposal for client review",
    listId: 1,
    dueDate: new Date(),
    startTime: "09:00",
    duration: 120, // 2 hours
    isFixed: true,
    completed: false,
    important: true,
    notes: "Include budget breakdown and timeline",
    subtasks: [
      {
        id: 101,
        title: "Research market trends",
        completed: true,
      },
      {
        id: 102,
        title: "Create budget outline",
        completed: false,
      },
      { id: 103, title: "Draft timeline", completed: false },
    ],
  },
  {
    id: 2,
    title: "Team standup meeting",
    description: "Daily sync with development team",
    listId: 1,
    dueDate: new Date(),
    startTime: "10:30",
    duration: 30,
    isFixed: true,
    completed: true,
    important: false,
    notes: "Discuss sprint progress and blockers",
  },
  {
    id: 3,
    title: "Review code changes",
    description: "Review pull requests from team members",
    listId: 1,
    dueDate: new Date(),
    startTime: "14:00",
    duration: 60,
    isFixed: false,
    completed: false,
    important: false,
    notes: "",
  },
  {
    id: 4,
    title: "Grocery shopping",
    description: "Buy ingredients for dinner party",
    listId: 5,
    dueDate: new Date(),
    startTime: "",
    duration: 90,
    isFixed: false,
    completed: false,
    important: false,
    notes: "Don't forget wine and dessert",
  },
  {
    id: 5,
    title: "Morning workout",
    description: "30-minute cardio session",
    listId: 3,
    dueDate: new Date(),
    startTime: "07:00",
    duration: 30,
    isFixed: true,
    completed: true,
    important: false,
    notes: "Focus on interval training",
  },
  {
    id: 6,
    title: "Read chapter 5",
    description: "Continue reading 'Atomic Habits'",
    listId: 4,
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    startTime: "",
    duration: 45,
    isFixed: false,
    completed: false,
    important: false,
    notes: "Take notes on key concepts",
  },
  {
    id: 7,
    title: "Plan weekend trip",
    description:
      "Research hotels and activities for San Francisco",
    listId: 2,
    dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
    startTime: "",
    duration: 60,
    isFixed: false,
    completed: false,
    important: true,
    notes: "Check weather forecast",
  },
  {
    id: 8,
    title: "Doctor appointment",
    description: "Annual checkup with Dr. Smith",
    listId: 3,
    dueDate: new Date(Date.now() + 259200000), // 3 days from now
    startTime: "11:00",
    duration: 60,
    isFixed: true,
    completed: false,
    important: true,
    notes: "Bring insurance card and medication list",
  },
  {
    id: 9,
    title: "Call mom",
    description: "Weekly check-in call with family",
    listId: 2,
    dueDate: new Date(Date.now() - 86400000), // Yesterday - overdue
    startTime: "",
    duration: 30,
    isFixed: false,
    completed: false,
    important: false,
    notes: "Ask about dad's birthday plans",
  },
  {
    id: 10,
    title: "Prepare presentation",
    description: "Create slides for quarterly review",
    listId: 1,
    dueDate: new Date(Date.now() + 432000000), // 5 days from now
    startTime: "",
    duration: 180,
    isFixed: false,
    completed: false,
    important: true,
    notes: "Include metrics and achievements",
  },
  {
    id: 11,
    title: "Submit expense report",
    description: "Monthly business expenses",
    listId: 1,
    dueDate: new Date(Date.now() - 172800000), // 2 days ago - overdue
    startTime: "",
    duration: 30,
    isFixed: false,
    completed: false,
    important: false,
    notes: "Include all receipts",
  },
];

type ViewMode = "today" | "lists" | "calendar" | "review";
type PageMode = ViewMode | "editList";
type DrawerMode =
  | "taskDetail"
  | "recommended"
  | "overdue"
  | "addTask"
  | null;

export default function App() {
  // Authentication and user state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // App state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>(TASK_LISTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedListId, setSelectedListId] = useState<
    number | null
  >(null);
  const [viewMode, setViewMode] = useState<ViewMode>("today");
  const [drawerMode, setDrawerMode] =
    useState<DrawerMode>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(
    null,
  );

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const currentUser = dataService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        setShowOnboarding(!currentUser.onboarding_completed);
        await loadTasks();
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const userTasks = await dataService.getTasks();
      setTasks(userTasks);
      setLastSyncTime(dataService.getLastSyncTime());
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  // Authentication handlers
  const handleAuthSuccess = async (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowOnboarding(!userData.onboarding_completed);
    await loadTasks();
  };

  const handleOnboardingComplete = async () => {
    if (user) {
      await dataService.updateProfile({
        onboarding_completed: true,
      });
      setShowOnboarding(false);
    }
  };

  const handleSignOut = () => {
    dataService.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setTasks([]);
    setShowOnboarding(false);
    setViewMode("today");
    setDrawerMode(null);
    setSelectedTask(null);
  };

  // Pull to refresh handler
  const handleRefresh = async (): Promise<void> => {
    if (!isAuthenticated) return;

    setIsRefreshing(true);
    try {
      await dataService.syncData();
      await loadTasks();
      toast.success("Refreshed successfully");
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper functions
  const getTaskList = (listId: number) => {
    return taskLists.find((list) => list.id === listId);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) =>
        task.dueDate.toDateString() === date.toDateString(),
    );
  };

  const getTodayTasks = () => {
    const today = new Date();
    return tasks
      .filter(
        (task) =>
          task.dueDate.toDateString() === today.toDateString(),
      )
      .sort((a, b) => {
        // If both have start times, sort by time
        if (a.startTime && b.startTime) {
          const timeA = a.startTime.split(":").map(Number);
          const timeB = b.startTime.split(":").map(Number);
          const minutesA = timeA[0] * 60 + timeA[1];
          const minutesB = timeB[0] * 60 + timeB[1];
          return minutesA - minutesB;
        }
        // Fixed tasks with start time come first
        if (
          a.isFixed &&
          a.startTime &&
          (!b.isFixed || !b.startTime)
        ) {
          return -1;
        }
        if (
          b.isFixed &&
          b.startTime &&
          (!a.isFixed || !a.startTime)
        ) {
          return 1;
        }
        // Then by importance
        if (a.important !== b.important) {
          return b.important ? 1 : -1;
        }
        return 0;
      });
  };

  const getRecommendedTasks = () => {
    const today = new Date();
    return tasks.filter((task) => {
      // Tasks due today that aren't already scheduled for today
      const isDueToday =
        task.dueDate.toDateString() === today.toDateString();
      // Fixed tasks with start time today that aren't in today's view
      const isFixedToday =
        task.isFixed &&
        task.startTime &&
        task.dueDate.toDateString() === today.toDateString();

      return (isDueToday || isFixedToday) && !task.completed;
    });
  };

  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      // Tasks with due date before today
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);

      return taskDate < today && !task.completed;
    });
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (selectedListId) {
      filtered = filtered.filter(
        (task) => task.listId === selectedListId,
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          task.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  };

  const toggleTaskCompletion = async (
    taskId: number | string,
  ) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updatedTask = await dataService.updateTask(taskId, {
        completed: !task.completed,
      });

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? updatedTask : t,
        ),
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task");
    }
  };

  const toggleTaskImportance = async (
    taskId: number | string,
  ) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updatedTask = await dataService.updateTask(taskId, {
        important: !task.important,
      });

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? updatedTask : t,
        ),
      );
    } catch (error) {
      console.error("Error toggling task importance:", error);
      toast.error("Failed to update task");
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const result = await dataService.updateTask(
        updatedTask.id,
        updatedTask,
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? result : task,
        ),
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const addTask = async (newTask: Omit<Task, "id">) => {
    try {
      const task = await dataService.createTask(newTask);
      setTasks((prevTasks) => [...prevTasks, task]);
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const deleteTask = async (taskId: number | string) => {
    try {
      await dataService.deleteTask(taskId);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId),
      );
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleAddTaskForDate = (dueDate: Date) => {
    setSelectedDate(dueDate);
    setDrawerMode("addTask");
  };

const addList = (newList: Omit<TaskList, "id">) => {
    const listWithId = { ...newList, id: Date.now() };
    setTaskLists((prevLists) => [...prevLists, listWithId]);
    toast.success("List created successfully");
  };

  // Navigation handlers
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDrawerMode("taskDetail");
  };

  const handleCloseDrawer = () => {
    setDrawerMode(null);
    setSelectedTask(null);
  };

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
    setDrawerMode(null);
    setSelectedTask(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3,
  };

  // Render current view based on viewMode
  const renderCurrentView = () => {
    const viewProps = {
      initial: "initial",
      animate: "in",
      exit: "out",
      variants: pageVariants,
      transition: pageTransition,
      className: "h-full",
    };

    switch (viewMode) {
      case "today":
        return (
          <motion.div key="today" {...viewProps}>
            <TodayPage
              tasks={getTodayTasks()}
              taskLists={taskLists}
              recommendedCount={getRecommendedTasks().length}
              overdueCount={getOverdueTasks().length}
              onTaskClick={handleTaskClick}
              onToggleCompletion={toggleTaskCompletion}
              onToggleImportance={toggleTaskImportance}
              onOpenRecommended={() =>
                setDrawerMode("recommended")
              }
              onOpenOverdue={() => setDrawerMode("overdue")}
            />
          </motion.div>
        );

      case "lists":
        return (
          <motion.div key="lists" {...viewProps}>
            <ListsPage
              tasks={getFilteredTasks()}
              taskLists={taskLists}
              selectedListId={selectedListId}
              searchTerm={searchTerm}
              onTaskClick={handleTaskClick}
              onToggleCompletion={toggleTaskCompletion}
              onToggleImportance={toggleTaskImportance}
              onSearchChange={setSearchTerm}
              onListSelect={setSelectedListId}
              onAddList={addList}
            />
          </motion.div>
        );

      case "calendar":
        return (
          <motion.div key="calendar" {...viewProps}>
            <CalendarPage
              tasks={tasks}
              taskLists={taskLists}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onTaskClick={handleTaskClick}
              onToggleCompletion={toggleTaskCompletion}
              onToggleImportance={toggleTaskImportance}
              onAddTask={handleAddTaskForDate}
            />
          </motion.div>
        );

      case "review":
        return (
          <motion.div key="review" {...viewProps}>
            <ReviewPage tasks={tasks} taskLists={taskLists} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-[393px] h-[852px] bg-[#ffffff] relative overflow-hidden rounded-[40px] shadow-2xl border-8 border-black">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">
                TaskMaster
              </h2>
              <p className="text-sm text-gray-500">
                Loading your tasks...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication screen
  if (!isAuthenticated) {
    return (
      <>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
        <Toaster position="top-center" />
      </>
    );
  }

  // Show onboarding screen
  if (showOnboarding) {
    return (
      <>
        <OnboardingPage onComplete={handleOnboardingComplete} />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#ffffff] relative overflow-hidden">
        {/* Main Content with Pull to Refresh */}
        <div className="h-full pb-20">
          <PullToRefresh
            onRefresh={handleRefresh}
            disabled={isRefreshing}
          >
            <AnimatePresence mode="wait">
              {renderCurrentView()}
            </AnimatePresence>
          </PullToRefresh>
        </div>

        {/* Bottom Navigation */}
        <BottomNavbar
          currentView={viewMode}
          onViewChange={handleViewChange}
        />

        {/* Floating Action Button */}
        <FloatingActionButton
          onClick={() => setDrawerMode("addTask")}
        />

        {/* Sync Status Indicator */}
        {dataService.hasPendingChanges() && (
          <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            Sync pending
          </div>
        )}

        {/* Drawers */}
        <AnimatePresence>
          {drawerMode === "taskDetail" && selectedTask && (
            <TaskDetailDrawer
              task={selectedTask}
              taskList={getTaskList(selectedTask.listId)!}
              onClose={handleCloseDrawer}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          )}

          {drawerMode === "recommended" && (
            <RecommendedInboxDrawer
              tasks={getRecommendedTasks()}
              taskLists={taskLists}
              onClose={handleCloseDrawer}
              onTaskClick={handleTaskClick}
              onToggleCompletion={toggleTaskCompletion}
              onToggleImportance={toggleTaskImportance}
            />
          )}

          {drawerMode === "overdue" && (
            <OverdueInboxDrawer
              tasks={getOverdueTasks()}
              taskLists={taskLists}
              onClose={handleCloseDrawer}
              onTaskClick={handleTaskClick}
              onToggleCompletion={toggleTaskCompletion}
              onToggleImportance={toggleTaskImportance}
            />
          )}

          {drawerMode === "addTask" && (
            <AddTaskDrawer
              taskLists={taskLists}
              initialDueDate={selectedDate}
              onClose={handleCloseDrawer}
              onAddTask={addTask}
            />
          )}
        </AnimatePresence>
      <Toaster position="top-center" />
    </div>
  );
}