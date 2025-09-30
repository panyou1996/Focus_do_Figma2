-- 创建Supabase Storage桶用于存储打卡相关图片
-- 请在Supabase控制台的SQL编辑器中执行这个脚本

-- 插入images存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public;

-- ========================================
-- 重要说明：RLS策略需要在Supabase控制台中手动设置
-- ========================================
-- 
-- 请按以下步骤在Supabase控制台中设置存储策略：
-- 
-- 1. 进入Supabase控制台 -> Storage -> Policies
-- 2. 选择 "images" 桶
-- 3. 添加以下策略：
-- 
-- 策略1：允许认证用户上传图片
-- - Policy Name: Allow authenticated users to upload images
-- - Allowed operation: INSERT
-- - Target roles: authenticated
-- - Policy definition:
--   bucket_id = 'images' AND auth.role() = 'authenticated'
-- 
-- 策略2：允许所有人查看图片
-- - Policy Name: Allow public to view images
-- - Allowed operation: SELECT  
-- - Target roles: public
-- - Policy definition:
--   bucket_id = 'images'
-- 
-- 策略3：允许用户删除自己的图片
-- - Policy Name: Allow users to delete own images
-- - Allowed operation: DELETE
-- - Target roles: authenticated
-- - Policy definition:
--   bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]
--
-- 完成以上步骤后，图片上传功能就能正常工作了。