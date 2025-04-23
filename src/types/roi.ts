export interface ROIMetrics {
    totalInvestment: number;
    monthlyProfit: number;
    monthsToROI: number;
    projectedROIDate: Date;
    currentROIPercentage: number;
    isROIReached: boolean;
  }
  
  export interface NetworkROIMetrics {
    totalNetworkInvestment: number;
    averageMonthlyProfit: number;
    averageMonthsToROI: number;
    fastestROI: {
      branchId: string;
      branchName: string;
      monthsToROI: number;
    };
    slowestROI: {
      branchId: string;
      branchName: string;
      monthsToROI: number;
    };
    projectedNetworkROIDate: Date;
    currentNetworkROIPercentage: number;
    isNetworkROIReached: boolean;
  }