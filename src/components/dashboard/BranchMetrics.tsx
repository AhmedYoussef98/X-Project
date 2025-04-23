import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart } from 'lucide-react';
import { MetricsCard } from '../MetricsCard';
import type { MonthlyMetrics, BusinessMetrics } from '../../types/business';
import { formatLargeNumber } from '../../utils/formatting';

interface BranchMetricsProps {
 monthlyData: MonthlyMetrics[];
 costBreakdown: { total: number } | null;
 metrics: BusinessMetrics;
 averages: {
   avgRevenue: number;
   avgOrders: number;
   avgProfitMargin: number;
   avgNetProfit: number;
   avgTotalCosts: number;
 } | null;
}

const calculateYearlyMetrics = (monthlyData: MonthlyMetrics[]) => {
 const yearlyMetrics = {
   totalCosts: 0,
   totalRevenue: 0,
   netProfit: 0,
   orders: 0
 };

 monthlyData.forEach(month => {
   yearlyMetrics.totalCosts += month.totalCosts;
   yearlyMetrics.totalRevenue += month.revenue;
   yearlyMetrics.netProfit += month.netProfit;
   yearlyMetrics.orders += month.orders;
 });

 return yearlyMetrics;
};

export function BranchMetrics({ 
 monthlyData, 
 metrics,
 costBreakdown,
 averages 
}: BranchMetricsProps) {
 if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
   return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
       <MetricsCard
         title="No Data Available"
         value="--"
         subtitle="Please check branch configuration"
         icon={<BarChart className="h-6 w-6 text-gray-400" />}
       />
     </div>
   );
 }

 const yearlyMetrics = calculateYearlyMetrics(monthlyData);

 return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
     {/* Cost per Order Card */}
     <MetricsCard
       title="Cost per Order"
       value={costBreakdown ? `SAR ${formatLargeNumber(costBreakdown.total)}` : 'N/A'}
       subtitle="All costs included"
       icon={<DollarSign className="h-6 w-6 text-amber-600" />}
     />

     {/* Average Monthly Costs Card */}
     <MetricsCard
       title="Average Monthly Costs"
       value={`SAR ${formatLargeNumber(averages?.avgTotalCosts ?? 0)}`}
       subtitle="All operational costs included"
       icon={<DollarSign className="h-6 w-6 text-red-600" />}
     />

     {/* Yearly Total Costs Card */}
     <MetricsCard
       title="Annual Total Costs"
       value={`SAR ${formatLargeNumber(yearlyMetrics.totalCosts)}`}
       subtitle={`Based on ${monthlyData.length} month(s) data`}
       icon={<TrendingDown className="h-6 w-6 text-red-600" />}
     />

     {/* Yearly Revenue Card */}
     <MetricsCard
       title="Annual Revenue"
       value={`SAR ${formatLargeNumber(yearlyMetrics.totalRevenue)}`}
       subtitle={`${formatLargeNumber(yearlyMetrics.orders)} total orders`}
       icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
     />

     {/* Yearly Net Profit Card */}
     <MetricsCard
       title="Annual Net Profit"
       value={`SAR ${formatLargeNumber(yearlyMetrics.netProfit)}`}
       subtitle={`${averages?.avgProfitMargin?.toFixed(2) ?? '0.00'}% avg margin`}
       icon={<PieChart className="h-6 w-6 text-green-600" />}
     />
   </div>
 );
}