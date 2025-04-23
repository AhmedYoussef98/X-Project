import React from 'react';
import { Building2, Download } from 'lucide-react';
import { Card } from './ui/Card';
import { exportSetupCostsToPDF } from '../utils/export';
import type { BranchSetupCosts } from '../types/business';

interface SetupCostsCardProps {
  branchName: string;
  setupCosts: BranchSetupCosts;
  onUpdate?: (costs: BranchSetupCosts) => void;
  readonly?: boolean;
}

export function SetupCostsCard({
  branchName,
  setupCosts,
  onUpdate,
  readonly = false,
}: SetupCostsCardProps) {
  if (!setupCosts) {
    return <div>No setup costs available</div>;
  }

  const totalCost = Object.values(setupCosts).reduce((sum, cost) => sum + cost, 0);

  const handleCostUpdate = (key: keyof BranchSetupCosts, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return;
    
    onUpdate?.({
      ...setupCosts,
      [key]: numValue,
    });
  };

  const costItems = [
    { key: 'constructionCost', label: 'Construction' },
    { key: 'equipmentCost', label: 'Equipment' },
    { key: 'licensingCost', label: 'Licensing & Permits' },
    { key: 'initialInventoryCost', label: 'Initial Inventory' },
  ] as const;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Initial Setup Costs</h3>
            <p className="text-sm text-gray-500">{branchName}</p>
          </div>
        </div>
        {readonly && (
          <button
            onClick={() => exportSetupCostsToPDF(branchName, setupCosts)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {costItems.map(({ key, label }) => (
          <div key={key} className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
            {readonly ? (
              <span className="text-sm text-gray-900">
                SAR {setupCosts[key].toLocaleString()}
              </span>
            ) : (
              <input
                type="number"
                value={setupCosts[key]}
                onChange={(e) => handleCostUpdate(key, e.target.value)}
                min="0"
                step="1000"
                className="w-32 px-3 py-1 text-right border rounded-md focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Setup Cost</span>
            <span className="font-semibold text-gray-900">
              SAR {totalCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}