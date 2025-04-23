import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Branch } from '../../types/business';
import type { NetworkReport, ReportOptions } from './types';
import { formatCurrency, formatPercentage } from '../formatting';

export function generateNetworkReport(branches: Branch[], options: ReportOptions): NetworkReport {
  const totalRevenue = branches.reduce(
    (sum, branch) => sum + branch.monthlyData.reduce((s, m) => s + m.revenue, 0),
    0
  );

  const totalExpenses = branches.reduce(
    (sum, branch) => sum + branch.monthlyData.reduce((s, m) => s + m.totalCosts, 0),
    0
  );

  const totalProfit = totalRevenue - totalExpenses;
  const averageMargin = (totalProfit / totalRevenue) * 100;

  // Calculate branch rankings based on profit
  const branchRankings = branches.map(branch => ({
    branchId: branch.id,
    name: branch.name,
    performance: branch.monthlyData.reduce((sum, m) => sum + m.netProfit, 0),
  })).sort((a, b) => b.performance - a.performance);

  // Calculate growth trends
  const growthTrends = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    revenue: branches.reduce((sum, branch) => sum + (branch.monthlyData[i]?.revenue || 0), 0),
    orders: branches.reduce((sum, branch) => sum + (branch.monthlyData[i]?.orders || 0), 0),
  }));

  const report: NetworkReport = {
    branches,
    totalMetrics: {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: totalProfit,
      averageMargin,
    },
    branchRankings,
    growthTrends,
    alerts: [],
  };

  // Generate network-wide alerts
  if (averageMargin < 20) {
    report.alerts.push('Network average profit margin is below target');
  }

  const highUtilizationBranches = branches.filter(branch => {
    const latestMetrics = branch.monthlyData[branch.monthlyData.length - 1];
    return (latestMetrics.orders / (branch.metrics.branchCapacity * 30)) > 0.9;
  });

  if (highUtilizationBranches.length > 0) {
    report.alerts.push(`${highUtilizationBranches.length} branches operating above 90% capacity`);
  }

  if (options.format === 'pdf') {
    exportNetworkReportToPDF(report);
  }

  return report;
}

function exportNetworkReportToPDF(report: NetworkReport): void {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('Network Performance Report', 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Total Branches: ${report.branches.length}`, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);

  // Network Metrics
  doc.setFontSize(16);
  doc.text('Network Performance', 14, 55);

  const metrics = [
    ['Total Revenue', formatCurrency(report.totalMetrics.revenue)],
    ['Total Expenses', formatCurrency(report.totalMetrics.expenses)],
    ['Net Profit', formatCurrency(report.totalMetrics.profit)],
    ['Average Margin', formatPercentage(report.totalMetrics.averageMargin)],
  ];

  autoTable(doc, {
    startY: 60,
    head: [['Metric', 'Value']],
    body: metrics,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Branch Rankings
  doc.setFontSize(16);
  doc.text('Branch Rankings', 14, doc.lastAutoTable.finalY + 20);

  const rankings = report.branchRankings.map((branch, index) => [
    (index + 1).toString(),
    branch.name,
    formatCurrency(branch.performance),
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [['Rank', 'Branch', 'Performance']],
    body: rankings,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Growth Trends
  doc.setFontSize(16);
  doc.text('Monthly Growth Trends', 14, doc.lastAutoTable.finalY + 20);

  const trends = report.growthTrends.map(trend => [
    `Month ${trend.month}`,
    formatCurrency(trend.revenue),
    trend.orders.toFixed(0),
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [['Month', 'Revenue', 'Orders']],
    body: trends,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Alerts
  if (report.alerts.length > 0) {
    doc.setFontSize(16);
    doc.text('Alerts', 14, doc.lastAutoTable.finalY + 20);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      body: report.alerts.map(alert => [alert]),
      theme: 'plain',
      styles: { textColor: [239, 68, 68] },
    });
  }

  doc.save('network-performance-report.pdf');
}