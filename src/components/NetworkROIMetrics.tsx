import React from 'react';
import { TrendingUp, Clock, Building2 } from 'lucide-react';
import { Card } from './ui/Card';
import type { NetworkROIMetrics } from '../types/roi';

interface NetworkROIMetricsProps {
  metrics: NetworkROIMetrics;
}

export function NetworkROIMetrics({ metrics }: NetworkROIMetricsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Network ROI Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">Network ROI Progress</span>
            </div>
            <span className={`text-sm font-medium ${
              metrics.currentNetworkROIPercentage >= 100 ? 'text-green-600' : 'text-blue-600'
            }`}>
              {metrics.currentNetworkROIPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">Average Months to ROI</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {metrics.averageMonthsToROI.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Network Investment</span>
            <span className="text-sm font-medium text-gray-900">
              SAR {metrics.totalNetworkInvestment.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">ROI Leaders</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Fastest ROI</span>
                </div>
                <span className="text-sm text-gray-900">
                  {metrics.fastestROI.branchName} ({metrics.fastestROI.monthsToROI} months)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600">Slowest ROI</span>
                </div>
                <span className="text-sm text-gray-900">
                  {metrics.slowestROI.branchName} ({metrics.slowestROI.monthsToROI} months)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projected Network ROI Date</span>
              <span className="text-sm font-medium text-gray-900">
                {metrics.projectedNetworkROIDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}