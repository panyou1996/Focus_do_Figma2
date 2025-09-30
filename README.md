# Project README: Figma Make Vibe Coding Todo

## 简介 (Introduction)

This Todo focuses on a "Today" view with timeline-based task organization and future automatic task planning. The app prioritizes a minimalist yet exquisite UI/UX, with elegant animations and a consistent design adhering to iOS and Android standards.

## 特色 (Features)

*   **核心功能:** 任务、列表、日历、今日视图管理，新增签到页面。
*   **Capacitor 支持:** 可编译为 Android APK，适配移动设备UI，集成原生功能（触觉反馈、通知）。
*   **日历增强:** 双击日期快速添加任务，切换任务显示模式（截止日期/开始时间）。
*   **FAB 重设计:** 单击添加任务，双击快速签到（拍照、编辑博客），长按自然语言快速创建任务。
*   **用户管理:** 登录/登出、云同步、字体大小、密码修改。

## 设计原则 (Design Principles)

*   **UI/UX:** 简洁、现代、一致，注重细节和优雅动画（Framer Motion）。
*   **响应式:** 移动优先，全屏适配，桌面居中显示。
*   **布局:** 无外框设计，统一的头部组件，底部导航栏。
*   **夜间模式:** 确保所有组件在夜间模式下有良好的对比度。

## 每页的展示内容 (Content per Page)

*   **Today Page:** 今日任务时间轴，推荐和逾期任务。
*   **Lists Page:** 任务列表概览，支持列表详情、过滤、添加、编辑、删除。
*   **Calendar Page:** 任务日历视图，可按日期或时间筛选。
*   **Check-in Page:** 签到管理、统计、博客view。

## 数据格式 (Data Structure)

*   **Task:** `id`, `title`, `listId`, `dueDate`, `startTime`, `duration`, `isFixed`, `completed`, `important`, `notes`, `subtasks`。
*   **TaskList:** `id`, `name`, `icon` (ReactNode), `color`, `description`。
*   **Checkin:** `id`, `title`, `icon`, `color`, `history`。
*   **Blog:** `id`, `title`, `content`, `imageUrl`, `location`, `date`。

## 交互 (Interactions)

*   **FAB:** 单击 (添加任务), 双击 (快速签到), 长按 (自然语言创建任务)。
*   **任务列表项:** 复选框、重要性标记、`isFixed` 视觉提示、长按切换 `isFixed`、左右滑动（删除/添加到“我的一天”）。
*   **列表项:** 过渡动画、添加/编辑/删除列表（长按编辑，滑动删除）。
*   **日历页面:** 双击/点击日期添加任务，切换任务视图。

## 规则 (Rules)

*   **开发:** 遵循现有代码风格、组件化、清晰的文件结构、依赖管理、测试覆盖。
*   **数据:** 所有数据通过 Supabase 同步，支持离线模式和 Supabase Auth。
*   **API:** 所有 API 接口定义在 `src/utils/dataService.tsx`。
