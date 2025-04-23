import type { Branch, MonthlyMetrics, BusinessMetrics } from '../../types/business';

export interface ReportDateRange {
  startDate: Date;
  endDate: Date;
}

export interface BranchReport {
  branch: Branch;
  metrics: MonthlyMetrics[];
  performance: {
    revenue: number;
    expenses: number;
    profitMargin: number;
    utilizationRate: number;
  };
  staffing: {
    headcount: number;
    costPerEmployee: number;
    totalStaffCost: number;
  };
  alerts: string[];
}

export interface NetworkReport {
  branches: Branch[];
  totalMetrics: {
    revenue: number;
    expenses: number;
    profit: number;
    averageMargin: number;
  };
  branchRankings: {
    branchId: string;
    name: string;
    performance: number;
  }[];
  growthTrends: {
    month: number;
    revenue: number;
    orders: number;
  }[];
  alerts: string[];
}

export interface ReportOptions {
  dateRange?: ReportDateRange;
  metrics?: (keyof BusinessMetrics)[];
  format: 'pdf' | 'excel';
  includeCharts?: boolean;
}