import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
}

export default function PullToRefresh({
  children,
  onRefresh,
  refreshThreshold = 80,
  maxPullDistance = 120,
  disabled = false
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  
  const refreshIconRotation = useTransform(y, [0, refreshThreshold], [0, 180]);
  const refreshIconScale = useTransform(y, [0, refreshThreshold], [0.8, 1.2]);
  const refreshOpacity = useTransform(y, [0, refreshThreshold], [0.5, 1]);

  const handlePanStart = () => {
    if (disabled || isRefreshing) return;
    
    // Only allow pull-to-refresh if scrolled to top
    const container = containerRef.current;
    if (container && container.scrollTop > 0) {
      return;
    }
  };

  const handlePan = (event: any, info: PanInfo) => {
    if (disabled || isRefreshing) return;
    
    const container = containerRef.current;
    if (container && container.scrollTop > 0) {
      y.set(0);
      return;
    }

    const deltaY = info.offset.y;
    
    if (deltaY > 0) {
      const constrainedY = Math.min(deltaY, maxPullDistance);
      y.set(constrainedY);
      setCanRefresh(constrainedY >= refreshThreshold);
    }
  };

  const handlePanEnd = async () => {
    if (disabled || isRefreshing) return;
    
    if (canRefresh && y.get() >= refreshThreshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
        setCanRefresh(false);
      }
    }
    
    y.set(0);
    setCanRefresh(false);
  };

  useEffect(() => {
    if (isRefreshing) {
      y.set(refreshThreshold);
    }
  }, [isRefreshing, refreshThreshold]);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center"
        style={{
          y: useTransform(y, [0, maxPullDistance], [-60, 20]),
          opacity: refreshOpacity
        }}
      >
        <div className={`
          flex items-center justify-center w-12 h-12 rounded-full
          ${canRefresh || isRefreshing 
            ? "bg-blue-500 text-white" 
            : "bg-gray-200 text-gray-500"
          }
          shadow-lg transition-colors duration-200
        `}>
          <motion.div
            style={{
              rotate: isRefreshing ? undefined : refreshIconRotation,
              scale: refreshIconScale
            }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { 
              duration: 1, 
              repeat: Infinity, 
              ease: "linear" 
            } : {}}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        ref={containerRef}
        className="h-full overflow-y-auto"
        style={{ y }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        dragMomentum={false}
      >
        {children}
      </motion.div>
    </div>
  );
}