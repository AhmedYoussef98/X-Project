import React from 'react';
import { Slider } from './Slider';
import { formatNumber } from '../../utils/formatting';
import { DEFAULT_RANGES } from '../../constants/businessRanges';
import type { BusinessMetrics } from '../../types/business';

interface MetricSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  metricKey: keyof BusinessMetrics;
  prefix?: string;
  suffix?: string;
}

export function MetricSlider({
  label,
  value,
  onChange,
  metricKey,
  prefix = '',
  suffix = '',
}: MetricSliderProps) {
  const range = DEFAULT_RANGES[metricKey];

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <Slider
        value={value}
        onChange={onChange}
        min={range.min}
        max={range.max}
        step={range.step}
        className="mt-2"
      />
      <div className="mt-1 text-sm text-gray-500">
        Current: {prefix}{formatNumber(value)}{suffix}
      </div>
    </div>
  );
}