import React from 'react';
import { BranchSelector } from '../BranchSelector';

interface HeaderProps {
  showOverview: boolean;
  onToggleView: () => void;
  branches: any[];
  selectedBranchId: string;
  onBranchSelect: (id: string) => void;
  onAddBranch: () => void;
}

export function Header({
  showOverview,
  onToggleView,
  branches,
  selectedBranchId,
  onBranchSelect,
  onAddBranch,
}: HeaderProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Laundry Business Analytics
        </h1>
        <p className="mt-2 text-gray-600">
          Real-time financial and operational performance analysis
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleView}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${showOverview
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
        >
          {showOverview ? 'View Branch Details' : 'View Overview'}
        </button>
        <BranchSelector
          branches={branches}
          selectedBranchId={selectedBranchId}
          onBranchSelect={onBranchSelect}
          onAddBranch={onAddBranch}
        />
      </div>
    </div>
  );
}