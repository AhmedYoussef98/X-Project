import { useMemo } from 'react';
import type { BusinessMetrics, MonthlyMetrics, CostBreakdown } from '../types/business';

// Default number of months to forecast
const DEFAULT_MONTHS_TO_FORECAST = 12;

// Function to validate BusinessMetrics input
const validateMetrics = (metrics: BusinessMetrics): boolean => {
  if (!metrics) return false;

  const requiredFields: Array<keyof BusinessMetrics> = [
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

  for (const field of requiredFields) {
    if (metrics[field] == null || metrics[field] < 0) {
      console.error(`Invalid or missing field: ${field}`);
      return false;
    }
  }

  return true;
};

export function useBusinessMetrics(monthsToForecast: number = DEFAULT_MONTHS_TO_FORECAST) {
  // Function to calculate monthly metrics over a forecasted period
  const calculateMetrics = (metrics: BusinessMetrics): MonthlyMetrics[] => {
    if (!validateMetrics(metrics)) {
      throw new Error('Invalid BusinessMetrics input.');
    }

    const data: MonthlyMetrics[] = [];
    let currentOrders = metrics.dailyOrders * 30; // Estimate monthly orders from daily orders
    const monthlyCapacity = metrics.branchCapacity * 30; // Calculate monthly capacity

    for (let month = 1; month <= monthsToForecast; month++) {
      // Cap orders at branch capacity
      currentOrders = Math.min(currentOrders, monthlyCapacity);

      const revenue = currentOrders * metrics.averageOrderPrice;
      const deliveryCost = currentOrders * metrics.deliveryCostPerCustomer;
      const materialsCost = currentOrders * (
        metrics.detergentCost +
        metrics.packagingCost +
        metrics.otherMaterialCosts
      );
      const fixedCosts =
        metrics.monthlyRent +
        metrics.monthlyStaffCostPerPerson * metrics.staffCount +
        metrics.monthlyUtilities;

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

      // Calculate next month's orders but don't apply cap yet
      const nextMonthOrders = currentOrders * (1 + metrics.monthlyGrowthRate / 100);
      currentOrders = nextMonthOrders;
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

    return warnings;
  };

  // Function to calculate average metrics over the forecasted period
  const calculateAverages = (monthlyData: MonthlyMetrics[]) => {
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