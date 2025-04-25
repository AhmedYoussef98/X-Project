import React from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { MetricSlider } from './ui/MetricSlider';
import { ParameterField } from './ParameterField';
import { SettingsSection } from './ui/SettingsSection';
import { ForecastModeSelector } from './ForecastModeSelector';
import type { BusinessMetrics } from '../types/business';

interface ControlPanelProps {
  metrics: BusinessMetrics;
  onChange: (key: keyof BusinessMetrics, value: any) => void;
  onReset: () => void;
  onSave: () => void;
}

export function ControlPanel({ metrics, onChange, onReset, onSave }: ControlPanelProps) {
  const sections = {
    operations: {
      title: 'Business Operations',
      metrics: [
        { key: 'dailyOrders', label: 'Daily Orders', suffix: ' orders/day', prefix: '', useField: true },
        { key: 'branchCapacity', label: 'Branch Capacity', suffix: ' orders/day', prefix: '', useField: false },
      ],
    },
    pricing: {
      title: 'Pricing & Delivery',
      metrics: [
        { key: 'averageOrderPrice', label: 'Average Order Price', prefix: 'SAR ', suffix: '', useField: false },
        { key: 'deliveryCostPerCustomer', label: 'Delivery Cost per Customer/Order', prefix: 'SAR ', suffix: '', useField: false },
      ],
    },
    costs: {
      title: 'Operating Costs',
      metrics: [
        { key: 'detergentCost', label: 'Detergent Cost per Order', prefix: 'SAR ', suffix: '', useField: false },
        { key: 'packagingCost', label: 'Packaging Cost per Order', prefix: 'SAR ', suffix: '', useField: false },
        { key: 'otherMaterialCosts', label: 'Other Material Costs per Order', prefix: 'SAR ', suffix: '', useField: false },
      ],
    },
    fixed: {
      title: 'Fixed Costs',
      metrics: [
        { key: 'monthlyRent', label: 'Monthly Rent', prefix: 'SAR ', suffix: '', useField: false },
        { key: 'staffCount', label: 'Staff Count', suffix: ' people', prefix: '', useField: false },
        { key: 'monthlyStaffCostPerPerson', label: 'Monthly Staff Cost per Person', prefix: 'SAR ', suffix: '', useField: false },
        { key: 'monthlyUtilities', label: 'Monthly Utilities', prefix: 'SAR ', suffix: '', useField: false },
      ],
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Business Settings</h2>
        <div className="flex space-x-2">
          <button
            onClick={onReset}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            title="Reset to defaults"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={onSave}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
            title="Save configuration"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Forecast Settings Section */}
        <SettingsSection title="Forecast Settings">
          <ForecastModeSelector
            metrics={metrics}
            onChange={onChange}
          />
        </SettingsSection>

        {/* Other Sections */}
        {Object.entries(sections).map(([key, section]) => (
          <SettingsSection key={key} title={section.title}>
            {section.metrics.map((metric) => (
              <React.Fragment key={metric.key}>
                {metric.useField ? (
                  <ParameterField
                    label={metric.label}
                    value={metrics[metric.key as keyof BusinessMetrics] as number}
                    onChange={(value: number) => onChange(metric.key as keyof BusinessMetrics, value)}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    step={1}
                  />
                ) : (
                  <MetricSlider
                    label={metric.label}
                    value={metrics[metric.key as keyof BusinessMetrics] as number}
                    onChange={(value) => onChange(metric.key as keyof BusinessMetrics, value)}
                    metricKey={metric.key as keyof BusinessMetrics}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                  />
                )}
              </React.Fragment>
            ))}
          </SettingsSection>
        ))}
      </div>
    </div>
  );
}