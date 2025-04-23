import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/Card';
import type { Branch } from '../types/business';

interface OverviewWarningsProps {
  branches: Branch[];
}

export function OverviewWarnings({ branches }: OverviewWarningsProps) {
  const analyzePerformance = () => {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Calculate overall metrics
    const totalBranches = branches.length;
    let totalUtilization = 0;
    let totalMargin = 0;
    let lowMarginBranches = 0;
    let highUtilizationBranches = 0;

    branches.forEach(branch => {
      const lastMonth = branch.monthlyData[branch.monthlyData.length - 1];
      const utilization = (lastMonth.orders / (branch.metrics.branchCapacity * 30)) * 100;
      const margin = lastMonth.profitMargin;

      totalUtilization += utilization;
      totalMargin += margin;

      if (margin < 20) lowMarginBranches++;
      if (utilization > 85) highUtilizationBranches++;
    });

    const avgUtilization = totalUtilization / totalBranches;
    const avgMargin = totalMargin / totalBranches;

    // Generate warnings
    if (avgUtilization > 80) {
      warnings.push(`Average capacity utilization is ${avgUtilization.toFixed(1)}% across all branches`);
    }
    if (highUtilizationBranches > 0) {
      warnings.push(`${highUtilizationBranches} branch${highUtilizationBranches > 1 ? 'es' : ''} operating above 85% capacity`);
    }
    if (avgMargin < 20) {
      warnings.push(`Average profit margin is below target at ${avgMargin.toFixed(1)}%`);
    }
    if (lowMarginBranches > 0) {
      warnings.push(`${lowMarginBranches} branch${lowMarginBranches > 1 ? 'es' : ''} operating below 20% profit margin`);
    }

    // Generate recommendations
    if (avgUtilization > 80) {
      recommendations.push('Consider expanding capacity or opening new branches');
    }
    if (avgMargin < 20) {
      recommendations.push('Review pricing strategy and cost structure');
    }
    if (highUtilizationBranches > 0) {
      recommendations.push('Optimize resource allocation across branches');
    }
    if (lowMarginBranches > 0) {
      recommendations.push('Implement cost-saving measures in underperforming branches');
    }

    return { warnings, recommendations };
  };

  const { warnings, recommendations } = analyzePerformance();
  const hasIssues = warnings.length > 0;

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        {hasIssues ? (
          <AlertTriangle className="h-6 w-6 text-amber-500" />
        ) : (
          <CheckCircle className="h-6 w-6 text-green-500" />
        )}
        <h3 className="text-lg font-semibold text-gray-900">
          System Health Check
        </h3>
      </div>

      <div className="space-y-6">
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>Attention Required</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>Recommendations</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!hasIssues && (
          <p className="text-sm text-gray-600">
            All branches are operating within optimal parameters.
          </p>
        )}
      </div>
    </Card>
  );
}