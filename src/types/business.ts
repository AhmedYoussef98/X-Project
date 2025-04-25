export interface Branch {
  id: string;
  name: string;
  location: string;
  metrics: BusinessMetrics;
  ranges: MetricRanges;
  monthlyData: MonthlyMetrics[];
  setupCosts: BranchSetupCosts;
}

export interface BranchSetupCosts {
  constructionCost: number;
  equipmentCost: number;
  licensingCost: number;
  initialInventoryCost: number;
}

export type ForecastMode = 'single-growth' | 'monthly-growth' | 'fixed-orders';

export interface BusinessMetrics {
  dailyOrders: number;
  branchCapacity: number;
  monthlyGrowthRate: number;
  averageOrderPrice: number;
  detergentCost: number;
  packagingCost: number;
  otherMaterialCosts: number;
  monthlyRent: number;
  monthlyStaffCostPerPerson: number;
  monthlyUtilities: number;
  staffCount: number;
  deliveryCostPerCustomer: number;
  
  // New fields for advanced forecasting
  forecastMode: ForecastMode;
  monthlyGrowthRates: number[];
  fixedMonthlyOrders: number[];
}

export interface MetricRange {
  min: number;
  max: number;
  step: number;
}

export type MetricRanges = {
  [K in keyof BusinessMetrics]: MetricRange;
};

export interface MonthlyMetrics {
  month: number;
  orders: number;
  revenue: number;
  deliveryCost: number;
  materialsCost: number;
  fixedCosts: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
}

export interface CostBreakdown {
  materials: number;
  marketing: number;
  fixed: number;
  total: number;
}

export interface BranchSummary {
  totalRevenue: number;
  totalProfit: number;
  averageMargin: number;
  totalOrders: number;
  averageUtilization: number;
}

export interface BranchAverages {
  avgRevenue: number;
  avgOrders: number;
  avgProfitMargin: number;
  avgNetProfit: number;
  avgTotalCosts: number;
  avgFixedCosts?: number;
  avgMaterialsCosts?: number;
  totalAnnualRevenue?: number;
  totalAnnualCosts?: number;
  totalAnnualProfit?: number;
  totalAnnualOrders?: number;
}