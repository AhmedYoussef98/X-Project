import React from 'react';
import { Building2, Download } from 'lucide-react';
import { Card } from './ui/Card';
import { exportNetworkCostsToPDF } from '../utils/export';
import type { Branch } from '../types/business';

interface NetworkSetupCostsProps {
  branches: Branch[];
}

export function NetworkSetupCosts({ branches }: NetworkSetupCostsProps) {
  const totalNetworkCost = branches.reduce(
    (sum, branch) => sum + Object.values(branch.setupCosts || {}).reduce((a, b) => a + b, 0),
    0
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Building2 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Total Network Setup Costs</h3>
            <p className="text-sm text-gray-500">{branches.length} Branches</p>
          </div>
        </div>
        <button
          onClick={() => exportNetworkCostsToPDF(branches)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {branches.map((branch) => {
          const branchTotal = Object.values(branch.setupCosts || {}).reduce((a, b) => a + b, 0);
          return (
            <div key={branch.id} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {branch.name}
              </span>
              <span className="text-sm text-gray-900">
                SAR {branchTotal.toLocaleString()}
              </span>
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Network Total</span>
            <span className="font-semibold text-gray-900">
              SAR {totalNetworkCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}