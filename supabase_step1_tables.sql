-- 第1步：创建基础表结构（无破坏性操作）
-- 在Supabase SQL Editor中先执行这部分

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

SELECT 'Step 1: Tables created successfully!' as status;