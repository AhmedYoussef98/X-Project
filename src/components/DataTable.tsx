import React from 'react';
import { Card } from './ui/Card';
import { getStatusColor } from '../utils/theme';
import type { MonthlyMetrics } from '../types/business';

interface DataTableProps {
  data: MonthlyMetrics[];
  branchCapacity: number;
  loading?: boolean;
  error?: string;
}

interface TableHeaderProps {
  label: string;
  sortId?: string;
  onSort?: (id: string) => void;
  sortKey?: string;
  sortDesc?: boolean;
}

function TableHeader({ label, sortId, onSort, sortKey, sortDesc }: TableHeaderProps) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortId && sortKey === sortId && (
          <span className="text-gray-400">
            {sortDesc ? '↓' : '↑'}
          </span>
        )}
      </div>
    </th>
  );
}

const HEADERS = [
  { label: 'Month', id: 'month' },
  { label: 'Orders', id: 'orders' },
  { label: 'Capacity Utilization', id: 'utilization' },
  { label: 'Delivery Cost/Item', id: 'deliveryCost' },
  { label: 'Materials Cost/Item', id: 'materialsCost' },
  { label: 'Fixed Costs/Item', id: 'fixedCosts' },
  { label: 'Revenue', id: 'revenue' },
  { label: 'Net Profit', id: 'netProfit' },
  { label: 'Margin', id: 'margin' },
];

export function DataTable({ data = [], branchCapacity = 0, loading, error }: DataTableProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">{error}</div>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">No data available</div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {HEADERS.map(header => (
                <TableHeader key={header.id} label={header.label} />
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((month) => {
              const capacityUtilization = branchCapacity > 0
                ? (month.orders / (branchCapacity * 30)) * 100
                : 0;

              const deliveryCostPerItem = month.orders > 0
                ? (month.deliveryCost ?? 0) / month.orders
                : 0;

              const materialsCostPerItem = month.orders > 0
                ? (month.materialsCost ?? 0) / month.orders
                : 0;

              const fixedCostsPerItem = month.orders > 0
                ? (month.fixedCosts ?? 0) / month.orders
                : 0;

              return (
                <tr key={month.month} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {month.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {month.orders?.toFixed(2) ?? '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className="px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: getStatusColor(capacityUtilization, 'capacity') }}
                    >
                      {capacityUtilization.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    SAR {deliveryCostPerItem.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    SAR {materialsCostPerItem.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    SAR {fixedCostsPerItem.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    SAR {month.revenue?.toFixed(2) ?? '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    SAR {month.netProfit?.toFixed(2) ?? '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className="px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: getStatusColor(month.profitMargin ?? 0, 'profit') }}
                    >
                      {month.profitMargin?.toFixed(2) ?? '0.00'}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}