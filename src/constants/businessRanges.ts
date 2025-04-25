// Define default ranges for business metrics
export const DEFAULT_RANGES = {
  dailyOrders: { min: 10, max: 1000, step: 10 },
  branchCapacity: { min: 100, max: 1000, step: 50 },
  monthlyGrowthRate: { min: -20, max: 50, step: 1 },
  averageOrderPrice: { min: 10, max: 100, step: 1 },
  deliveryCostPerCustomer: { min: 0, max: 100, step: 1 },
  detergentCost: { min: 0, max: 10, step: 0.1 },
  packagingCost: { min: 0, max: 10, step: 0.1 },
  otherMaterialCosts: { min: 0, max: 10, step: 0.1 },
  monthlyRent: { min: 5000, max: 50000, step: 1000 },
  staffCount: { min: 1, max: 20, step: 1 },
  monthlyStaffCostPerPerson: { min: 2000, max: 10000, step: 100 },
  monthlyUtilities: { min: 1000, max: 10000, step: 100 },
  forecastMode: { min: 0, max: 2, step: 1 },
  monthlyGrowthRates: { min: -20, max: 50, step: 1 },
  fixedMonthlyOrders: { min: 0, max: 1000, step: 10 },
} as const;

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export const DEFAULT_MONTHLY_GROWTH_RATES = [
  2, 2, 3, 3, 4, 5, 5, 4, 3, 3, 2, 2
];

export const DEFAULT_FIXED_MONTHLY_ORDERS = Array(12).fill(300);

