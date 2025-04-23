import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from './ui/Card';
import { MetricToggle } from './MetricToggle';
import type { Branch } from '../types/business';

interface AggregatedChartsProps {
  branches: Branch[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function AggregatedCharts({ branches }: AggregatedChartsProps) {
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'profit']);

  const aggregateMonthlyData = () => {
    const monthlyTotals: Record<number, {
      month: number;
      revenue: number;
      profit: number;
      costs: number;
    }> = {};

    branches.forEach(branch => {
      branch.monthlyData.forEach(month => {
        if (!monthlyTotals[month.month]) {
          monthlyTotals[month.month] = {
            month: month.month,
            revenue: 0,
            profit: 0,
            costs: 0,
          };
        }
        monthlyTotals[month.month].revenue += month.revenue;
        monthlyTotals[month.month].profit += month.netProfit;
        monthlyTotals[month.month].costs += month.totalCosts;
      });
    });

    return Object.values(monthlyTotals);
  };

  const calculateBranchContribution = () => {
    return branches.map(branch => ({
      name: branch.name,
      value: branch.monthlyData.reduce((sum, month) => sum + month.revenue, 0),
    }));
  };

  const monthlyData = aggregateMonthlyData();
  const branchContribution = calculateBranchContribution();

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          <div className="flex gap-2">
            <MetricToggle
              label="Revenue"
              color="#3B82F6"
              active={selectedMetrics.includes('revenue')}
              onChange={() => toggleMetric('revenue')}
            />
            <MetricToggle
              label="Profit"
              color="#10B981"
              active={selectedMetrics.includes('profit')}
              onChange={() => toggleMetric('profit')}
            />
            <MetricToggle
              label="Costs"
              color="#EF4444"
              active={selectedMetrics.includes('costs')}
              onChange={() => toggleMetric('costs')}
            />
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `SAR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                  ''
                ]}
              />
              <Legend />
              {selectedMetrics.includes('revenue') && (
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  name="Revenue"
                  strokeWidth={2}
                />
              )}
              {selectedMetrics.includes('profit') && (
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  name="Profit"
                  strokeWidth={2}
                />
              )}
              {selectedMetrics.includes('costs') && (
                <Line
                  type="monotone"
                  dataKey="costs"
                  stroke="#EF4444"
                  name="Costs"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={branchContribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {branchContribution.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => 
                    `SAR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Cost Structure</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => 
                    `SAR ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  }
                />
                <Legend />
                <Bar dataKey="costs" fill="#EF4444" name="Total Costs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}