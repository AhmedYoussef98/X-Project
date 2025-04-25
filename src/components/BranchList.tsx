import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Switch } from './ui/Switch';
import { Card } from './ui/Card';
import type { Branch } from '../types/business';

interface BranchListProps {
  branches: Branch[];
  activeBranches: Set<string>;
  onToggleBranch: (branchId: string) => void;
  onDeleteBranch: (branch: Branch) => void;
  onSelectBranch: (branchId: string) => void;
}

export function BranchList({
  branches,
  activeBranches,
  onToggleBranch,
  onDeleteBranch,
  onSelectBranch,
}: BranchListProps) {
  const handleDelete = (branch: Branch) => {
    if (window.confirm(`Are you sure you want to delete ${branch.name}? This action cannot be undone.`)) {
      onDeleteBranch(branch);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Branch Management</h3>
      <div className="space-y-3">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Switch
                checked={activeBranches.has(branch.id)}
                onCheckedChange={() => onToggleBranch(branch.id)}
                aria-label={`Toggle ${branch.name}`}
              />
              <div>
                <button
                  onClick={() => onSelectBranch(branch.id)}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {branch.name}
                </button>
                <p className="text-xs text-gray-500">{branch.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!activeBranches.has(branch.id) && (
                <AlertCircle className="h-4 w-4 text-amber-500" data-tooltip="Branch excluded from calculations" />
              )}
              <button
                onClick={() => handleDelete(branch)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete branch"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}