-- Supabase 打卡功能相关数据表创建脚本
-- 请在Supabase SQL Editor中执行以下SQL语句

-- 1. 创建打卡项目表 (checkin_items)
CREATE TABLE IF NOT EXISTS checkin_items (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '📝',
  color VARCHAR(7) DEFAULT '#6B7280',
  category VARCHAR(20) NOT NULL DEFAULT 'other',
  target_type VARCHAR(10) NOT NULL DEFAULT 'daily', -- 'daily', 'weekly', 'custom'
  target_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  
  CONSTRAINT valid_category CHECK (category IN ('health', 'fitness', 'learning', 'habit', 'work', 'hobby', 'social', 'other')),
  CONSTRAINT valid_target_type CHECK (target_type IN ('daily', 'weekly', 'custom')),
  CONSTRAINT valid_target_count CHECK (target_count > 0)
);

-- 2. 创建打卡记录表 (checkin_records)
CREATE TABLE IF NOT EXISTS checkin_records (
  id BIGSERIAL PRIMARY KEY,
  checkin_item_id BIGINT REFERENCES checkin_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note TEXT,
  mood VARCHAR(20),
  location VARCHAR(255),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_mood CHECK (mood IN ('excellent', 'good', 'neutral', 'tired', 'stressed') OR mood IS NULL)
);

-- 3. 创建打卡Blog表 (checkin_blogs)
CREATE TABLE IF NOT EXISTS checkin_blogs (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  location VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  checkin_records BIGINT[] DEFAULT '{}',
  mood VARCHAR(20) NOT NULL DEFAULT 'neutral',
  weather VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  CONSTRAINT valid_mood CHECK (mood IN ('excellent', 'good', 'neutral', 'tired', 'stressed')),
  CONSTRAINT valid_like_count CHECK (like_count >= 0),
  CONSTRAINT valid_view_count CHECK (view_count >= 0)
);

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

-- 5. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 为需要的表添加更新时间触发器
DROP TRIGGER IF EXISTS update_checkin_items_updated_at ON checkin_items;
CREATE TRIGGER update_checkin_items_updated_at 
  BEFORE UPDATE ON checkin_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_checkin_blogs_updated_at ON checkin_blogs;
CREATE TRIGGER update_checkin_blogs_updated_at 
  BEFORE UPDATE ON checkin_blogs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 设置行级安全策略 (Row Level Security)
-- 启用RLS
ALTER TABLE checkin_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_blogs ENABLE ROW LEVEL SECURITY;

-- 打卡项目RLS策略
DROP POLICY IF EXISTS "Users can view their own checkin items" ON checkin_items;
CREATE POLICY "Users can view their own checkin items" 
  ON checkin_items FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own checkin items" ON checkin_items;
CREATE POLICY "Users can insert their own checkin items" 
  ON checkin_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own checkin items" ON checkin_items;
CREATE POLICY "Users can update their own checkin items" 
  ON checkin_items FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own checkin items" ON checkin_items;
CREATE POLICY "Users can delete their own checkin items" 
  ON checkin_items FOR DELETE 
  USING (auth.uid() = user_id);

-- 打卡记录RLS策略
DROP POLICY IF EXISTS "Users can view their own checkin records" ON checkin_records;
CREATE POLICY "Users can view their own checkin records" 
  ON checkin_records FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own checkin records" ON checkin_records;
CREATE POLICY "Users can insert their own checkin records" 
  ON checkin_records FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own checkin records" ON checkin_records;
CREATE POLICY "Users can update their own checkin records" 
  ON checkin_records FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own checkin records" ON checkin_records;
CREATE POLICY "Users can delete their own checkin records" 
  ON checkin_records FOR DELETE 
  USING (auth.uid() = user_id);

-- Blog RLS策略
DROP POLICY IF EXISTS "Users can view their own blogs and public blogs" ON checkin_blogs;
CREATE POLICY "Users can view their own blogs and public blogs" 
  ON checkin_blogs FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can insert their own blogs" ON checkin_blogs;
CREATE POLICY "Users can insert their own blogs" 
  ON checkin_blogs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own blogs" ON checkin_blogs;
CREATE POLICY "Users can update their own blogs" 
  ON checkin_blogs FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own blogs" ON checkin_blogs;
CREATE POLICY "Users can delete their own blogs" 
  ON checkin_blogs FOR DELETE 
  USING (auth.uid() = user_id);

-- 8. 创建一些有用的视图

-- 打卡统计视图
CREATE OR REPLACE VIEW checkin_daily_stats AS
SELECT 
  cr.user_id,
  DATE(checked_at) as date,
  COUNT(*) as daily_count,
  ARRAY_AGG(DISTINCT mood) FILTER (WHERE mood IS NOT NULL) as moods,
  ARRAY_AGG(DISTINCT ci.category) as categories
FROM checkin_records cr
JOIN checkin_items ci ON cr.checkin_item_id = ci.id
GROUP BY cr.user_id, DATE(checked_at);

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

-- 9. 插入一些示例数据（可选）
-- 注意：这些示例数据需要有效的user_id，在实际使用时请替换为真实的用户ID

/*
-- 示例打卡项目
INSERT INTO checkin_items (title, description, icon, color, category, target_type, target_count, user_id) VALUES
  ('每日喝水', '保持充足的水分摄入', '💧', '#06B6D4', 'health', 'daily', 8, 'your-user-id-here'),
  ('晨跑', '每天早上跑步30分钟', '🏃', '#EF4444', 'fitness', 'daily', 1, 'your-user-id-here'),
  ('读书', '每天阅读至少30分钟', '📚', '#8B5CF6', 'learning', 'daily', 1, 'your-user-id-here'),
  ('冥想', '每日冥想练习', '🧘', '#F59E0B', 'habit', 'daily', 1, 'your-user-id-here');
*/

-- 10. 创建存储过程用于复杂查询

-- 获取用户连续打卡天数
CREATE OR REPLACE FUNCTION get_user_streak_days(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_days INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  has_record BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM checkin_records 
      WHERE user_id = p_user_id 
      AND DATE(checked_at) = check_date
    ) INTO has_record;
    
    IF has_record THEN
      streak_days := streak_days + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_days;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户打卡完成率
CREATE OR REPLACE FUNCTION get_user_completion_rate(
  p_user_id UUID, 
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS NUMERIC AS $$
DECLARE
  total_targets INTEGER := 0;
  completed_count INTEGER := 0;
  completion_rate NUMERIC := 0;
BEGIN
  -- 计算目标总数
  SELECT SUM(
    CASE 
      WHEN target_type = 'daily' THEN 
        target_count * (p_end_date - p_start_date + 1)
      ELSE 
        target_count
    END
  ) INTO total_targets
  FROM checkin_items 
  WHERE user_id = p_user_id AND is_active = true;
  
  -- 计算完成总数
  SELECT COUNT(*) INTO completed_count
  FROM checkin_records cr
  JOIN checkin_items ci ON cr.checkin_item_id = ci.id
  WHERE cr.user_id = p_user_id 
  AND DATE(cr.checked_at) BETWEEN p_start_date AND p_end_date;
  
  -- 计算完成率
  IF total_targets > 0 THEN
    completion_rate := ROUND((completed_count::NUMERIC / total_targets) * 100, 2);
  END IF;
  
  RETURN completion_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 执行完成后的提示
SELECT 'Checkin tables and functions created successfully!' as status;