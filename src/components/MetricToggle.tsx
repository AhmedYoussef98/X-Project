import React from 'react';

interface MetricToggleProps {
  label: string;
  color: string;
  active: boolean;
  onChange: () => void;
}

export function MetricToggle({ label, color, active, onChange }: MetricToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
        ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
    >
      <span
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: active ? color : '#CBD5E1' }}
      />
      <span className={active ? 'text-gray-900' : 'text-gray-500'}>
        {label}
      </span>
    </button>
  );
}