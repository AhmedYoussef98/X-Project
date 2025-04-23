import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { Download } from 'lucide-react';
import { Card } from './ui/Card';
import { exportToPDF } from '../utils/export';
import type { MonthlyMetrics } from '../types/business';

interface CostBreakdownProps {
  data: MonthlyMetrics[];
  loading?: boolean;
  error?: string;
}

const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 4}
      fill="#6b7280"
      textAnchor="middle"
      fontSize="12"
    >
      {value.toFixed(2)}
    </text>
  );
};

export function CostBreakdown({ data, loading, error }: CostBreakdownProps) {
  const chartData = data.map(month => ({
    month: `Month ${month.month}`,
    Delivery: month.deliveryCost,
    Materials: month.materialsCost,
    Fixed: month.fixedCosts,
  }));

  return (
    <Card loading={loading} error={error} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Cost Structure Analysis
        </h2>
        <button
          onClick={() => exportToPDF(data)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 
            dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg 
            transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`SAR ${value.toFixed(2)}`, '']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend />
            <Bar
              dataKey="Delivery"
              stackId="a"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            >
              <LabelList content={<CustomLabel />} position="top" />
            </Bar>
            <Bar
              dataKey="Materials"
              stackId="a"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            >
              <LabelList content={<CustomLabel />} position="top" />
            </Bar>
            <Bar
              dataKey="Fixed"
              stackId="a"
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
            >
              <LabelList content={<CustomLabel />} position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}