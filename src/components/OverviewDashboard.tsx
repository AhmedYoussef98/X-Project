import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card } from './ui/Card';
import { MetricsCard } from './MetricsCard';
import { BranchComparison } from './BranchComparison';
import { AggregatedCharts } from './AggregatedCharts';
import { OverviewWarnings } from './OverviewWarnings';
import type { Branch, BranchSummary } from '../types/business';
import { NetworkROIMetrics } from './NetworkROIMetrics';
import { calculateNetworkROI } from '../utils/roiCalculations';

interface OverviewDashboardProps {
  branches: Branch[];
  onBranchSelect: (branchId: string) => void;
}

function calculateBranchSummary(branch: Branch): BranchSummary {
  const lastMonth = branch.monthlyData[branch.monthlyData.length - 1];
  const totalRevenue = branch.monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalProfit = branch.monthlyData.reduce((sum, month) => sum + month.netProfit, 0);
  const totalOrders = branch.monthlyData.reduce((sum, month) => sum + month.orders, 0);
  const averageMargin = totalProfit / totalRevenue * 100;
  const averageUtilization = (lastMonth.orders / (branch.metrics.branchCapacity * 30)) * 100;

  return {
    totalRevenue,
    totalProfit,
    averageMargin,
    totalOrders,
    averageUtilization,
  };
}

function calculateOverallMetrics(branches: Branch[]) {
  if (!branches.length) {
    return {
      totalRevenue: 0,
      totalProfit: 0,
      totalOrders: 0,
      averageMargin: 0,
      averageUtilization: 0,
      branchSummaries: [],
    };
  }

  const summaries = branches.map(calculateBranchSummary);
  
  return {
    totalRevenue: summaries.reduce((sum, s) => sum + s.totalRevenue, 0),
    totalProfit: summaries.reduce((sum, s) => sum + s.totalProfit, 0),
    totalOrders: summaries.reduce((sum, s) => sum + s.totalOrders, 0),
    averageMargin: summaries.reduce((sum, s) => sum + s.averageMargin, 0) / summaries.length,
    averageUtilization: summaries.reduce((sum, s) => sum + s.averageUtilization, 0) / summaries.length,
    branchSummaries: summaries,
  };
}

export function OverviewDashboard({ branches, onBranchSelect }: OverviewDashboardProps) {
  const metrics = calculateOverallMetrics(branches);
  const branchComparisons = branches.map((branch, index) => ({
    id: branch.id,
    name: branch.name,
    location: branch.location,
    ...calculateBranchSummary(branch),
  }));

  // Sort branches by profit for quick insights
  const sortedBranches = [...branchComparisons].sort((a, b) => b.totalProfit - a.totalProfit);
  const bestPerformer = sortedBranches[0];
  const worstPerformer = sortedBranches[sortedBranches.length - 1];

  if (!branches.length) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Active Branches</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enable branches in the Branch Management section to view analytics.
          </p>
        </div>
      </Card>
    );
  }

  const networkROIMetrics = calculateNetworkROI(branches);

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Overview</h2>
        <p className="mt-1 text-gray-600">
          Consolidated performance across {branches.length} branches
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Revenue"
          value={`SAR ${metrics.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtitle={`${metrics.totalOrders.toLocaleString()} total orders`}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
        />
        <MetricsCard
          title="Average Profit Margin"
          value={`${metrics.averageMargin.toFixed(1)}%`}
          subtitle={`SAR ${metrics.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} total profit`}
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
        />
        <MetricsCard
          title="Active Branches"
          value={branches.length}
          subtitle="Click to view details"
          icon={<Building2 className="h-6 w-6 text-purple-600" />}
        />
        <MetricsCard
          title="Avg. Capacity Usage"
          value={`${metrics.averageUtilization.toFixed(1)}%`}
          subtitle="Across all branches"
          icon={<Users className="h-6 w-6 text-orange-600" />}
        />
      </div>

      {/* Performance Highlights */}
      {sortedBranches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performer</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{bestPerformer.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  SAR {bestPerformer.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-gray-500">Total Profit</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Needs Attention</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{worstPerformer.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  SAR {worstPerformer.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-gray-500">Total Profit</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Warnings and Recommendations */}
      <OverviewWarnings branches={branches} />
<NetworkROIMetrics metrics={networkROIMetrics} />
      {/* Aggregated Charts */}
      <AggregatedCharts branches={branches} />

      {/* Branch Comparison */}
      <BranchComparison
        branches={branchComparisons}
        onBranchSelect={onBranchSelect}
      />
    </div>
  );
}