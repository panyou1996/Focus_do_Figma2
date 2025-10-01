import React, { useState } from "react";
import { Plus, FileText, Calendar, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingActionButtonProps {
  onClick: () => void;
  onCreateTask?: () => void;
  onCreateEvent?: () => void;
  onCreateTag?: () => void;
}

export default function FloatingActionButton({ 
  onClick, 
  onCreateTask,
  onCreateEvent,
  onCreateTag 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMainClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsExpanded(false);
  };
  return (
    <div className="absolute bottom-24 right-4 z-30">
      {/* 展开菜单背景遮罩 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 z-20"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* 主FAB按钮 */}
      <motion.button
        onClick={handleMainClick}
        className="w-14 h-14 bg-[#5D5FEF] hover:bg-[#4C4EE8] text-white rounded-full shadow-[0_6px_16px_-2px_rgba(93,95,239,0.4)] flex items-center justify-center relative z-30"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 20,
          delay: 0.2 
        }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
      </motion.button>
      
      {/* 展开菜单 - 暂时为基本结构 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-[#5D5FEF] rounded-2xl shadow-[0_6px_16px_-2px_rgba(93,95,239,0.4)] p-2 z-30"
          >
            <div className="text-white text-sm p-2">
              展开菜单 - 开发中
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}