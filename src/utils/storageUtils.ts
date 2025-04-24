// Storage keys used throughout the application
export const STORAGE_KEYS = {
  INVOICES: 'invoice-simple-invoices',
  SETTINGS: 'invoice-simple-settings',
  CURRENT_INVOICE: 'invoice-simple-current-invoice'
};

/**
 * Check if code is running in browser environment
 * This is needed for Next.js server components
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Generic function to get data from localStorage
 * @param key The localStorage key to retrieve
 * @param defaultValue Default value to return if storage fails or is empty
 * @returns The parsed value from storage or the default value
 */
export const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (!isBrowser()) {
    return defaultValue;
  }
  
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue) as T;
    }
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
  }
  return defaultValue;
};

/**
 * Generic function to save data to localStorage
 * @param key The localStorage key to save to
 * @param value The value to save
 */
export const saveToStorage = <T,>(key: string, value: T): void => {
  if (!isBrowser()) {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Clear all invoice-related data from localStorage
 */
export const clearAllStorage = (): void => {
  if (!isBrowser()) {
    return;
  }
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('All invoice storage cleared');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Clear a specific key from localStorage
 * @param key The localStorage key to clear
 */
export const clearStorage = (key: string): void => {
  if (!isBrowser()) {
    return;
  }
  
  try {
    localStorage.removeItem(key);
    console.log(`Storage for ${key} cleared`);
  } catch (error) {
    console.error(`Error clearing ${key} from localStorage:`, error);
  }
};

/**
 * Format current date as YYYY-MM-DD for filename
 * This is safe to call on client only
 */
const getFormattedDate = (): string => {
  if (!isBrowser()) {
    return '';
  }
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Export all stored invoices to a JSON file for backup
 * This function must only be called on the client side
 */
export const exportStorageData = (): void => {
  if (!isBrowser()) {
    return;
  }
  
  try {
    const data = {
      invoices: getFromStorage(STORAGE_KEYS.INVOICES, []),
      settings: getFromStorage(STORAGE_KEYS.SETTINGS, {})
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-simple-backup-${getFormattedDate()}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting storage data:', error);
  }
};

/**
 * Import invoices from a JSON backup file
 * @param jsonData The parsed JSON data to import
 * @returns Success status and message
 */
export const importStorageData = (jsonData: any): { success: boolean; message: string } => {
  if (!isBrowser()) {
    return { success: false, message: 'Cannot import data in server environment' };
  }
  
  try {
    if (!jsonData || typeof jsonData !== 'object') {
      return { success: false, message: 'Invalid data format' };
    }
    
    if (Array.isArray(jsonData.invoices)) {
      saveToStorage(STORAGE_KEYS.INVOICES, jsonData.invoices);
    }
    
    if (jsonData.settings && typeof jsonData.settings === 'object') {
      saveToStorage(STORAGE_KEYS.SETTINGS, jsonData.settings);
    }
    
    return { 
      success: true, 
      message: `Imported ${jsonData.invoices?.length || 0} invoices successfully` 
    };
  } catch (error) {
    console.error('Error importing storage data:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error during import' 
    };
  }
}; 