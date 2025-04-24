export const formatCurrency = (amount: number, currency: string, includeSymbol = true): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

/**
 * Check if code is running in browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const formatDate = (date: string | Date, format: 'short' | 'long' = 'long'): string => {
  if (!date) return '';
  
  // Return ISO date format for SSR to prevent hydration mismatch
  if (!isBrowser()) {
    return typeof date === 'string' ? date : date.toISOString().split('T')[0];
  }
  
  // Client-side formatting
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'short') {
      return dateObj.toLocaleDateString();
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return typeof date === 'string' ? date : date.toISOString().split('T')[0];
  }
};