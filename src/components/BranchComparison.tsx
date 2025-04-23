import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from './ui/Card';
import type { BranchSummary } from '../types/business';

interface BranchComparisonProps {
  branches: (BranchSummary & { id: string; name: string; location: string; })[];
  onBranchSelect: (branchId: string) => void;
}

type SortKey = 'revenue' | 'profit' | 'margin' | 'utilization';

export function BranchComparison({ branches, onBranchSelect }: BranchComparisonProps) {
  const [sortKey, setSortKey] = useState<SortKey>('profit');
  const [sortDesc, setSortDesc] = useState(true);

  const sortedBranches = [...branches].sort((a, b) => {
    const getValue = (branch: typeof branches[0]) => {
      switch (sortKey) {
        case 'revenue': return branch.totalRevenue;
        case 'profit': return branch.totalProfit;
        case 'margin': return branch.averageMargin;
        case 'utilization': return branch.averageUtilization;
        default: return 0;
      }
    };
    return sortDesc
      ? getValue(b) - getValue(a)
      : getValue(a) - getValue(b);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const SortHeader = ({ label, sortId }: { label: string; sortId: SortKey }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
      onClick={() => handleSort(sortId)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortKey === sortId && (
          <span className="text-gray-400">
            {sortDesc ? '↓' : '↑'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Branch Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <SortHeader label="Revenue" sortId="revenue" />
              <SortHeader label="Profit" sortId="profit" />
              <SortHeader label="Margin" sortId="margin" />
              <SortHeader label="Utilization" sortId="utilization" />
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedBranches.map((branch, index) => (
              <tr
                key={branch.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {branch.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {branch.location}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    SAR {branch.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    SAR {branch.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {branch.averageMargin.toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {branch.averageUtilization.toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {index === 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                  ) : index === sortedBranches.length - 1 ? (
                    <ArrowDownRight className="h-5 w-5 text-red-500" />
                  ) : null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onBranchSelect(branch.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}