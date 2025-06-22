import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { Card } from './ui/Card';
import { GitHubRepository } from '../types/github';
import { formatNumber } from '../utils/formatters';

interface RepositoryAnalyticsProps {
  repository: GitHubRepository;
}

export const RepositoryAnalytics: React.FC<RepositoryAnalyticsProps> = ({ repository }) => {
  // Mock data for individual repository analytics
  const languageData = repository.language ? [
    { name: repository.language, value: 85, color: '#6366f1' },
    { name: 'Other', value: 15, color: '#e5e7eb' }
  ] : [];

  const starsVsForks = [
    { 
      name: repository.name,
      stars: repository.stargazers_count,
      forks: repository.forks_count
    }
  ];

  const timelineData = [
    { month: 'Jan', commits: 45 },
    { month: 'Feb', commits: 52 },
    { month: 'Mar', commits: 38 },
    { month: 'Apr', commits: 61 },
    { month: 'May', commits: 55 },
    { month: 'Jun', commits: 67 }
  ];

  const sizeData = [
    { category: 'Code', size: repository.size * 0.7, color: '#6366f1' },
    { category: 'Assets', size: repository.size * 0.2, color: '#ec4899' },
    { category: 'Docs', size: repository.size * 0.1, color: '#06b6d4' }
  ];

  const COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? formatNumber(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-bold"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const EmptyStateCard = ({ title, message }: { title: string; message: string }) => (
    <Card className="p-6 bg-white dark:bg-gray-800 flex flex-col items-center justify-center min-h-[350px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">{message}</p>
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Repository Analytics
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed insights for {repository.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution - Ring Chart */}
        {languageData.length > 0 ? (
          <Card className="p-6 bg-white dark:bg-gray-800">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Language Distribution
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  innerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="none"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {data.value}% of repository
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-4">
                {languageData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <EmptyStateCard 
            title="Language Distribution" 
            message="Search for repositories to see language distribution data and insights"
          />
        )}

        {/* Stars vs Forks - Fixed height to match pie chart */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Stars vs Forks Correlation
          </h4>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart data={[{ stars: repository.stargazers_count, forks: repository.forks_count, name: repository.name }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis 
                dataKey="stars" 
                scale="log" 
                domain={['dataMin', 'dataMax']}
                name="Stars"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                axisLine={false}
              />
              <YAxis 
                dataKey="forks" 
                scale="log" 
                domain={['dataMin', 'dataMax']}
                name="Forks"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          ⭐ Stars: {formatNumber(data.stars)}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          🍴 Forks: {formatNumber(data.forks)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                dataKey="forks" 
                fill="#6366f1" 
                fillOpacity={0.8}
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Repository Data Point</span>
            </div>
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Recent Activity Timeline
          </h4>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'currentColor', fontSize: 12 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fill: 'currentColor', fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="commits" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#10b981' }}
                name="Commits"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Commits</span>
            </div>
          </div>
        </Card>

        {/* Repository Size Breakdown */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Repository Size Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={sizeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={70}
                fill="#8884d8"
                dataKey="size"
                stroke="none"
              >
                {sizeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{data.category}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatNumber(data.size)} KB
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-4">
              {sizeData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};