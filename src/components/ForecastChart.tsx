import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MetricToggle } from './MetricToggle';
import type { MonthlyMetrics } from '../types/business';

interface ForecastChartProps {
  data: MonthlyMetrics[];
  branchCapacity: number;
}

interface MetricConfig {
  key: string;
  label: string;
  color: string;
  formatter?: (value: number) => string;
}

const metrics: MetricConfig[] = [
  { key: 'orders', label: 'Orders', color: '#3B82F6' },
  { key: 'capacityUtilization', label: 'Capacity Utilization', color: '#10B981' },
  { key: 'deliveryCostPerItem', label: 'Delivery Cost/Item', color: '#F59E0B' },
  { key: 'materialsCostPerItem', label: 'Materials Cost/Item', color: '#EF4444' },
  { key: 'fixedCostsPerItem', label: 'Fixed Costs/Item', color: '#8B5CF6' },
  { key: 'revenue', label: 'Revenue', color: '#14B8A6' },
  { key: 'profitMargin', label: 'Net Profit Margin', color: '#EC4899' },
];

const formatValue = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
};

export function ForecastChart({ data, branchCapacity }: ForecastChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(
    new Set(['orders', 'capacityUtilization', 'profitMargin'])
  );

  const toggleMetric = (key: string) => {
    const newActiveMetrics = new Set(activeMetrics);
    if (newActiveMetrics.has(key)) {
      newActiveMetrics.delete(key);
    } else {
      newActiveMetrics.add(key);
    }
    setActiveMetrics(newActiveMetrics);
  };

  const chartData = data.map(month => ({
    month: `Month ${month.month}`,
    orders: month.orders,
    capacityUtilization: (month.orders / (branchCapacity * 30)) * 100,
    deliveryCostPerItem: month.deliveryCost / month.orders,
    materialsCostPerItem: month.materialsCost / month.orders,
    fixedCostsPerItem: month.fixedCosts / month.orders,
    revenue: month.revenue,
    profitMargin: month.profitMargin,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">12-Month Forecast</h2>
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <MetricToggle
              key={metric.key}
              label={metric.label}
              color={metric.color}
              active={activeMetrics.has(metric.key)}
              onChange={() => toggleMetric(metric.key)}
            />
          ))}
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [
                formatValue(value),
                activeMetrics.has('capacityUtilization') ? '%' : 'SAR'
              ]}
            />
            <Legend />
            {metrics.map(metric => (
              activeMetrics.has(metric.key) && (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  name={metric.label}
                  dot={false}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}