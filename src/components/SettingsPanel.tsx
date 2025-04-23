import React, { useState } from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { Card } from './ui/Card';
import { ParameterRange } from './ParameterRange';
import { DEFAULT_RANGES } from '../constants/businessRanges';
import type { BusinessMetrics } from '../types/business';

interface SettingsPanelProps {
  metrics: BusinessMetrics;
  onChange: (key: keyof BusinessMetrics, value: number) => void;
  ranges?: Partial<typeof DEFAULT_RANGES>;
  onRangeChange?: (key: keyof BusinessMetrics, range: { min: number; max: number; step: number }) => void;
}

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border rounded-lg">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-700">{title}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

export function SettingsPanel({ 
  metrics, 
  onChange, 
  ranges = DEFAULT_RANGES,
  onRangeChange 
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sections = {
    operations: {
      title: 'Business Operations',
      metrics: ['dailyOrders', 'branchCapacity', 'monthlyGrowthRate'] as const,
    },
    pricing: {
      title: 'Pricing & Marketing',
      metrics: ['averageOrderPrice', 'deliveryCostPerCustomer'] as const,
    },
    costs: {
      title: 'Operating Costs',
      metrics: ['detergentCost', 'packagingCost', 'otherMaterialCosts'] as const,
    },
    fixed: {
      title: 'Fixed Costs',
      metrics: ['monthlyRent', 'staffCount', 'monthlyStaffCostPerPerson', 'monthlyUtilities'] as const,
    },
  };

  const labels: Record<keyof BusinessMetrics, string> = {
    dailyOrders: 'Daily Orders',
    branchCapacity: 'Branch Capacity',
    monthlyGrowthRate: 'Monthly Growth Rate',
    averageOrderPrice: 'Average Order Price',
    deliveryCostPerCustomer: 'Marketing Cost per Customer',
    detergentCost: 'Detergent Cost per Order',
    packagingCost: 'Packaging Cost per Order',
    otherMaterialCosts: 'Other Material Costs per Order',
    monthlyRent: 'Monthly Rent',
    staffCount: 'Staff Count',
    monthlyStaffCostPerPerson: 'Monthly Staff Cost per Person',
    monthlyUtilities: 'Monthly Utilities',
  };

  const suffixes: Partial<Record<keyof BusinessMetrics, string>> = {
    dailyOrders: ' orders/day',
    branchCapacity: ' orders/day',
    monthlyGrowthRate: '%',
    staffCount: ' people',
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Toggle Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <Card className="w-96 max-h-[80vh] overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Parameter Settings</h2>
          </div>

          {Object.entries(sections).map(([key, section]) => (
            <SettingsSection key={key} title={section.title}>
              {section.metrics.map((metricKey) => (
                <ParameterRange
                  key={metricKey}
                  label={labels[metricKey]}
                  value={metrics[metricKey]}
                  onChange={(value) => onChange(metricKey, value)}
                  range={ranges[metricKey] || DEFAULT_RANGES[metricKey]}
                  onRangeChange={(range) => onRangeChange?.(metricKey, range)}
                  suffix={suffixes[metricKey] || (metricKey.includes('Cost') ? ' SAR' : '')}
                />
              ))}
            </SettingsSection>
          ))}
        </Card>
      )}
    </div>
  );
}