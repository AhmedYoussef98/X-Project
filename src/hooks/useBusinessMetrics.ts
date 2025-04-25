import { useMemo } from 'react';
import type { BusinessMetrics, MonthlyMetrics, CostBreakdown, BranchAverages, ForecastMode } from '../types/business';
import { DEFAULT_MONTHLY_GROWTH_RATES, DEFAULT_FIXED_MONTHLY_ORDERS } from '../constants/businessRanges';

// Default number of months to forecast
const DEFAULT_MONTHS_TO_FORECAST = 12;

// Function to validate BusinessMetrics input
const validateMetrics = (metrics: BusinessMetrics): boolean => {
  if (!metrics) return false;

  // Validate number fields
  const numberFields: Array<keyof BusinessMetrics> = [
    'dailyOrders',
    'branchCapacity',
    'monthlyGrowthRate',
    'averageOrderPrice',
    'detergentCost',
    'packagingCost',
    'otherMaterialCosts',
    'monthlyRent',
    'monthlyStaffCostPerPerson',
    'monthlyUtilities',
    'staffCount',
    'deliveryCostPerCustomer',
  ];

  for (const field of numberFields) {
    if (typeof metrics[field] !== 'number' || metrics[field] < 0) {
      console.error(`Invalid or missing field: ${field}`);
      return false;
    }
  }

  // Validate forecastMode
  if (!metrics.forecastMode || !['single-growth', 'monthly-growth', 'fixed-orders'].includes(metrics.forecastMode as string)) {
    console.error('Invalid forecastMode');
    metrics.forecastMode = 'single-growth';
  }

  // Ensure arrays exist with defaults if not present
  if (!metrics.monthlyGrowthRates || !Array.isArray(metrics.monthlyGrowthRates) || metrics.monthlyGrowthRates.length === 0) {
    metrics.monthlyGrowthRates = [...DEFAULT_MONTHLY_GROWTH_RATES];
  }
  
  if (!metrics.fixedMonthlyOrders || !Array.isArray(metrics.fixedMonthlyOrders) || metrics.fixedMonthlyOrders.length === 0) {
    metrics.fixedMonthlyOrders = [...DEFAULT_FIXED_MONTHLY_ORDERS];
  }

  return true;
};

