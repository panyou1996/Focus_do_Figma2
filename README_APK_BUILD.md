# Focus Do - Android APK 打包指南

本文档详细说明如何将Focus Do React应用打包成Android APK文件。

## 📋 前置要求

### 必需软件
- **Node.js** (版本 16+) - 项目运行环境
- **Android Studio** - Android开发环境
- **Git** - 版本控制工具

### 环境检查
```powershell
# 检查Node.js版本
node --version

# 检查npm版本  
npm --version

# 检查git版本
git --version
```

## 🛠️ 环境配置

### 1. Android Studio配置
1. 下载并安装 [Android Studio](https://developer.android.com/studio)
2. 打开Android Studio，进入 `Tools` > `SDK Manager`
3. 确保安装以下组件：
   - Android SDK Platform 34 (或最新版本)
   - Android SDK Build-Tools 34.0.0
   - Android SDK Platform-Tools

### 2. 环境变量设置
```powershell
# 设置JAVA_HOME (临时)
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"

# 验证Java路径
dir "C:\Program Files\Android\Android Studio\jbr\bin\java.exe"
```

### 3. Android SDK配置
创建 `android/local.properties` 文件：
```properties
sdk.dir=C:\\Users\\[你的用户名]\\AppData\\Local\\Android\\Sdk
```

## 🚀 打包步骤

### 第1步：安装依赖
```powershell
# 安装项目依赖
npm install
```

### 第2步：构建React应用
```powershell
# 构建生产版本
npm run build
```
**预期输出**：
- 构建文件生成在 `build/` 目录
- 主要文件大小约1.14MB

### 第3步：同步到Android项目
```powershell
# 同步Web资源到Android
npx cap sync android
```
**预期输出**：
- Web资源复制到Android项目
- Capacitor插件配置更新

### 第4步：构建APK
```powershell
# 进入Android目录
cd android

# 设置Java环境（如果需要）
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"

# 构建Debug版APK
.\gradlew assembleDebug
```

### 第5步：获取APK文件
构建完成后，APK文件位于：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 构建结果验证

### 检查APK文件
```powershell
# 查看APK文件
dir android\app\build\outputs\apk\debug\

# 获取文件哈希值
Get-FileHash android\app\build\outputs\apk\debug\app-debug.apk -Algorithm SHA256
```

### APK信息
- **文件大小**: 约4.5MB
- **包名**: com.focusdo.app
- **最小Android版本**: API 24 (Android 7.0)
- **目标Android版本**: API 34 (Android 14)

## 🔧 故障排除

### 常见问题1：JAVA_HOME未设置
**错误信息**：
```
ERROR: JAVA_HOME is not set and no 'java' command could be found
```

**解决方案**：
```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
```

### 常见问题2：SDK路径未找到
**错误信息**：
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME
```

**解决方案**：
确保 `android/local.properties` 文件存在且内容正确：
```properties
sdk.dir=C:\\Users\\[用户名]\\AppData\\Local\\Android\\Sdk
```

### 常见问题3：Gradle构建失败
**解决方案**：
```powershell
# 清理Gradle缓存
cd android
.\gradlew clean

# 重新构建
.\gradlew assembleDebug
```

### 常见问题4：网络连接问题
如果遇到依赖下载问题：
```powershell
# 设置npm镜像
npm config set registry https://registry.npmmirror.com/

# 重新安装依赖
npm install
```

## ⚡ 快速打包脚本

为了简化操作，可以使用项目中的快速脚本：

```powershell
# 完整构建流程（推荐）
npm run cap:build:android
```

这个命令相当于：
```powershell
npm run build && npx cap sync android && npx cap open android
```

## 📦 发布准备

### Debug版本（开发测试）
- 文件：`app-debug.apk`
- 用途：内部测试和开发
- 安装：需要启用"未知来源"

### Release版本（正式发布）
```powershell
# 构建Release版本
.\gradlew assembleRelease
```
- 需要签名密钥
- 用于Google Play Store发布

## 🎯 自动化建议

### GitHub Actions配置
创建 `.github/workflows/android.yml`：
```yaml
name: Android Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions/setup-java@v3
      - run: npm install
      - run: npm run build
      - run: npx cap sync android
      - run: cd android && ./gradlew assembleDebug
```

## 📝 性能优化

### 构建优化
1. **代码分割**：使用动态导入减少初始包大小
2. **图片优化**：压缩图片资源
3. **依赖清理**：移除未使用的依赖

### APK优化
1. **启用ProGuard**：混淆代码减少大小
2. **资源优化**：移除未使用的资源
3. **分包策略**：支持多架构分包

## 🔍 技术栈说明

### 核心技术
- **前端框架**: React 18 + TypeScript
- **UI组件**: Radix UI + Tailwind CSS
- **移动框架**: Capacitor 7.4.3
- **构建工具**: Vite + Gradle

### Capacitor插件
- `@capacitor/haptics` - 触觉反馈
- `@capacitor/status-bar` - 状态栏控制
- `@capacitor/splash-screen` - 启动屏幕
- `@capacitor/toast` - 原生提示
- `@capacitor/preferences` - 本地存储

## 📞 技术支持

### 相关文档
- [Android构建详细指南](./ANDROID_BUILD_GUIDE.md)
- [Capacitor配置说明](./CAPACITOR_SUMMARY.md)
- [APK发布指南](./APK_RELEASE_GUIDE.md)

### 常用命令速查
```powershell
# 开发服务器
npm run dev

# 构建Web应用
npm run build

# 同步Capacitor
npm run cap:sync

# 打开Android Studio
npm run cap:android

# 完整Android构建
npm run cap:build:android
```

---

**最后更新**: 2025-10-01  
**适用版本**: Focus Do v0.1.0  
**构建环境**: Windows 11 + Android Studio