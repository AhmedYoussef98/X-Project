export const colors = {
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

export const getStatusColor = (value: number, type: 'capacity' | 'profit') => {
  if (type === 'capacity') {
    if (value <= 80) return colors.success;
    if (value <= 95) return colors.warning;
    return colors.danger;
  } else {
    if (value >= 20) return colors.success;
    if (value >= 10) return colors.warning;
    return colors.danger;
  }
};

export const gradients = {
  primary: 'from-blue-500 to-blue-600',
  success: 'from-green-500 to-green-600',
  warning: 'from-amber-500 to-amber-600',
  danger: 'from-red-500 to-red-600',
};