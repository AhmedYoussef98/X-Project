import type { Branch } from '../types/business';
import type { ROIMetrics, NetworkROIMetrics } from '../types/roi';

export function calculateBranchROI(branch: Branch): ROIMetrics {
 // Calculate total investment
 const totalInvestment = Object.values(branch.setupCosts).reduce((sum, cost) => sum + cost, 0);
 
 // Calculate average monthly profit from historical data
 const monthlyProfits = branch.monthlyData.map(month => month.netProfit);
 const averageMonthlyProfit = monthlyProfits.reduce((sum, profit) => sum + profit, 0) / monthlyProfits.length;
 
 // Calculate months to ROI
 const monthsToROI = averageMonthlyProfit > 0 ? Math.ceil(totalInvestment / averageMonthlyProfit) : Infinity;
 
 // Calculate projected ROI date
 const currentDate = new Date();
 const projectedROIDate = new Date();
 projectedROIDate.setMonth(currentDate.getMonth() + monthsToROI);
 
 // Calculate current ROI percentage
 const totalProfit = monthlyProfits.reduce((sum, profit) => sum + profit, 0);
 const currentROIPercentage = (totalProfit / totalInvestment) * 100;
 
 return {
   totalInvestment,
   monthlyProfit: averageMonthlyProfit,
   monthsToROI,
   projectedROIDate,
   currentROIPercentage,
   isROIReached: currentROIPercentage >= 100
 };
}

export function calculateNetworkROI(branches: Branch[]): NetworkROIMetrics {
 if (!branches.length) {
   throw new Error('No branches provided for ROI calculation');
 }

 const branchROIs = branches.map(branch => ({
   branch,
   roi: calculateBranchROI(branch)
 }));

 const totalNetworkInvestment = branchROIs.reduce((sum, { roi }) => sum + roi.totalInvestment, 0);
 const totalMonthlyProfit = branchROIs.reduce((sum, { roi }) => sum + roi.monthlyProfit, 0);
 const averageMonthlyProfit = totalMonthlyProfit / branches.length;

 // Find fastest and slowest ROI
 const sortedByROI = [...branchROIs].sort((a, b) => a.roi.monthsToROI - b.roi.monthsToROI);
 const fastestROI = {
   branchId: sortedByROI[0].branch.id,
   branchName: sortedByROI[0].branch.name,
   monthsToROI: sortedByROI[0].roi.monthsToROI
 };
 const slowestROI = {
   branchId: sortedByROI[sortedByROI.length - 1].branch.id,
   branchName: sortedByROI[sortedByROI.length - 1].branch.name,
   monthsToROI: sortedByROI[sortedByROI.length - 1].roi.monthsToROI
 };

 // Calculate network-wide metrics
 const averageMonthsToROI = totalNetworkInvestment / totalMonthlyProfit;
 const currentDate = new Date();
 const projectedNetworkROIDate = new Date();
 projectedNetworkROIDate.setMonth(currentDate.getMonth() + Math.ceil(averageMonthsToROI));

 const totalNetworkProfit = branches.reduce((sum, branch) => 
   sum + branch.monthlyData.reduce((branchSum, month) => branchSum + month.netProfit, 0), 
   0
 );
 const currentNetworkROIPercentage = (totalNetworkProfit / totalNetworkInvestment) * 100;

 return {
   totalNetworkInvestment,
   averageMonthlyProfit,
   averageMonthsToROI,
   fastestROI,
   slowestROI,
   projectedNetworkROIDate,
   currentNetworkROIPercentage,
   isNetworkROIReached: currentNetworkROIPercentage >= 100
 };
}