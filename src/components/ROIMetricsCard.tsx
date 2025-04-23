import React from 'react';
import { Calendar, TrendingUp, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import type { ROIMetrics } from '../types/roi';

interface ROIMetricsCardProps {
  metrics: ROIMetrics;
  branchName: string;
}

export function ROIMetricsCard({ metrics, branchName }: ROIMetricsCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Analysis - {branchName}</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">Investment Return</span>
          </div>
          <span className={`text-sm font-medium ${
            metrics.currentROIPercentage >= 100 ? 'text-green-600' : 'text-blue-600'
          }`}>
            {metrics.currentROIPercentage.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">Months to ROI</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {metrics.monthsToROI === Infinity ? '∞' : metrics.monthsToROI}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">Projected ROI Date</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {metrics.projectedROIDate.toLocaleDateString()}
          </span>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Investment</span>
            <span className="text-sm font-medium text-gray-900">
              SAR {metrics.totalInvestment.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">Average Monthly Profit</span>
            <span className="text-sm font-medium text-gray-900">
              SAR {metrics.monthlyProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}