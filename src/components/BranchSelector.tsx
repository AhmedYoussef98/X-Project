import React from 'react';
import { Building2, Plus } from 'lucide-react';
import type { Branch } from '../types/business';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchId: string;
  onBranchSelect: (branchId: string) => void;
  onAddBranch: () => void;
}

export function BranchSelector({
  branches,
  selectedBranchId,
  onBranchSelect,
  onAddBranch,
}: BranchSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <label htmlFor="branch-select" className="sr-only">
          Select Branch
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            id="branch-select"
            value={selectedBranchId}
            onChange={(e) => onBranchSelect(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.location}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={onAddBranch}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Branch
      </button>
    </div>
  );
}