import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import DataManagement from '../components/settings/DataManagement';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useInvoice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Invoice Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="template-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Template Color
                </label>
                <select
                  id="template-color"
                  value={settings.templateColor}
                  onChange={(e) => updateSettings({ templateColor: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="red">Red</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="request-reviews"
                  checked={settings.requestReviews}
                  onChange={(e) => updateSettings({ requestReviews: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="request-reviews" className="ml-2 block text-sm text-gray-700">
                  Include review request in emails
                </label>
              </div>
            </div>
          </div>
          
          <DataManagement />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Application Info</h2>
            
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Storage Used</p>
                <p className="font-medium">{calculateStorageUsage()}</p>
              </div>
              
              <div className="pt-4">
                <a 
                  href="https://github.com/your-username/invoice-simple" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  View Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculate the approximate storage usage
const calculateStorageUsage = (): string => {
  try {
    let totalSize = 0;
    
    // Get size of all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }
    
    // Convert to KB or MB
    if (totalSize < 1024) {
      return `${totalSize} bytes`;
    } else if (totalSize < 1024 * 1024) {
      return `${(totalSize / 1024).toFixed(2)} KB`;
    } else {
      return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
    }
  } catch (error) {
    return 'Unable to calculate';
  }
};

export default SettingsPage; 