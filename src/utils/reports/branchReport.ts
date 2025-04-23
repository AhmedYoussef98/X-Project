import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Branch, MonthlyMetrics } from '../../types/business';
import type { BranchReport, ReportOptions } from './types';
import { formatCurrency, formatPercentage } from '../formatting';

export function generateBranchReport(branch: Branch, options: ReportOptions): BranchReport {
  const metrics = branch.monthlyData;
  const latestMetrics = metrics[metrics.length - 1];

  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = metrics.reduce((sum, m) => sum + m.totalCosts, 0);
  const averageMargin = metrics.reduce((sum, m) => sum + m.profitMargin, 0) / metrics.length;
  const utilizationRate = (latestMetrics.orders / (branch.metrics.branchCapacity * 30)) * 100;

  const report: BranchReport = {
    branch,
    metrics,
    performance: {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profitMargin: averageMargin,
      utilizationRate,
    },
    staffing: {
      headcount: branch.metrics.staffCount,
      costPerEmployee: branch.metrics.monthlyStaffCostPerPerson,
      totalStaffCost: branch.metrics.staffCount * branch.metrics.monthlyStaffCostPerPerson,
    },
    alerts: [],
  };

  // Generate alerts
  if (utilizationRate > 90) {
    report.alerts.push('Branch is operating near maximum capacity');
  }
  if (averageMargin < 20) {
    report.alerts.push('Profit margin is below target threshold');
  }

  if (options.format === 'pdf') {
    exportBranchReportToPDF(report);
  }

  return report;
}

function exportBranchReportToPDF(report: BranchReport): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header
  doc.setFontSize(20);
  doc.text('Branch Performance Report', 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Branch: ${report.branch.name}`, 14, 30);
  doc.text(`Location: ${report.branch.location}`, 14, 37);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 44);

  // Key Metrics
  doc.setFontSize(16);
  doc.text('Key Performance Metrics', 14, 60);

  const metrics = [
    ['Total Revenue', formatCurrency(report.performance.revenue)],
    ['Total Expenses', formatCurrency(report.performance.expenses)],
    ['Profit Margin', formatPercentage(report.performance.profitMargin)],
    ['Capacity Utilization', formatPercentage(report.performance.utilizationRate)],
  ];

  autoTable(doc, {
    startY: 65,
    head: [['Metric', 'Value']],
    body: metrics,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Staffing Information
  doc.setFontSize(16);
  doc.text('Staffing Overview', 14, doc.lastAutoTable.finalY + 20);

  const staffing = [
    ['Total Staff', report.staffing.headcount.toString()],
    ['Cost per Employee', formatCurrency(report.staffing.costPerEmployee)],
    ['Total Staff Cost', formatCurrency(report.staffing.totalStaffCost)],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [['Metric', 'Value']],
    body: staffing,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Monthly Performance
  doc.setFontSize(16);
  doc.text('Monthly Performance', 14, doc.lastAutoTable.finalY + 20);

  const monthlyData = report.metrics.map(m => [
    `Month ${m.month}`,
    formatCurrency(m.revenue),
    formatCurrency(m.totalCosts),
    formatPercentage(m.profitMargin),
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [['Month', 'Revenue', 'Costs', 'Margin']],
    body: monthlyData,
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

  doc.save(`${report.branch.name.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
}