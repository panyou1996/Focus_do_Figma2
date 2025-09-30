# Focus Do - Android APK 构建指南

本指南将帮助你将Focus Do React应用构建为Android APK。

## 环境要求

### 必需软件
1. **Android Studio** (推荐 Electric Eel 或更新版本)
   - 下载地址: https://developer.android.com/studio
   - 包含Android SDK和构建工具

2. **Java Development Kit (JDK)**
   - JDK 11 或更高版本
   - Android Studio通常会自动安装

3. **Node.js** 
   - 版本 16 或更高
   - 已安装，用于运行Capacitor

### Android SDK配置
1. 打开Android Studio
2. 进入 `Tools` > `SDK Manager`
3. 确保安装以下组件：
   - Android SDK Platform 33 (或最新版本)
   - Android SDK Build-Tools 33.0.0 (或最新版本)
   - Android SDK Platform-Tools
   - Android SDK Tools

4. 设置环境变量（在系统PATH中添加）：
   ```
   ANDROID_HOME=C:\Users\[username]\AppData\Local\Android\Sdk
   ```

## 构建步骤

### 1. 快速构建（推荐）
```bash
# 构建Web应用并打开Android Studio
npm run cap:build:android
```

### 2. 分步构建
```bash
# 第1步：构建Web应用
npm run build

# 第2步：同步到Android项目
npx cap sync android

# 第3步：打开Android Studio
npx cap open android
```

### 3. 在Android Studio中构建APK

#### 调试版APK (开发测试用)
1. 在Android Studio中，选择 `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
2. 等待构建完成
3. APK位置: `android/app/build/outputs/apk/debug/app-debug.apk`

#### 发布版APK (正式发布用)
1. 生成签名密钥：
   ```bash
   keytool -genkey -v -keystore focus-do-key.keystore -alias focus-do -keyalg RSA -keysize 2048 -validity 10000
   ```

2. 在Android Studio中：
   - 选择 `Build` > `Generate Signed Bundle / APK`
   - 选择 APK
   - 选择或创建密钥库
   - 选择发布构建类型
   - 点击 `Build`

3. 发布APK位置: `android/app/build/outputs/apk/release/app-release.apk`

## 应用功能特性

### ✅ 已实现的原生功能
- 🎯 **Haptic反馈**: 任务完成、重要性切换、长按等操作的触觉反馈
- 📱 **状态栏控制**: 动态调整状态栏样式（深色/浅色）
- 🚀 **启动屏幕**: 自定义启动动画和品牌展示
- 🔔 **Toast通知**: 原生消息提示
- 📐 **安全区域适配**: 完美支持Notch屏、动态岛、底部小白条
- 🎨 **移动端UI优化**: 针对移动设备的交互和视觉优化

### 📱 支持的设备类型
- iPhone X/XS/XR/11/12/13/14系列 (Notch屏)
- iPhone 14 Pro系列 (动态岛)
- Android设备 (刘海屏、水滴屏、打孔屏)
- 可折叠屏设备
- 各种屏幕尺寸和分辨率

### 🎯 移动端优化特性
- **触摸优化**: 44px最小触摸目标
- **滑动手势**: 左滑删除、右滑MyDay操作
- **长按反馈**: 任务固定/取消固定
- **下拉刷新**: 任务数据同步
- **防误触**: 智能手势识别
- **性能优化**: 懒加载和虚拟滚动

## 权限说明

应用请求的Android权限：
- `INTERNET`: 网络访问（Supabase同步）
- `VIBRATE`: 震动反馈
- `POST_NOTIFICATIONS`: 推送通知
- `WAKE_LOCK`: 保持应用活跃状态
- `ACCESS_NETWORK_STATE`: 网络状态检查

## 应用配置

### 应用信息
- **应用名称**: Focus Do
- **包名**: com.focusdo.app
- **版本**: 0.1.0

### 主要技术栈
- **前端框架**: React 18 + TypeScript
- **UI组件**: Radix UI + Tailwind CSS
- **动画**: Framer Motion
- **移动端框架**: Capacitor 7
- **后端服务**: Supabase (认证、数据库、实时同步)

## 故障排除

### 常见问题

#### 1. Gradle构建失败
```bash
# 清理Gradle缓存
cd android
./gradlew clean

# 重新构建
./gradlew assembleDebug
```

#### 2. Android SDK路径问题
确保在 `android/local.properties` 中设置正确的SDK路径：
```
sdk.dir=C:\\Users\\[username]\\AppData\\Local\\Android\\Sdk
```

#### 3. 权限被拒绝
在Android Studio中检查 `AndroidManifest.xml` 文件，确保所需权限都已添加。

#### 4. 原生插件错误
```bash
# 重新安装Capacitor插件
npm install @capacitor/haptics @capacitor/status-bar @capacitor/splash-screen
npx cap sync android
```

### 调试工具

#### 1. Chrome DevTools调试
1. 在Android设备上启用开发者选项和USB调试
2. 连接设备到电脑
3. 在Chrome中访问 `chrome://inspect`
4. 选择你的应用进行调试

#### 2. Android Studio Logcat
查看应用运行时的日志输出，快速定位问题。

## 发布准备

### 发布前检查清单
- [ ] 测试所有核心功能
- [ ] 验证不同屏幕尺寸的适配
- [ ] 检查权限请求的必要性
- [ ] 优化APK大小
- [ ] 测试离线功能
- [ ] 验证数据同步
- [ ] 检查安全配置

### Google Play商店准备
1. 创建应用图标 (各种尺寸)
2. 准备应用截图 (手机和平板)
3. 编写应用描述
4. 设置应用分类和关键词
5. 配置内容分级
6. 测试发布版APK

## 性能优化建议

1. **代码分割**: 使用动态导入减少初始加载时间
2. **图片优化**: 使用WebP格式和适当的压缩
3. **缓存策略**: 利用Service Worker缓存静态资源
4. **懒加载**: 对大型组件实施懒加载
5. **Bundle分析**: 使用工具分析和优化打包大小

---

🎉 **恭喜！** 你现在已经成功将Focus Do应用构建为Android APK！

如有任何问题，请参考Capacitor官方文档: https://capacitorjs.com/docs