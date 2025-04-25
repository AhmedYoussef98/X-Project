import React, { useState, useEffect } from 'react';

interface ParameterFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  prefix?: string;
  step?: number;
}

export function ParameterField({
  label,
  value,
  onChange,
  suffix = '',
  prefix = '',
  step = 1,
}: ParameterFieldProps) {
  const [localValue, setLocalValue] = useState(value.toString());

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Only update parent component if value is a valid number
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <div className="flex items-center">
          {prefix && (
            <span className="absolute left-3 text-gray-500">{prefix}</span>
          )}
          <input
            type="number"
            value={localValue}
            onChange={handleChange}
            step={step}
            className={`
              w-24 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${prefix ? 'pl-12' : 'pl-4'}
            `}
          />
          {suffix && (
            <span className="absolute right-3 text-gray-500">{suffix}</span>
          )}
        </div>
      </div>
    </div>
  );
}