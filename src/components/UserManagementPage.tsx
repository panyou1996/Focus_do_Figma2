import React, { useState, useEffect } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "./ui/drawer";
import { 
  User, 
  LogOut, 
  Cloud, 
  CloudOff, 
  Type, 
  Lock, 
  Mail, 
  ChevronRight,
  Settings,
  Wifi,
  WifiOff 
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { dataService, User as UserType } from "../utils/dataService";

interface UserManagementPageProps {
  user: UserType | null;
  onSignOut: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function UserManagementPage({
  user,
  onSignOut,
  onClose,
  isOpen
}: UserManagementPageProps) {
  const [isCloudSyncEnabled, setIsCloudSyncEnabled] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  // 监听网络状态和同步状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 检查是否有待同步的更改
    const checkPendingChanges = () => {
      setHasPendingChanges(dataService.hasPendingChanges());
    };
    
    checkPendingChanges();
    const interval = setInterval(checkPendingChanges, 1000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await onSignOut();
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloudSyncToggle = async (enabled: boolean) => {
    if (!isOnline && enabled) {
      toast.error("Cannot enable cloud sync while offline");
      return;
    }
    
    setIsCloudSyncEnabled(enabled);
    try {
      if (enabled) {
        // 启用云同步时，尝试同步数据
        await dataService.syncData();
        toast.success("Cloud sync enabled and data synchronized");
      } else {
        // 禁用云同步（仅本地存储）
        // TODO: 实现本地模式设置
        toast.success("Cloud sync disabled - using local storage only");
      }
    } catch (error) {
      console.error("Cloud sync toggle error:", error);
      toast.error("Failed to update sync settings");
      setIsCloudSyncEnabled(!enabled); // 恢复原状态
    }
  };
  
  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error("Cannot sync while offline");
      return;
    }
    
    setIsLoading(true);
    try {
      await dataService.syncData();
      toast.success("Data synchronized successfully");
      setHasPendingChanges(false);
    } catch (error) {
      console.error("Manual sync error:", error);
      toast.error("Failed to sync data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    
    // 实际应用字体大小到根元素
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
    }
    
    // 保存用户偏好到localStorage
    localStorage.setItem('taskmaster_font_size', size);
    toast.success(`Font size changed to ${size}`);
  };
  
  // 初始化时加载用户的字体大小偏好
  useEffect(() => {
    const savedFontSize = localStorage.getItem('taskmaster_font_size') as 'small' | 'medium' | 'large' | null;
    if (savedFontSize) {
      setFontSize(savedFontSize);
      handleFontSizeChange(savedFontSize);
    }
  }, []);

  const handleChangePassword = () => {
    // TODO: Implement password change modal
    toast.info("Password change feature coming soon");
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="bg-white">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-medium">Settings</DrawerTitle>
          <p className="text-sm text-gray-500">Manage your account and preferences</p>
        </DrawerHeader>
        <div className="scrollable-content p-4 space-y-6">
        {/* User Profile Section */}
        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{user?.name || "User"}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {user?.onboarding_completed ? "Active" : "Setup Required"}
            </Badge>
          </div>
        </Card>

        {/* Account Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Account</h2>
          
          {/* Cloud Sync */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {isCloudSyncEnabled ? (
                  <Cloud className="h-5 w-5 text-blue-600" />
                ) : (
                  <CloudOff className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <h3 className="font-medium">Cloud Sync</h3>
                  <p className="text-sm text-gray-500">
                    Sync your data across devices
                  </p>
                </div>
              </div>
              <Switch
                checked={isCloudSyncEnabled}
                onCheckedChange={handleCloudSyncToggle}
                disabled={!isOnline}
              />
            </div>
            
            {/* 同步状态指示器 */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Offline</span>
                  </>
                )}
                {hasPendingChanges && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    {isOnline ? "Syncing..." : "Pending"}
                  </Badge>
                )}
              </div>
              
              {hasPendingChanges && isOnline && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualSync}
                  disabled={isLoading}
                  className="text-xs h-7"
                >
                  {isLoading ? "Syncing..." : "Sync Now"}
                </Button>
              )}
            </div>
          </Card>

          {/* Change Password */}
          <Card className="p-4">
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg -m-4 p-4"
            >
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-500">
                    Update your account password
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </Card>
        </div>

        {/* App Preferences */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Preferences</h2>
          
          {/* Font Size */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Type className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium">Font Size</h3>
                <p className="text-sm text-gray-500">
                  Adjust text size for better readability
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <Button
                  key={size}
                  variant={fontSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFontSizeChange(size)}
                  className="flex-1 capitalize"
                >
                  {size}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Sign Out */}
        <DrawerFooter>
          <Card className="p-4 border-red-100">
            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Sign Out
            </Button>
          </Card>
        </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}