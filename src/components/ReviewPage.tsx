import React from "react";
import { TrendingUp, CheckCircle, Clock, Star, Calendar, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface Task {
  id: number | string;
  title: string;
  description: string;
  listId: number;
  dueDate: Date;
  startTime: string;
  duration: number;
  isFixed: boolean;
  completed: boolean;
  important: boolean;
  isMyDay: boolean;
  addedToMyDayAt?: Date;
  notes: string;
}

interface TaskList {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface ReviewPageProps {
  tasks: Task[];
  taskLists: TaskList[];
}

export default function ReviewPage({ tasks, taskLists }: ReviewPageProps) {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const importantTasks = tasks.filter(task => task.important).length;
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate < new Date()
  ).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get tasks for different time periods
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);

  const todayTasks = tasks.filter(task => 
    task.dueDate.toDateString() === today.toDateString()
  );
  const thisWeekTasks = tasks.filter(task => 
    task.dueDate >= thisWeek && task.dueDate <= today
  );

  // Prepare chart data
  const listStats = taskLists.map(list => {
    const listTasks = tasks.filter(task => task.listId === list.id);
    const completedInList = listTasks.filter(task => task.completed).length;
    return {
      name: list.name,
      icon: list.icon,
      total: listTasks.length,
      completed: completedInList,
      pending: listTasks.length - completedInList,
      color: list.color,
      completionRate: listTasks.length > 0 ? Math.round((completedInList / listTasks.length) * 100) : 0
    };
  }).filter(stat => stat.total > 0);

  // Weekly completion chart data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const dayTasks = tasks.filter(task => 
      task.dueDate.toDateString() === date.toDateString()
    );
    const completed = dayTasks.filter(task => task.completed).length;
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total: dayTasks.length,
      date: date.toISOString().split('T')[0]
    };
  });

  // Time distribution data
  const timeDistribution = tasks.reduce((acc, task) => {
    if (!task.startTime) return acc;
    const hour = parseInt(task.startTime.split(':')[0]);
    let period;
    if (hour < 6) period = 'Night (12-6 AM)';
    else if (hour < 12) period = 'Morning (6-12 PM)';
    else if (hour < 18) period = 'Afternoon (12-6 PM)';
    else period = 'Evening (6-12 AM)';
    
    acc[period] = (acc[period] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const timeChartData = Object.entries(timeDistribution).map(([period, count]) => ({
    period: period.split(' ')[0],
    count,
    fullPeriod: period
  }));

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-medium">Review</h1>
          <p className="text-sm text-gray-500">
            Your productivity insights
          </p>
        </div>

      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <div className="text-xs text-gray-500">of {totalTasks} tasks</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Completion Rate</span>
              </div>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Important</span>
              </div>
              <div className="text-2xl font-bold">{importantTasks}</div>
              <div className="text-xs text-gray-500">high priority</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600">Overdue</span>
              </div>
              <div className="text-2xl font-bold">{overdueTasks}</div>
              <div className="text-xs text-gray-500">need attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Bar 
                    dataKey="completed" 
                    fill="#10B981" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lists Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lists Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {listStats.map((stat) => (
                <div key={stat.name} className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{stat.name}</span>
                      <span className="text-xs text-gray-500">
                        {stat.completed}/{stat.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${stat.completionRate}%`,
                            backgroundColor: stat.color
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {stat.completionRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={40}
                    dataKey="count"
                  >
                    {timeChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4]} 
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {timeChartData.map((item, index) => (
                <div key={item.period} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4] }}
                  />
                  <span className="text-xs text-gray-600">{item.period}</span>
                  <span className="text-xs text-gray-500">({item.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  📊
                </div>
                <div>
                  <p className="text-sm font-medium">Productivity Trend</p>
                  <p className="text-xs text-gray-600">
                    You completed {completedTasks} tasks this period. 
                    {completionRate >= 80 ? " Great job!" : completionRate >= 60 ? " Keep it up!" : " Room for improvement!"}
                  </p>
                </div>
              </div>

              {overdueTasks > 0 && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">
                    ⚠️
                  </div>
                  <div>
                    <p className="text-sm font-medium">Attention Needed</p>
                    <p className="text-xs text-gray-600">
                      You have {overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''}. 
                      Consider rescheduling or completing them soon.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  🎯
                </div>
                <div>
                  <p className="text-sm font-medium">Focus Areas</p>
                  <p className="text-xs text-gray-600">
                    Most of your tasks are in{" "}
                    {listStats.length > 0 && 
                      listStats.sort((a, b) => b.total - a.total)[0].name
                    }. 
                    Consider balancing your workload across different areas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-in Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Check-in Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl">🔥</div>
                <div className="text-lg font-bold">7</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl">📅</div>
                <div className="text-lg font-bold">28</div>
                <div className="text-xs text-gray-500">Days Active</div>
              </div>
              <div>
                <div className="text-2xl">🏆</div>
                <div className="text-lg font-bold">156</div>
                <div className="text-xs text-gray-500">Total Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}