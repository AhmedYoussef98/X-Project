export function formatNumber(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString();
}

export function formatCurrency(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'SAR 0';
  }
  return `SAR ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercentage(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  return `${value.toFixed(2)}%`;
}

export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatLargeNumber(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.00';
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

export function formatCompactNumber(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  const formatter = new Intl.NumberFormat('en', { 
    notation: 'compact',
    maximumFractionDigits: 1
  });
  
  return formatter.format(value);
}

export function formatCurrencyCompact(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'SAR 0';
  }
  return `SAR ${formatCompactNumber(value)}`;
}

export function formatNumberWithSuffix(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }

  if (value === 0) return '0';

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const magnitude = Math.floor(Math.log10(Math.abs(value)) / 3);
  const scaledValue = value / Math.pow(10, magnitude * 3);
  const suffix = suffixes[magnitude];

  return `${scaledValue.toFixed(2)}${suffix}`;
}

export function formatDuration(minutes: number): string {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes < 0) {
    return '0m';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function formatMonthYear(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
  });
}

export function formatPercentageChange(oldValue: number, newValue: number): string {
  if (typeof oldValue !== 'number' || typeof newValue !== 'number' || 
      isNaN(oldValue) || isNaN(newValue) || oldValue === 0) {
    return '0%';
  }

  const percentageChange = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  const sign = percentageChange > 0 ? '+' : '';
  return `${sign}${percentageChange.toFixed(2)}%`;
}

export function formatCurrencyWithPrefix(value: number, prefix: string = 'SAR'): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${prefix} 0`;
  }
  return `${prefix} ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}