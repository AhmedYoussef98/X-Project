import React from 'react';
import { BranchMetrics } from './BranchMetrics';
import { SetupCostsCard } from '../SetupCostsCard';
import { ControlPanel } from '../ControlPanel';
import { ForecastChart } from '../ForecastChart';
import { PerformanceChart } from '../PerformanceChart';
import { CostBreakdown } from '../CostBreakdown';
import { DataTable } from '../DataTable';
import { WarningBanner } from '../WarningBanner';
import type { Branch, MonthlyMetrics } from '../../types/business';
import { ROIMetricsCard } from '../ROIMetricsCard';
import { calculateBranchROI } from '../../utils/roiCalculations';

interface CostBreakdown {
  materials: number;
  marketing: number;
  fixed: number;
  total: number;
}

export interface BranchDetailsProps {
  branch: Branch;
  monthlyData: MonthlyMetrics[];
  costBreakdown: CostBreakdown | null;
  warnings: string[];
  averages: {
    avgRevenue: number;
    avgOrders: number;
    avgProfitMargin: number;
    avgNetProfit: number;
    avgTotalCosts: number;
    avgFixedCosts: number;
  } | null;
  onUpdateMetrics: (key: any, value: number) => void;
  onUpdateBranch: (updates: Partial<Branch>) => void;
  onDeleteBranch: (id: string) => void;
  onUpdateSetupCosts: (costs: any) => void;
}

// Helper function to calculate averages
const calculateAverages = (monthlyData: any[]) => {
  if (!monthlyData?.length) return null;

  const totalMonths = monthlyData.length;

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalOrders = monthlyData.reduce((sum, month) => sum + month.orders, 0);
  const totalProfitMargin = monthlyData.reduce((sum, month) => sum + month.profitMargin, 0);
  const totalNetProfit = monthlyData.reduce((sum, month) => sum + month.netProfit, 0);
  const totalCosts = monthlyData.reduce((sum, month) => sum + month.totalCosts, 0);

  return {
    avgRevenue: totalRevenue / totalMonths,
    avgOrders: totalOrders / totalMonths,
    avgProfitMargin: totalProfitMargin / totalMonths,
    avgTotalCosts: totalCosts / totalMonths,
    avgNetProfit: totalNetProfit / totalMonths,
  };
};

export function BranchDetails({
  branch,
  monthlyData,
  costBreakdown,
  warnings,
  onUpdateMetrics,
  onUpdateBranch,
  onDeleteBranch,
  onUpdateSetupCosts,
}: BranchDetailsProps) {
  const averages = calculateAverages(monthlyData);

  if (!monthlyData.length || !branch) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const roiMetrics = calculateBranchROI(branch);

  return (
    <>
      {warnings.length > 0 && <WarningBanner warnings={warnings} />}

      <BranchMetrics
        monthlyData={monthlyData}
        averages={averages}
        costBreakdown={costBreakdown}
        metrics={branch.metrics}
      />
      <ROIMetricsCard metrics={roiMetrics} branchName={branch.name} />

      {branch.setupCosts && (
        <SetupCostsCard
          branchName={branch.name}
          setupCosts={branch.setupCosts}
          onUpdate={onUpdateSetupCosts}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ControlPanel
            metrics={branch.metrics}
            onChange={onUpdateMetrics}
            onSave={() => onUpdateBranch({ metrics: branch.metrics })}
            onReset={() => {
              if (confirm('Reset all metrics to default values?')) {
                onDeleteBranch(branch.id);
              }
            }}
          />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <ForecastChart
            data={monthlyData}
            branchCapacity={branch.metrics.branchCapacity}
          />
          <PerformanceChart data={monthlyData} />
          <CostBreakdown data={monthlyData} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Monthly Performance Details
        </h2>
        <DataTable
          data={monthlyData}
          branchCapacity={branch.metrics.branchCapacity}
        />
      </div>
    </>
  );
}