import React from "react";
import { Calendar, List, BarChart3, CheckSquare, Target } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavbarProps {
  currentView: string;
  onViewChange: (view: "today" | "lists" | "calendar" | "review" | "checkin") => void;
}

export default function BottomNavbar({ currentView, onViewChange }: BottomNavbarProps) {
  const navItems = [
    { id: "today", label: "Today", icon: CheckSquare },
    { id: "lists", label: "Lists", icon: List },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "review", label: "Review", icon: BarChart3 },
    { id: "checkin", label: "Checkin", icon: Target },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={`
                flex flex-col items-center justify-center py-2 px-2 rounded-lg
                transition-colors duration-200 min-w-[50px] flex-1
                ${isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-600 rounded-full"
                    layoutId="activeIndicator"
                    style={{ x: '-50%' }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}