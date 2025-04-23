import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { BranchSetupCosts } from '../types/business';

interface BranchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, location: string, setupCosts: BranchSetupCosts) => void;
  title: string;
  initialName?: string;
  initialLocation?: string;
  initialSetupCosts?: BranchSetupCosts;
}

const DEFAULT_SETUP_COSTS: BranchSetupCosts = {
  constructionCost: 0,
  equipmentCost: 0,
  licensingCost: 0,
  initialInventoryCost: 0,
};

export function BranchDialog({
  isOpen,
  onClose,
  onSave,
  title,
  initialName = '',
  initialLocation = '',
  initialSetupCosts = DEFAULT_SETUP_COSTS,
}: BranchDialogProps) {
  const [name, setName] = useState(initialName);
  const [location, setLocation] = useState(initialLocation);
  const [setupCosts, setSetupCosts] = useState<BranchSetupCosts>(initialSetupCosts);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, location, setupCosts);
    onClose();
  };

  const handleCostChange = (key: keyof BranchSetupCosts, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return;

    setSetupCosts(prev => ({
      ...prev,
      [key]: numValue,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="branch-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Branch Name
                </label>
                <input
                  type="text"
                  id="branch-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="branch-location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="branch-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Setup Costs</h4>
                <div className="space-y-3">
                  {Object.entries(setupCosts).map(([key, value]) => (
                    <div key={key}>
                      <label
                        htmlFor={key}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">SAR</span>
                        </div>
                        <input
                          type="number"
                          id={key}
                          value={value}
                          onChange={(e) => handleCostChange(key as keyof BranchSetupCosts, e.target.value)}
                          className="block w-full pl-12 pr-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          min="0"
                          step="1000"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}