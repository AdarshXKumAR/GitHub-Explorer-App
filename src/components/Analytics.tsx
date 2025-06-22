import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { Card } from './ui/Card';
import { GitHubRepository } from '../types/github';
import { getLanguageDistribution, getCreationTimeline, getSizeDistribution } from '../utils/analytics';
import { formatNumber } from '../utils/formatters';

interface AnalyticsProps {
  repositories: GitHubRepository[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ repositories }) => {
  const languageData = getLanguageDistribution(repositories);
  const timelineData = getCreationTimeline(repositories);
  const sizeData = getSizeDistribution(repositories);
  
  const scatterData = repositories.map(repo => ({
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    name: repo.name
  }));

  const COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, language }: any) => {
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
        className="text-xs font-bold"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const EmptyStateCard = ({ title, message }: { title: string; message: string }) => (
    <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📊</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-xs">{message}</p>
      </div>
    </Card>
  );

  if (repositories.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            Repository Analytics
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Visual insights into the GitHub ecosystem based on your search results
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EmptyStateCard 
            title="Language Distribution" 
            message="Search for repositories to see language distribution and insights"
          />
          <EmptyStateCard 
            title="Stars vs Forks" 
            message="Explore repositories to view correlation between stars and forks"
          />
          <EmptyStateCard 
            title="Creation Timeline" 
            message="Find repositories to see when they were created over time"
          />
          <EmptyStateCard 
            title="Repository Sizes" 
            message="Discover repositories to analyze their size distribution"
          />
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
    >
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
        >
          Repository Analytics
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Visual insights into the GitHub ecosystem based on your search results
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Language Distribution - Ring Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Language Distribution
            </h3>
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
                  dataKey="count"
                  stroke="none"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.language}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {data.count} repositories
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {languageData.slice(0, 6).map((entry, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {entry.language}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Stars vs Forks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Stars vs Forks Correlation
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart data={scatterData}>
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
                        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.name}</p>
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
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-indigo-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Repository Data Points</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Creation Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Repository Creation Timeline
            </h3>
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
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  dot={{ fill: '#10b981', strokeWidth: 3, r: 6 }}
                  activeDot={{ r: 8, fill: '#10b981', stroke: '#065f46', strokeWidth: 2 }}
                  filter="drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3))"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Repositories Created</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Repository Sizes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Repository Size Distribution
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                  filter="drop-shadow(0 4px 6px rgba(99, 102, 241, 0.3))"
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-indigo-500 to-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Repository Count by Size</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};