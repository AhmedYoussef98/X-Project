// Define default ranges for business metrics
export const DEFAULT_RANGES = {
  dailyOrders: { min: 10, max: 1000, step: 10 },
  branchCapacity: { min: 100, max: 1000, step: 50 },
  monthlyGrowthRate: { min: 0, max: 50, step: 1 },
  averageOrderPrice: { min: 10, max: 100, step: 1 },
  deliveryCostPerCustomer: { min: 0, max: 100, step: 1 },
  detergentCost: { min: 0, max: 10, step: 0.1 },
  packagingCost: { min: 0, max: 10, step: 0.1 },
  otherMaterialCosts: { min: 0, max: 10, step: 0.1 },
  monthlyRent: { min: 5000, max: 50000, step: 1000 },
  staffCount: { min: 1, max: 20, step: 1 },
  monthlyStaffCostPerPerson: { min: 2000, max: 10000, step: 100 },
  monthlyUtilities: { min: 1000, max: 10000, step: 100 },
} as const;