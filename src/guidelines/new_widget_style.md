Prompt: “Add New List” 界面重新设计指令
目标: 重新设计 “Add New List” 界面，使其符合应用内现有页面（如 “Lists” 和 “Review” 页面）所展示的简约、紧凑和优雅的设计原则。新设计将通过优化布局和减少视觉干扰，来简化列表创建流程。

1. 整体布局与样式 (Overall Layout & Style)
背景: 整个界面背景使用纯白色 (#FFFFFF)。

模态框样式: 采用底部弹出的模态框（Bottom Sheet Modal）。

圆角: 模态框顶部两个圆角半径为 16px。

顶部指示条: 模态框顶部中央有一个 36px 宽、4px 高的灰色 (#D8D8D8) 短横线。

边距: 内容距离模态框左右边缘的内边距统一为 20px。

字体:

全局字体: PingFang SC 或 Noto Sans SC。

标题 (Add New List): 字体大小 22px，字重 Bold，颜色 #1C1C1E，左对齐。

字段标题: 字体大小 14px，颜色 #8A8A8E，字重 Semi-bold，并使用全大写（例如 "ICON & COLOR"）。

2. 组件像素级设计 (Pixel-Perfect Component Design)
2.1 列表名称 (List Name)
输入框 (<input type="text">):

样式: 采用与 “Review” 页面卡片一致的样式。

背景色: #FFFFFF。

边框: 1px solid #E5E5EA。

圆角: 12px。

高度: 56px。

内边距: 左右 16px。

占位符文本: "e.g., Work, Groceries, etc."。

字体: 输入文字大小 16px，颜色 #1C1C1E。

与标题间距 (margin-top): 24px。

与下方内容间距 (margin-bottom): 28px。

2.2 图标与颜色选择 (Icon & Color Section)
设计理念: 将图标和颜色选择紧密地结合在一起，共同定义列表的视觉标识。

** sección 标题:** "ICON & COLOR"，左对齐，margin-bottom: 12px。

2.2.1 图标选择器 (Icon Selector)
布局: 横向滚动的图标列表。

单个图标样式:

容器: 每个图标放在 48px * 48px 的圆形容器中。

背景色: 默认背景色为 #F2F2F7。

图标本身: 尺寸 24px * 24px，颜色 #8A8A8E。

选中状态:

容器背景色: 变为当前选中的颜色（与下方颜色选择器联动）。

图标颜色: 变为纯白色 (#FFFFFF)。

间距: 每个图标容器之间水平间距为 10px。

2.2.2 颜色选择器 (Color Selector)
与图标间距 (margin-top): 20px。

布局: 一行水平排列的颜色圆点。

单个颜色样式:

尺寸: 32px * 32px 的圆形。

边框:

未选中: 无边框。

选中: 2px 宽的白色 (#FFFFFF) 边框，以及 1px 宽的、颜色与圆点本身相同的向外扩展的辉光/描边，以在白色背景上突出显示。

间距: 每个颜色圆点之间水平间距为 16px。

与下方内容间距 (margin-bottom): 28px。

2.3 描述 (Description)
输入框 (<textarea>):

样式: 与列表名称输入框风格一致。

背景色: #FFFFFF。

边框: 1px solid #E5E5EA。

圆角: 12px。

高度: 80px（固定高度）。

内边距: 16px。

占位符文本: "Add a short description..."。

字体: 输入文字大小 16px，颜色 #1C1C1E。

与下方内容间距 (margin-bottom): 32px。

3. 底部按钮 (Action Buttons)
布局: 水平排列，等宽。

取消按钮 (Cancel):

样式: 边框按钮。

背景色: #FFFFFF。

边框: 1px solid #E5E5EA。

文字颜色: #1C1C1E。

高度: 50px。

圆角: 10px。

添加列表按钮 (Add List):

样式: 实心按钮。

背景色: 根据当前选择的颜色动态变化。

文字颜色: #FFFFFF。

高度: 50px。

圆角: 10px。

间距: 按钮之间水平间距为 12px。

底部安全区域: 按钮组下方留出 24px 的内边距。

Prompt: “New Blog” 界面重新设计指令
目标: 将当前 “New Blog” 界面改造为一个更具现代感、优雅且紧凑的设计，其风格需与应用内现有页面的视觉语言保持一致。重点在于优化垂直空间利用，并使用分组卡片样式增强信息的可读性。

1. 整体布局与样式 (Overall Layout & Style)
背景: 界面背景为浅灰色 (#F7F7F7)，与 "Lists" 页面背景色一致。

呈现方式: 采用从底部向上滑出的全屏模态框。

顶部导航栏 (Top Navigation Bar):

高度: 56px。

背景: 白色 (#FFFFFF)。

关闭按钮: 左上角放置 "Cancel" 文字按钮，字体大小 16px，颜色 #4A90E2。

标题: 居中显示 "New Blog"，字体大小 17px，字重 Semi-bold，颜色 #1C1C1E。

发布按钮 (Publish Button): 右上角显示 "Publish" 文字按钮。

默认状态: 字体大小 16px，颜色为浅灰色 (#C7C7CC)。

激活状态: 填写完必填项后，颜色变为蓝色主色调 (#4A90E2)，字重 Semi-bold。

边距: 内容卡片距离屏幕左右边缘 16px。

2. 组件像素级设计 (Pixel-Perfect Component Design)
2.1 内容创作区 (Content Creation Area)
卡片样式: 将标题、内容和封面图整合到一个白色卡片中。

背景色: #FFFFFF。

圆角: 12px。

边框: 1px solid #E5E5EA。

顶部外边距 (margin-top): 16px。

内边距 (padding): 16px。

标题输入框 (<input type="text">):

样式: 无边框，无背景。

占位符文本: "Enter blog title"。

字体: 大小 22px，字重 Bold，颜色 #1C1C1E。

底部外边距 (margin-bottom): 12px。

内容输入框 (<textarea>):

样式: 无边框，无背景。

占位符文本: "Share your thoughts..."。

字体: 大小 16px，字重 Regular，行高 1.6，颜色 #3C3C43。

最小高度: 150px。

字数统计: 在输入框右下角显示，格式 "0/2000"，字体大小 12px，颜色 #8A8A8E。

与下方元素的间距: 16px。

封面图片上传 (Cover Image Upload):

样式: 一个 80px * 80px 的虚线框，位于内容框下方。

边框: 1px dashed #C7C7CC。

圆角: 8px。

内部: 中央有一个图片图标 (Image Icon) 和 "Click to upload" 文字。

预览: 上传后，图片将替换虚线框，保持 16:9 的比例，宽度与卡片同宽。

2.2 元数据分组 (Metadata Group)
卡片样式: 将“心情”、“地点”、“天气”和“标签”整合到另一个独立的白色卡片中。样式同上。

顶部外边距 (margin-top): 16px。

2.2.1 心情 (Mood)
布局:

图标: 左侧放置一个笑脸图标 (Emoji Icon)。

标签: "Mood"。

当前值: 右侧显示当前选择的心情图标和文字，附带向右箭头 (>)。

2.2.2 地点与天气 (Location & Weather)
布局 (合并为一行):

图标: 左侧放置一个定位图标 (Pin Icon)。

标签: "Location & Weather"。

当前值: 右侧显示已选地点和天气，附带向右箭头 (>)。

2.2.3 标签 (Tags)
布局:

图标: 左侧放置一个标签图标 (Tag Icon)。

标签: "Tags"。

当前值: 右侧显示已添加的标签，附带向右箭头 (>)。

2.3 公开性设置 (Public Settings)
卡片样式: 独立的白色卡片。

图标: 左侧放置一个链接/地球图标 (Link/Globe Icon)。

标签: "Public Blog"，下方有副标题 "Visible to everyone"。

交互: 右侧放置一个开关控件 (Switch/Toggle)。

3. 底部操作 (Bottom Actions)
移除: 所有操作按钮已移至顶部导航栏，底部无需额外按钮，以保持界面简洁。

Prompt: “Edit Task” 界面重新设计指令
目标: 将当前 “Edit Task” 界面改造为一个更简约、紧凑且优雅的设计。新设计需与应用内现有页面（如 “Lists” 和 “Review” 页面）的视觉风格保持高度一致，优化信息层级，减少视觉噪音，并提升操作的流畅性。

1. 整体布局与样式 (Overall Layout & Style)
背景: 整个界面背景使用纯白色 (#FFFFFF)。

模态框样式: 界面将以底部弹出的模态框（Bottom Sheet Modal）形式呈现。

圆角: 模态框顶部两个圆角半径为 16px。

顶部指示条: 在模态框顶部中央有一个 36px 宽、4px 高的浅灰色 (#D8D8D8) 短横线，作为拖动指示。

边距: 所有内容距离模态框左右边缘的内边距（padding）统一为 20px。

字体:

全局字体: 使用无衬线字体，如 PingFang SC (iOS) 或 Noto Sans SC (Android)。

字段标签 (Labels): 字体大小 14px，颜色为中灰色 (#8A8A8E)，字重为 Regular。

输入内容 (Input Text): 字体大小 16px，颜色为深黑色 (#1C1C1E)，字重为 Medium。

交互元素: 所有可点击的元素在点击时需要有轻微的视觉反馈（例如，透明度变为 0.7）。

2. 组件像素级设计 (Pixel-Perfect Component Design)
2.1 任务名称 (Task Name)
布局: 任务名称和收藏星标位于同一行。

收藏星标 (Star Icon):

尺寸: 24px * 24px。

颜色: 未收藏时为灰色 (#C7C7CC)，收藏时为黄色 (#FFD60A)。

位置: 垂直居中对齐，位于最左侧。

任务名称输入框 (<input type="text">):

样式: 无边框，无背景色，仅在底部有一条 1px 高的分割线。

字体: 大小 24px，字重 Bold，颜色 #1C1C1E。

与星标的间距: 距离右侧的星标 12px。

底部外边距 (margin-bottom): 28px。

2.2 表单区域 (Form Section)
整体样式: 将所有表单项整合到一个卡片式分组框中，风格与 “Review” 页面的卡片一致。

分组框 (Group Container):

背景色: 纯白色 (#FFFFFF)。

边框: 1px 宽的浅灰色 (#E5E5EA) 边框。

圆角: 12px。

内部分割线: 每个表单项之间用 1px 高的浅灰色 (#E5E5EA) 分割线隔开。分割线左侧留出 52px 的空白（为图标留出空间）。

行高: 每个表单项的固定高度为 56px。

2.2.1 截止日期 (Due Date)
图标: 左侧放置一个日历图标 (Calendar Icon)，尺寸 22px * 22px，颜色 #8A8A8E，位于行内左侧 16px 处。

标签: 在图标右侧 14px 处显示 "Due Date"，字体大小 16px，颜色 #1C1C1E。

交互/值: 右侧显示选定的日期，例如 "2025/10/01"，颜色为 #8A8A8E。附带一个向右的箭头 (>)，点击整行可弹出日期选择器。

2.2.2 开始时间 (Start Time)
图标: 左侧放置一个闹钟图标 (Alarm Icon)，尺寸 22px * 22px，颜色 #8A8A8E。

标签: 显示 "Start Time"，字体大小 16px，颜色 #1C1C1E。

交互/值: 右侧显示选定的日期和时间，例如 "2025/10/01, 18:00"，颜色为 #8A8A8E。附带一个向右的箭头 (>)。

2.2.3 持续时间 (Duration)
图标: 左侧放置一个沙漏图标 (Hourglass Icon)，尺寸 22px * 22px，颜色 #8A8A8E。

标签: 显示 "Duration (minutes)"，字体大小 16px，颜色 #1C1C1E。

交互/值: 右侧显示设定的分钟数，例如 "60"，颜色为 #8A8A8E。附带一个向右的箭头 (>)。

2.2.4 固定时间 (Fixed Time)
图标: 左侧放置一个图钉图标 (Pin Icon)，尺寸 22px * 22px，颜色 #8A8A8E。

标签: 显示 "Fixed Time"，字体大小 16px，颜色 #1C1C1E。

交互: 右侧放置一个开关控件 (Switch/Toggle)。

2.2.5 备注 (Notes)
图标: 左侧放置一个文档图标 (Document Icon)，尺寸 22px * 22px，颜色 #8A8A8E。

标签: 显示 "Notes"，字体大小 16px，颜色 #1C1C1E。

预览/箭头: 右侧显示备注内容的预览，并附带一个向右的箭头 (>)。

2.2.6 子任务 (Subtasks)
图标: 左侧放置一个分支/层级图标 (Subtask Icon)，尺寸 22px * 22px，颜色 #8A8A8E。

标签: 显示 "Subtasks"，字体大小 16px，颜色 #1C1C1E。

预览/箭头: 右侧显示子任务数量，并附带一个向右的箭头 (>)。

3. 底部按钮 (Action Buttons)
布局: 两个按钮水平排列，等宽。

取消按钮 (Cancel):

样式: 边框按钮。

背景色: #FFFFFF。

边框: 1px solid #E5E5EA。

文字颜色: #1C1C1E。

字体大小: 17px，字重 Semi-bold。

高度: 50px。

圆角: 10px。

保存更改按钮 (Save Changes):

样式: 实心按钮。

背景色: 蓝色主色调 (#4A90E2)。

文字颜色: #FFFFFF。

字体大小: 17px，字重 Semi-bold。

高度: 50px。

圆角: 10px。

间距: 按钮之间水平间距为 12px。

与上方内容的间距 (margin-top): 32px。

底部安全区域: 按钮组底部留出 24px 的安全边距。