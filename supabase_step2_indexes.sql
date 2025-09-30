-- 第2步：创建索引和视图（无破坏性操作）
-- 在第1步成功后执行这部分

-- 4. 创建索引以提高查询性能
-- 打卡项目索引
CREATE INDEX IF NOT EXISTS idx_checkin_items_user_id ON checkin_items(user_id);
CREATE INDEX IF NOT EXISTS idx_checkin_items_category ON checkin_items(category);
CREATE INDEX IF NOT EXISTS idx_checkin_items_active ON checkin_items(is_active);

-- 打卡记录索引
CREATE INDEX IF NOT EXISTS idx_checkin_records_user_id ON checkin_records(user_id);
CREATE INDEX IF NOT EXISTS idx_checkin_records_item_id ON checkin_records(checkin_item_id);
CREATE INDEX IF NOT EXISTS idx_checkin_records_checked_at ON checkin_records(checked_at);
CREATE INDEX IF NOT EXISTS idx_checkin_records_mood ON checkin_records(mood);

-- Blog索引
CREATE INDEX IF NOT EXISTS idx_checkin_blogs_user_id ON checkin_blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_checkin_blogs_created_at ON checkin_blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_checkin_blogs_mood ON checkin_blogs(mood);
CREATE INDEX IF NOT EXISTS idx_checkin_blogs_tags ON checkin_blogs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_checkin_blogs_public ON checkin_blogs(is_public);

-- 8. 创建一些有用的视图
-- 打卡统计视图
CREATE OR REPLACE VIEW checkin_daily_stats AS
SELECT 
  user_id,
  DATE(checked_at) as date,
  COUNT(*) as daily_count,
  ARRAY_AGG(DISTINCT mood) FILTER (WHERE mood IS NOT NULL) as moods,
  ARRAY_AGG(DISTINCT ci.category) as categories
FROM checkin_records cr
JOIN checkin_items ci ON cr.checkin_item_id = ci.id
GROUP BY user_id, DATE(checked_at);

-- 用户打卡概览视图
CREATE OR REPLACE VIEW user_checkin_overview AS
SELECT 
  ci.user_id,
  ci.id as item_id,
  ci.title,
  ci.category,
  ci.target_type,
  ci.target_count,
  COUNT(cr.id) as total_records,
  COUNT(cr.id) FILTER (WHERE DATE(cr.checked_at) = CURRENT_DATE) as today_count,
  COUNT(cr.id) FILTER (WHERE cr.checked_at >= CURRENT_DATE - INTERVAL '7 days') as week_count,
  MAX(cr.checked_at) as last_checkin
FROM checkin_items ci
LEFT JOIN checkin_records cr ON ci.id = cr.checkin_item_id
WHERE ci.is_active = true
GROUP BY ci.user_id, ci.id, ci.title, ci.category, ci.target_type, ci.target_count;

SELECT 'Step 2: Indexes and views created successfully!' as status;