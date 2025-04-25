import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Branch, BusinessMetrics, MetricRanges, BranchSetupCosts } from '../types/business';
import { useBusinessMetrics } from './useBusinessMetrics';
import { DEFAULT_RANGES, DEFAULT_MONTHLY_GROWTH_RATES, DEFAULT_FIXED_MONTHLY_ORDERS } from '../constants/businessRanges';

const STORAGE_KEY = 'laundry-business-branches';

const DEFAULT_METRICS: BusinessMetrics = {
  dailyOrders: 0,
  branchCapacity: 0,
  monthlyGrowthRate: 0,
  averageOrderPrice: 0,
  detergentCost: 0,
  packagingCost: 0,
  otherMaterialCosts: 0,
  monthlyRent: 0,
  monthlyStaffCostPerPerson: 0,
  monthlyUtilities: 0,
  staffCount: 0,
  deliveryCostPerCustomer: 0,
  // Add the missing properties with sensible defaults:
  forecastMode: 'single-growth',
  monthlyGrowthRates: [...DEFAULT_MONTHLY_GROWTH_RATES],
  fixedMonthlyOrders: [...DEFAULT_FIXED_MONTHLY_ORDERS]
};

const DEFAULT_SETUP_COSTS: BranchSetupCosts = {
  constructionCost: 0,
  equipmentCost: 0,
  licensingCost: 0,
  initialInventoryCost: 0,
};

export function useBranchManagement() {
  const {
    calculateMetrics,
    calculateCostBreakdown,
    calculateWarnings,
  } = useBusinessMetrics();

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Create default branch if none exist
    const defaultBranch: Branch = {
      id: uuidv4(),
      name: 'Main Branch',
      location: 'City Center',
      metrics: { ...DEFAULT_METRICS },
      ranges: DEFAULT_RANGES,
      monthlyData: calculateMetrics(DEFAULT_METRICS),
      setupCosts: DEFAULT_SETUP_COSTS,
    };
    return [defaultBranch];
  });

  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    branches[0]?.id || ''
  );

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  const monthlyData = selectedBranch ? selectedBranch.monthlyData : [];
  const costBreakdown = selectedBranch ? calculateCostBreakdown(monthlyData) : null;
  const warnings = selectedBranch ? calculateWarnings(monthlyData, selectedBranch.metrics.branchCapacity) : [];

  const saveBranches = useCallback((updatedBranches: Branch[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBranches));
    setBranches(updatedBranches);
  }, []);

  const addBranch = useCallback((
    name: string,
    location: string,
    setupCosts: BranchSetupCosts = DEFAULT_SETUP_COSTS
  ) => {
    const newBranch: Branch = {
      id: uuidv4(),
      name,
      location,
      metrics: { ...DEFAULT_METRICS },
      ranges: { ...DEFAULT_RANGES },
      monthlyData: calculateMetrics(DEFAULT_METRICS),
      setupCosts,
    };
    const updatedBranches = [...branches, newBranch];
    saveBranches(updatedBranches);
    return newBranch.id;
  }, [branches, saveBranches, calculateMetrics]);

  const updateBranch = useCallback((
    branchId: string,
    updates: Partial<Branch>
  ) => {
    const updatedBranches = branches.map(branch =>
      branch.id === branchId
        ? { ...branch, ...updates }
        : branch
    );
    saveBranches(updatedBranches);
  }, [branches, saveBranches]);

  const updateBranchSetupCosts = useCallback((
    branchId: string,
    setupCosts: BranchSetupCosts
  ) => {
    const updatedBranches = branches.map(branch =>
      branch.id === branchId
        ? { ...branch, setupCosts }
        : branch
    );
    saveBranches(updatedBranches);
  }, [branches, saveBranches]);

  const deleteBranch = useCallback((branchId: string) => {
    const updatedBranches = branches.filter(b => b.id !== branchId);
    if (updatedBranches.length === 0) {
      // Add default branch if last branch is deleted
      const defaultBranch: Branch = {
        id: uuidv4(),
        name: 'Main Branch',
        location: 'City Center',
        metrics: { ...DEFAULT_METRICS },
        ranges: DEFAULT_RANGES,
        monthlyData: calculateMetrics(DEFAULT_METRICS),
        setupCosts: DEFAULT_SETUP_COSTS,
      };
      updatedBranches.push(defaultBranch);
    }
    saveBranches(updatedBranches);
    if (branchId === selectedBranchId) {
      setSelectedBranchId(updatedBranches[0].id);
    }
  }, [branches, selectedBranchId, saveBranches, calculateMetrics]);

  const updateBranchMetrics = useCallback((
    branchId: string,
    key: keyof BusinessMetrics,
    value: number | number[] | string
  ) => {
    const updatedBranches = branches.map(branch => {
      if (branch.id === branchId) {
        const updatedMetrics = {
          ...branch.metrics,
          [key]: value,
        };
        return {
          ...branch,
          metrics: updatedMetrics,
          monthlyData: calculateMetrics(updatedMetrics),
        };
      }
      return branch;
    });
    saveBranches(updatedBranches);
  }, [branches, calculateMetrics, saveBranches]);

  const updateBranchRanges = useCallback((
    branchId: string,
    key: keyof MetricRanges,
    range: { min: number; max: number; step: number }
  ) => {
    const updatedBranches = branches.map(branch => {
      if (branch.id === branchId) {
        return {
          ...branch,
          ranges: {
            ...branch.ranges,
            [key]: range,
          },
        };
      }
      return branch;
    });
    saveBranches(updatedBranches);
  }, [branches, saveBranches]);

  return {
    branches,
    selectedBranchId,
    selectedBranch,
    setSelectedBranchId,
    addBranch,
    updateBranch,
    deleteBranch,
    updateBranchMetrics,
    updateBranchRanges,
    updateBranchSetupCosts,
    monthlyData,
    costBreakdown,
    warnings,
  };
}

export { DEFAULT_RANGES };