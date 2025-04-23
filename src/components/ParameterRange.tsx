import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Slider } from './ui/Slider';

interface ParameterRangeProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  range: {
    min: number;
    max: number;
    step: number;
  };
  onRangeChange?: (range: { min: number; max: number; step: number }) => void;
  suffix?: string;
}

export function ParameterRange({
  label,
  value,
  onChange,
  range,
  onRangeChange,
  suffix = '',
}: ParameterRangeProps) {
  const [showRangeSettings, setShowRangeSettings] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {onRangeChange && (
          <button
            onClick={() => setShowRangeSettings(!showRangeSettings)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showRangeSettings ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <Slider
        value={value}
        onChange={onChange}
        min={range.min}
        max={range.max}
        step={range.step}
      />

      <div className="text-sm text-gray-500">
        Current: {value !== undefined ? value.toFixed(2) : '0.00'}{suffix}
      </div>

      {showRangeSettings && onRangeChange && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <label className="block text-xs text-gray-500">Min</label>
            <input
              type="number"
              value={range.min}
              onChange={(e) => onRangeChange({ ...range, min: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Max</label>
            <input
              type="number"
              value={range.max}
              onChange={(e) => onRangeChange({ ...range, max: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Step</label>
            <input
              type="number"
              value={range.step}
              onChange={(e) => onRangeChange({ ...range, step: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm border rounded"
              step="0.01"
            />
          </div>
        </div>
      )}
    </div>
  );
}