export function useBusinessMetrics(monthsToForecast: number = DEFAULT_MONTHS_TO_FORECAST) {
  // Function to calculate monthly metrics over a forecasted period
  const calculateMetrics = (metrics: BusinessMetrics): MonthlyMetrics[] => {
    const metricsCopy = { ...metrics };
    
    if (!validateMetrics(metricsCopy)) {
      throw new Error('Invalid BusinessMetrics input.');
    }

    const data: MonthlyMetrics[] = [];
    const monthlyCapacity = metricsCopy.branchCapacity * 30; // Calculate monthly capacity
    
    // Different calculation based on forecast mode
    switch(metricsCopy.forecastMode) {
      case 'monthly-growth': {
        // Calculate with individual monthly growth rates
        let currentOrders = metricsCopy.dailyOrders * 30;
        
        for (let month = 1; month <= monthsToForecast; month++) {
          // Cap orders at branch capacity
          currentOrders = Math.min(currentOrders, monthlyCapacity);
          
          // Calculate financial metrics for this month
          const revenue = currentOrders * metricsCopy.averageOrderPrice;
          const deliveryCost = currentOrders * metricsCopy.deliveryCostPerCustomer;
          const materialsCost = currentOrders * (
            metricsCopy.detergentCost +
            metricsCopy.packagingCost +
            metricsCopy.otherMaterialCosts
          );
          const fixedCosts =
            metricsCopy.monthlyRent +
            metricsCopy.monthlyStaffCostPerPerson * metricsCopy.staffCount +
            metricsCopy.monthlyUtilities;

          const totalCosts = deliveryCost + materialsCost + fixedCosts;
          const netProfit = revenue - totalCosts;
          const profitMargin = revenue ? (netProfit / revenue) * 100 : 0;

          data.push({
            month,
            orders: currentOrders,
            revenue,
            deliveryCost,
            materialsCost,
            fixedCosts,
            totalCosts,
            netProfit,
            profitMargin,
          });
          
          // Use the appropriate monthly growth rate (with fallback)
          const monthIndex = (month - 1) % 12;
          const growthRate = metricsCopy.monthlyGrowthRates[monthIndex] ?? metricsCopy.monthlyGrowthRate;
          const nextMonthOrders = currentOrders * (1 + growthRate / 100);
          currentOrders = nextMonthOrders;
        }
        break;
      }
      
      case 'fixed-orders': {
        // Calculate with fixed orders per month
        for (let month = 1; month <= monthsToForecast; month++) {
          const monthIndex = (month - 1) % 12;
          
          // Get the fixed order count for this month (with fallback)
          const currentOrders = Math.min(
            metricsCopy.fixedMonthlyOrders[monthIndex] ?? metricsCopy.dailyOrders * 30,
            monthlyCapacity
          );
          
          // Calculate financial metrics for this month
          const revenue = currentOrders * metricsCopy.averageOrderPrice;
          const deliveryCost = currentOrders * metricsCopy.deliveryCostPerCustomer;
          const materialsCost = currentOrders * (
            metricsCopy.detergentCost +
            metricsCopy.packagingCost +
            metricsCopy.otherMaterialCosts
          );
          const fixedCosts =
            metricsCopy.monthlyRent +
            metricsCopy.monthlyStaffCostPerPerson * metricsCopy.staffCount +
            metricsCopy.monthlyUtilities;

          const totalCosts = deliveryCost + materialsCost + fixedCosts;
          const netProfit = revenue - totalCosts;
          const profitMargin = revenue ? (netProfit / revenue) * 100 : 0;

          data.push({
            month,
            orders: currentOrders,
            revenue,
            deliveryCost,
            materialsCost,
            fixedCosts,
            totalCosts,
            netProfit,
            profitMargin,
          });
        }
        break;
      }
      
      case 'single-growth':
      default: {
        // Original implementation with single growth rate
        let currentOrders = metricsCopy.dailyOrders * 30;
        
        for (let month = 1; month <= monthsToForecast; month++) {
          // Cap orders at branch capacity
          currentOrders = Math.min(currentOrders, monthlyCapacity);

          const revenue = currentOrders * metricsCopy.averageOrderPrice;
          const deliveryCost = currentOrders * metricsCopy.deliveryCostPerCustomer;
          const materialsCost = currentOrders * (
            metricsCopy.detergentCost +
            metricsCopy.packagingCost +
            metricsCopy.otherMaterialCosts
          );
          const fixedCosts =
            metricsCopy.monthlyRent +
            metricsCopy.monthlyStaffCostPerPerson * metricsCopy.staffCount +
            metricsCopy.monthlyUtilities;

          const totalCosts = deliveryCost + materialsCost + fixedCosts;
          const netProfit = revenue - totalCosts;
          const profitMargin = revenue ? (netProfit / revenue) * 100 : 0;

          data.push({
            month,
            orders: currentOrders,
            revenue,
            deliveryCost,
            materialsCost,
            fixedCosts,
            totalCosts,
            netProfit,
            profitMargin,
          });

          // Calculate next month's orders based on growth rate
          const nextMonthOrders = currentOrders * (1 + metricsCopy.monthlyGrowthRate / 100);
          currentOrders = nextMonthOrders;
        }
      }
    }

    return data;
  };

  // Function to calculate cost breakdown for the first month
  const calculateCostBreakdown = (monthlyData: MonthlyMetrics[]): CostBreakdown | null => {
    if (!monthlyData?.length) {
      console.warn('No monthly data available for cost breakdown.');
      return null;
    }

    const firstMonth = monthlyData[0];
    if (!firstMonth?.orders) {
      console.warn('First month has no orders.');
      return null;
    }

    return {
      materials: firstMonth.materialsCost / firstMonth.orders,
      marketing: firstMonth.deliveryCost / firstMonth.orders,
      fixed: firstMonth.fixedCosts / firstMonth.orders,
      total: firstMonth.totalCosts / firstMonth.orders,
    };
  };

  // Function to calculate warnings based on forecasted data
  const calculateWarnings = (monthlyData: MonthlyMetrics[], branchCapacity: number): string[] => {
    if (!monthlyData?.length) {
      console.warn('No monthly data available for warnings.');
      return [];
    }

    const warnings = [];
    const monthlyCapacity = branchCapacity * 30;
    const atCapacity = monthlyData.find((month) => month.orders >= monthlyCapacity);

    if (atCapacity) {
      warnings.push(`Branch is operating at maximum capacity (${branchCapacity} orders/day).`);
    }

    if (monthlyData[0].profitMargin < 20) {
      warnings.push('Low profit margin. Consider adjusting prices or reducing costs.');
    }
    
    // Check for significant negative growth or stagnation
    if (monthlyData.length > 1) {
      const firstMonth = monthlyData[0];
      const lastMonth = monthlyData[monthlyData.length - 1];
      if (lastMonth.orders < firstMonth.orders) {
        warnings.push('Forecasted decreasing order volume. Consider marketing strategies.');
      }
    }

    return warnings;
  };

  // Function to calculate average metrics over the forecasted period
  const calculateAverages = (monthlyData: MonthlyMetrics[]): BranchAverages | null => {
    if (!monthlyData?.length) {
      console.warn('No monthly data available for averaging.');
      return null;
    }

    const totalMonths = monthlyData.length;

    const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
    const totalOrders = monthlyData.reduce((sum, month) => sum + month.orders, 0);
    const totalProfitMargin = monthlyData.reduce((sum, month) => sum + month.profitMargin, 0);
    const totalNetProfit = monthlyData.reduce((sum, month) => sum + month.netProfit, 0);
    const totalCosts = monthlyData.reduce((sum, month) => sum + month.totalCosts, 0);
    const totalFixedCosts = monthlyData.reduce((sum, month) => sum + month.fixedCosts, 0);
    const totalMaterialsCosts = monthlyData.reduce((sum, month) => sum + month.materialsCost, 0);

    return {
      avgRevenue: totalRevenue / totalMonths,
      avgOrders: totalOrders / totalMonths,
      avgProfitMargin: totalProfitMargin / totalMonths,
      avgNetProfit: totalNetProfit / totalMonths,
      avgTotalCosts: totalCosts / totalMonths,
      avgFixedCosts: totalFixedCosts / totalMonths,
      avgMaterialsCosts: totalMaterialsCosts / totalMonths,
      totalAnnualRevenue: totalRevenue,
      totalAnnualCosts: totalCosts,
      totalAnnualProfit: totalNetProfit,
      totalAnnualOrders: totalOrders
    };
  };

  // Return all calculation functions
  return {
    calculateMetrics,
    calculateCostBreakdown,
    calculateWarnings,
    calculateAverages,
  };
}