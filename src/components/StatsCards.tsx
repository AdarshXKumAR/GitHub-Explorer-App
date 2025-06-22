import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, Code, Users } from 'lucide-react';
import { Card } from './ui/Card';
import { RepoStats } from '../types/github';
import { formatNumber } from '../utils/formatters';

interface StatsCardsProps {
  stats: RepoStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statItems = [
    {
      icon: GitBranch,
      value: formatNumber(stats.totalRepos),
      label: 'Repositories Found',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Star,
      value: formatNumber(stats.totalStars),
      label: 'Total Stars',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Code,
      value: stats.topLanguage,
      label: 'Top Language',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      value: formatNumber(stats.avgForks),
      label: 'Avg Forks',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="p-6 relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
              
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color}`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};