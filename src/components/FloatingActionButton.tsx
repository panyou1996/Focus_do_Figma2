import React, { useState } from "react";
import { Plus, Calendar, CheckSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingActionButtonProps {
  onClick: () => void;
  onCreateTask?: () => void;
  onCreateEvent?: () => void;
}

export default function FloatingActionButton({ 
  onClick, 
  onCreateTask,
  onCreateEvent
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
      
      {/* 展开菜单 - Pin形状设计 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-0 right-0 z-20"
          >
            {/* Pin形状容器 - 统一的indigo背景 */}
            <div className="relative">
              {/* 垂直矩形菜单部分 */}
              <motion.div 
                className="bg-[#5D5FEF] rounded-t-2xl shadow-[0_6px_16px_-2px_rgba(93,95,239,0.4)] mb-0 w-14 flex flex-col items-center justify-start pt-4 pb-2"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* 核心功能菜单项 - 简洁聚焦设计 */}
                <motion.button
                  onClick={() => handleMenuItemClick(onCreateTask || onClick)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors duration-200 mb-2"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  title="添加任务"
                >
                  <CheckSquare className="h-5 w-5 text-white" />
                </motion.button>
                
                {onCreateEvent && (
                  <motion.button
                    onClick={() => handleMenuItemClick(onCreateEvent)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors duration-200 mb-2"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    title="添加日程"
                  >
                    <Calendar className="h-5 w-5 text-white" />
                  </motion.button>
                )}
              </motion.div>
              
              {/* 圆形底部 - 与按钮重叠形成pin形状 */}
              <motion.div 
                className="bg-[#5D5FEF] w-14 h-14 rounded-full shadow-[0_6px_16px_-2px_rgba(93,95,239,0.4)] absolute bottom-0 right-0 flex items-center justify-center"
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}