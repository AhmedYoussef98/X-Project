import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { MonthlyMetrics, BranchSetupCosts, Branch } from '../types/business';

export const exportToPDF = (data: MonthlyMetrics[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Laundry Business Analytics Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);

  const tableData = data.map(month => [
    month.month,
    month.orders.toFixed(2),
    month.revenue.toFixed(2),
    month.netProfit.toFixed(2),
    `${month.profitMargin.toFixed(2)}%`,
  ]);

  (doc as any).autoTable({
    startY: 40,
    head: [['Month', 'Orders', 'Revenue (SAR)', 'Net Profit (SAR)', 'Margin']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save('laundry-business-report.pdf');
};

export const exportSetupCostsToPDF = (branchName: string, costs: BranchSetupCosts) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(`${branchName} - Setup Costs Report`, 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);

  const tableData = Object.entries(costs).map(([key, value]) => [
    key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    `SAR ${value.toLocaleString()}`,
  ]);

  const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  tableData.push(['Total', `SAR ${total.toLocaleString()}`]);

  (doc as any).autoTable({
    startY: 40,
    head: [['Cost Category', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${branchName.toLowerCase().replace(/\s+/g, '-')}-setup-costs.pdf`);
};

export const exportNetworkCostsToPDF = (branches: Branch[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Network Setup Costs Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);

  const tableData = branches.map(branch => {
    const total = Object.values(branch.setupCosts).reduce((sum, cost) => sum + cost, 0);
    return [
      branch.name,
      branch.location,
      `SAR ${total.toLocaleString()}`,
    ];
  });

  const networkTotal = branches.reduce(
    (sum, branch) => sum + Object.values(branch.setupCosts).reduce((a, b) => a + b, 0),
    0
  );
  tableData.push(['Network Total', '', `SAR ${networkTotal.toLocaleString()}`]);

  (doc as any).autoTable({
    startY: 40,
    head: [['Branch', 'Location', 'Total Setup Cost']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save('network-setup-costs.pdf');
};