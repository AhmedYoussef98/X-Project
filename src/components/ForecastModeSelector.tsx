import React from 'react';
import { ParameterField } from './ParameterField';
import { MONTH_NAMES, DEFAULT_MONTHLY_GROWTH_RATES, DEFAULT_FIXED_MONTHLY_ORDERS } from '../constants/businessRanges';
import type { BusinessMetrics, ForecastMode } from '../types/business';

interface ForecastModeSelectorProps {
  metrics: BusinessMetrics;
  onChange: (key: keyof BusinessMetrics, value: any) => void;
}

// Reusable Button Component
const ForecastModeButton = ({
  mode,
  currentMode,
  onClick,
  label,
}: {
  mode: ForecastMode;
  currentMode: ForecastMode;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      currentMode === mode
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-700 border border-gray-300'
    }`}
  >
    {label}
  </button>
);

// Reusable Section Wrapper
const ForecastModeSection = ({
  children,
  description,
}: {
  children: React.ReactNode;
  description: string;
}) => (
  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
    <p className="text-sm text-gray-500">{description}</p>
    {children}
  </div>
);

export function ForecastModeSelector({ metrics, onChange }: ForecastModeSelectorProps) {
  // Ensure arrays exist (for backward compatibility with existing data)
  const monthlyGrowthRates = Array.isArray(metrics.monthlyGrowthRates)
    ? metrics.monthlyGrowthRates
    : [...DEFAULT_MONTHLY_GROWTH_RATES];

  const fixedMonthlyOrders = Array.isArray(metrics.fixedMonthlyOrders)
    ? metrics.fixedMonthlyOrders
    : [...DEFAULT_FIXED_MONTHLY_ORDERS];

  const handleModeChange = (mode: ForecastMode) => onChange('forecastMode', mode);

  const handleGrowthRateChange = (index: number, value: number) => {
    const newRates = [...monthlyGrowthRates];
    newRates[index] = value;
    onChange('monthlyGrowthRates', newRates);
  };

  const handleFixedOrdersChange = (index: number, value: number) => {
    const newOrders = [...fixedMonthlyOrders];
    newOrders[index] = value;
    onChange('fixedMonthlyOrders', newOrders);
  };

  return (
    <div className="space-y-6">
      {/* Forecast Mode Buttons */}
      <div className="space-y-2">
        <h3 className="text-md font-medium text-gray-900">Forecast Mode</h3>
        <div className="flex flex-wrap gap-2">
          <ForecastModeButton
            mode="single-growth"
            currentMode={metrics.forecastMode}
            onClick={() => handleModeChange('single-growth')}
            label="Single Growth Rate"
          />
          <ForecastModeButton
            mode="monthly-growth"
            currentMode={metrics.forecastMode}
            onClick={() => handleModeChange('monthly-growth')}
            label="Monthly Growth Rates"
          />
          <ForecastModeButton
            mode="fixed-orders"
            currentMode={metrics.forecastMode}
            onClick={() => handleModeChange('fixed-orders')}
            label="Fixed Monthly Orders"
          />
        </div>
      </div>

      {/* Forecast Mode Sections */}
      {metrics.forecastMode === 'single-growth' && (
        <ForecastModeSection description="Orders will grow by this percentage each month.">
          <ParameterField
            label="Monthly Growth Rate"
            value={metrics.monthlyGrowthRate}
            onChange={(value: number) => onChange('monthlyGrowthRate', value)}
            suffix="%"
            step={0.1}
          />
        </ForecastModeSection>
      )}

      {metrics.forecastMode === 'monthly-growth' && (
        <ForecastModeSection description="Set individual growth rates for each month. Positive values increase orders, negative values decrease them.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTH_NAMES.map((month, index) => (
              <ParameterField
                key={month}
                label={month}
                value={monthlyGrowthRates[index] || 0}
                onChange={(value: number) => handleGrowthRateChange(index, value)}
                suffix="%"
                step={0.1}
              />
            ))}
          </div>
        </ForecastModeSection>
      )}

      {metrics.forecastMode === 'fixed-orders' && (
        <ForecastModeSection description="Set fixed number of orders for each month. These values will directly determine your monthly figures.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTH_NAMES.map((month, index) => (
              <ParameterField
                key={month}
                label={month}
                value={fixedMonthlyOrders[index] || metrics.dailyOrders * 30}
                onChange={(value: number) => handleFixedOrdersChange(index, value)}
                suffix=" "
                step={1}
                // Adjusted size for larger numbers
              />
            ))}
          </div>
        </ForecastModeSection>
      )}
    </div>
  );
}