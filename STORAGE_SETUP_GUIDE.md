# Supabase Storage 设置指南

## 快速解决方案

如果你看到"存储桶未创建"的错误，请按以下步骤操作：

## 方法1：在Supabase控制台手动创建（推荐）

### 步骤1：创建存储桶
1. 打开 [Supabase控制台](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单的 **"Storage"**
4. 点击 **"Create bucket"** 按钮
5. 输入桶名称：`images`
6. 选择 **"Public bucket"** （允许公开访问）
7. 点击 **"Save"** 创建

### 步骤2：设置访问策略
1. 在Storage页面，点击刚创建的 **"images"** 桶
2. 点击 **"Policies"** 标签
3. 点击 **"Add policy"** 添加以下三个策略：

**策略1：允许认证用户上传图片**
- Policy Name: `Allow authenticated users to upload images`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition: 
  ```sql
  bucket_id = 'images'
  ```

**策略2：允许所有人查看图片**
- Policy Name: `Allow public to view images`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition:
  ```sql
  bucket_id = 'images'
  ```

**策略3：允许用户删除自己的图片**
- Policy Name: `Allow users to delete own images`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- Policy definition:
  ```sql
  bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]
  ```

## 方法2：使用SQL脚本（备选）

如果你更喜欢使用SQL，可以在Supabase控制台的SQL编辑器中执行：

```sql
-- 创建images存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public;
```

然后仍需要按照方法1的步骤2设置访问策略。

## 验证设置

完成设置后：
1. 刷新你的应用页面
2. 尝试在Blog创建中上传图片
3. 应该能够成功上传了

## 故障排除

如果仍然遇到问题：
- 确保你已登录Supabase账户
- 检查存储桶名称是否为 `images`
- 确认存储桶是public的
- 检查RLS策略是否正确设置

设置完成后，图片上传功能就能正常工作了！