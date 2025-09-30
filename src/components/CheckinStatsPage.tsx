import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Area,
  AreaChart
} from "recharts";
import checkinService from "../utils/checkinService";
import {
  CheckinStats,
  CheckinCalendarDay,
  CheckinRecord,
  CheckinItem,
  DEFAULT_CHECKIN_CATEGORIES,
  MOOD_CONFIG,
  CheckinCategory,
  CheckinMood
} from "../types/checkin";

interface CheckinStatsPageProps {
  stats: CheckinStats | null;
  onRefreshStats: () => void;
}

export default function CheckinStatsPage({ stats, onRefreshStats }: CheckinStatsPageProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [calendarData, setCalendarData] = useState<CheckinCalendarDay[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    loadStatsData();
  }, [timeRange]);

  const loadStatsData = async () => {
    try {
      setIsLoading(true);
      
      // 加载日历数据
      const currentMonth = new Date();
      const calendar = await checkinService.getCheckinCalendar(currentMonth);
      setCalendarData(calendar);
      
      // 生成趋势数据
      generateTrendData();
      
      // 刷新统计数据
      onRefreshStats();
    } catch (error) {
      console.error('Failed to load stats data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTrendData = () => {
    const now = new Date();
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - 1 - i));
      
      // 模拟数据 - 实际应该从数据库获取
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseCount = isWeekend ? 2 : 4;
      const randomVariation = Math.floor(Math.random() * 3);
      
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
        count: Math.max(0, baseCount + randomVariation - 1),
        completion: Math.min(100, (baseCount + randomVariation) * 25)
      };
    });
    
    setTrendData(data);
  };

  const renderOverviewCards = () => {
    if (!stats) return null;

    const cards = [
      {
        title: "今日打卡",
        value: stats.today_records,
        icon: <Target className="h-5 w-5" />,
        color: "#3B82F6",
        trend: "+2 vs 昨天"
      },
      {
        title: "连续天数",
        value: stats.streak_days,
        icon: <Flame className="h-5 w-5" />,
        color: "#EF4444",
        trend: stats.streak_days > 0 ? "保持连续" : "重新开始"
      },
      {
        title: "本周完成",
        value: stats.week_records,
        icon: <Calendar className="h-5 w-5" />,
        color: "#10B981",
        trend: `${Math.round((stats.week_records / 7) * 100)}%`
      },
      {
        title: "完成率",
        value: `${stats.completion_rate}%`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: "#8B5CF6",
        trend: stats.completion_rate >= 80 ? "优秀" : stats.completion_rate >= 60 ? "良好" : "加油"
      }
    ];

    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    <div style={{ color: card.color }}>{card.icon}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                    <div className="text-sm text-gray-600">{card.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{card.trend}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderTrendChart = () => (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">打卡趋势</CardTitle>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7天</SelectItem>
              <SelectItem value="month">30天</SelectItem>
              <SelectItem value="year">1年</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategoryDistribution = () => {
    if (!stats) return null;

    const categoryData = Object.entries(stats.category_distribution)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => ({
        name: DEFAULT_CHECKIN_CATEGORIES[category as CheckinCategory].name,
        value: count,
        color: DEFAULT_CHECKIN_CATEGORIES[category as CheckinCategory].color,
        icon: DEFAULT_CHECKIN_CATEGORIES[category as CheckinCategory].icon
      }));

    return (
      <Card className="mb-6">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'category' ? null : 'category')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">分类分布</CardTitle>
            {expandedSection === 'category' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CardHeader>
        
        {expandedSection === 'category' && (
          <CardContent>
            <div className="space-y-3">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.value}个项目</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(item.value / stats.total_items) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {Math.round((item.value / stats.total_items) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  const renderMoodDistribution = () => {
    if (!stats) return null;

    const moodData = Object.entries(stats.mood_distribution)
      .filter(([_, count]) => count > 0)
      .map(([mood, count]) => ({
        mood: mood as CheckinMood,
        name: MOOD_CONFIG[mood as CheckinMood].name,
        emoji: MOOD_CONFIG[mood as CheckinMood].emoji,
        count,
        color: MOOD_CONFIG[mood as CheckinMood].color
      }))
      .sort((a, b) => b.count - a.count);

    const totalMoodRecords = moodData.reduce((sum, item) => sum + item.count, 0);

    return (
      <Card className="mb-6">
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'mood' ? null : 'mood')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">心情分布</CardTitle>
            {expandedSection === 'mood' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CardHeader>
        
        {expandedSection === 'mood' && (
          <CardContent>
            {moodData.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-2xl mb-2">😊</div>
                <p className="text-sm">还没有心情记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {moodData.map((item) => (
                  <div key={item.mood} className="flex items-center gap-3">
                    <div className="text-2xl">{item.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500">{item.count}次</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(item.count / totalMoodRecords) * 100}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                          {Math.round((item.count / totalMoodRecords) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  };

  const renderCalendarHeatmap = () => (
    <Card className="mb-6">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setExpandedSection(expandedSection === 'calendar' ? null : 'calendar')}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">打卡日历</CardTitle>
          {expandedSection === 'calendar' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </CardHeader>
      
      {expandedSection === 'calendar' && (
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-center text-xs text-gray-500 p-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 34 + i);
              const dayData = calendarData.find(d => d.date === date.toISOString().split('T')[0]);
              const intensity = dayData ? Math.min(dayData.completion_rate / 100, 1) : 0;
              
              return (
                <div
                  key={i}
                  className="aspect-square rounded border border-gray-200 text-xs flex items-center justify-center relative"
                  style={{
                    backgroundColor: intensity > 0 
                      ? `rgba(59, 130, 246, ${Math.max(0.1, intensity)})` 
                      : '#f9fafb'
                  }}
                >
                  <span className={intensity > 0.5 ? 'text-white' : 'text-gray-700'}>
                    {date.getDate()}
                  </span>
                  {dayData && dayData.records.length > 0 && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full transform translate-x-1 -translate-y-1" />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>较少</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
                <div
                  key={intensity}
                  className="w-3 h-3 rounded border border-gray-200"
                  style={{
                    backgroundColor: intensity > 0 
                      ? `rgba(59, 130, 246, ${Math.max(0.1, intensity)})` 
                      : '#f9fafb'
                  }}
                />
              ))}
            </div>
            <span>较多</span>
          </div>
        </CardContent>
      )}
    </Card>
  );

  const renderAchievements = () => {
    if (!stats) return null;

    const achievements = [
      {
        id: 'first_checkin',
        title: '初次打卡',
        description: '完成第一次打卡',
        icon: '🎯',
        unlocked: stats.total_records > 0,
        color: '#10B981'
      },
      {
        id: 'week_streak',
        title: '坚持一周',
        description: '连续打卡7天',
        icon: '🔥',
        unlocked: stats.streak_days >= 7,
        color: '#EF4444'
      },
      {
        id: 'perfect_month',
        title: '完美月份',
        description: '本月完成率达到90%',
        icon: '⭐',
        unlocked: stats.completion_rate >= 90,
        color: '#F59E0B'
      },
      {
        id: 'blog_writer',
        title: '分享达人',
        description: '发布5篇打卡Blog',
        icon: '📝',
        unlocked: stats.total_blogs >= 5,
        color: '#8B5CF6'
      }
    ];

    return (
      <Card>
        <CardHeader 
          className="pb-2 cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'achievements' ? null : 'achievements')}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">成就徽章</CardTitle>
            {expandedSection === 'achievements' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CardHeader>
        
        {expandedSection === 'achievements' && (
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`
                    p-3 rounded-lg border-2 text-center transition-all
                    ${achievement.unlocked 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <div className="font-medium text-sm mb-1">{achievement.title}</div>
                  <div className="text-xs text-gray-600">{achievement.description}</div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-700">
                      已解锁
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24" />
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg h-64" />
          <div className="bg-gray-200 rounded-lg h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* 概览卡片 */}
      {renderOverviewCards()}
      
      {/* 趋势图表 */}
      {renderTrendChart()}
      
      {/* 分类分布 */}
      {renderCategoryDistribution()}
      
      {/* 心情分布 */}
      {renderMoodDistribution()}
      
      {/* 打卡日历 */}
      {renderCalendarHeatmap()}
      
      {/* 成就徽章 */}
      {renderAchievements()}
    </div>
  );
}