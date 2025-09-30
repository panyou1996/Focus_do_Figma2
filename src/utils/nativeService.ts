import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Toast } from '@capacitor/toast';

export class NativeService {
  // Haptic反馈
  static async hapticLight() {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (error) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  }

  static async hapticMedium() {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } catch (error) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  }

  static async hapticHeavy() {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch (error) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  }

  // 状态栏控制
  static async setStatusBarLight() {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Light });
      } catch (error) {
        console.warn('Status bar control not available:', error);
      }
    }
  }

  static async setStatusBarDark() {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (error) {
        console.warn('Status bar control not available:', error);
      }
    }
  }

  static async hideStatusBar() {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.hide();
      } catch (error) {
        console.warn('Status bar control not available:', error);
      }
    }
  }

  static async showStatusBar() {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.show();
      } catch (error) {
        console.warn('Status bar control not available:', error);
      }
    }
  }

  // 启动屏幕控制
  static async hideSplashScreen() {
    if (Capacitor.isNativePlatform()) {
      try {
        await SplashScreen.hide();
      } catch (error) {
        console.warn('Splash screen control not available:', error);
      }
    }
  }

  // Toast通知
  static async showToast(message: string, duration: 'short' | 'long' = 'short') {
    if (Capacitor.isNativePlatform()) {
      try {
        await Toast.show({
          text: message,
          duration: duration,
          position: 'bottom'
        });
      } catch (error) {
        console.warn('Toast not available:', error);
      }
    } else {
      // Web环境下的fallback
      console.log('Toast (web fallback):', message);
    }
  }

  // 检查是否在原生环境中
  static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  // 获取平台信息
  static getPlatform(): string {
    return Capacitor.getPlatform();
  }
}

// 移动端安全区域样式
export const SafeAreaStyles = {
  // 为状态栏留出空间
  statusBarPadding: Capacitor.isNativePlatform() ? 'pt-safe-top' : 'pt-0',
  
  // 为底部导航栏/Home指示器留出空间
  bottomSafePadding: Capacitor.isNativePlatform() ? 'pb-safe-bottom' : 'pb-0',
  
  // 完整的安全区域内边距
  fullSafePadding: Capacitor.isNativePlatform() ? 'pt-safe-top pb-safe-bottom' : '',
  
  // 最小高度（考虑安全区域）
  minHeightScreen: Capacitor.isNativePlatform() ? 'min-h-screen-safe' : 'min-h-screen',
};

// CSS变量注入函数，用于动态设置安全区域
export const injectSafeAreaCSS = () => {
  if (typeof document !== 'undefined' && Capacitor.isNativePlatform()) {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --sat: env(safe-area-inset-top);
        --sar: env(safe-area-inset-right);
        --sab: env(safe-area-inset-bottom);
        --sal: env(safe-area-inset-left);
      }
      
      .pt-safe-top {
        padding-top: env(safe-area-inset-top);
      }
      
      .pb-safe-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }
      
      .pl-safe-left {
        padding-left: env(safe-area-inset-left);
      }
      
      .pr-safe-right {
        padding-right: env(safe-area-inset-right);
      }
      
      .min-h-screen-safe {
        min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
      }
      
      /* 针对Notch屏幕的特殊处理 */
      @supports (padding: max(0px)) {
        .safe-area-inset-top {
          padding-top: max(16px, env(safe-area-inset-top));
        }
        
        .safe-area-inset-bottom {
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
      }
    `;
    document.head.appendChild(style);
  }
};