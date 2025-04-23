import { useState, useCallback, useEffect } from 'react';
import type { Branch } from '../types/business';

const STORAGE_KEY = 'laundry-business-active-branches';

export function useBranchActivity(branches: Branch[]) {
  const [activeBranches, setActiveBranches] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
    // By default, all branches are active
    return new Set(branches.map(b => b.id));
  });

  const [branchHistory, setBranchHistory] = useState<{
    action: 'delete' | 'toggle';
    branch: Branch;
    timestamp: number;
  }[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(activeBranches)));
  }, [activeBranches]);

  const toggleBranch = useCallback((branchId: string) => {
    setActiveBranches(prev => {
      const next = new Set(prev);
      if (next.has(branchId)) {
        next.delete(branchId);
      } else {
        next.add(branchId);
      }
      return next;
    });
  }, []);

  const logBranchAction = useCallback((action: 'delete' | 'toggle', branch: Branch) => {
    setBranchHistory(prev => [
      {
        action,
        branch,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  return {
    activeBranches,
    toggleBranch,
    branchHistory,
    logBranchAction,
  };
}