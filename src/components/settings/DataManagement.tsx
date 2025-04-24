import React, { useState, useRef } from 'react';
import { 
  exportStorageData, 
  importStorageData, 
  clearAllStorage, 
  clearStorage, 
  STORAGE_KEYS 
} from '../../utils/storageUtils';
import { useInvoice } from '../../context/InvoiceContext';
import { Save, Upload, Trash, AlertCircle, Check } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

const DataManagement: React.FC = () => {
  const { invoices } = useInvoice();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const handleExport = () => {
    try {
      exportStorageData();
      setAlert({
        type: 'success',
        message: 'Data exported successfully. Check your downloads folder.'
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to export data'
      });
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        const result = importStorageData(jsonData);
        
        setAlert({
          type: result.success ? 'success' : 'error',
          message: result.message
        });
        
        // Reload the page if successful to reflect the imported data
        if (result.success) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Failed to parse import file'
        });
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    setConfirmAction('clearAll');
  };

  const handleClearInvoices = () => {
    setConfirmAction('clearInvoices');
  };

  const confirmClear = () => {
    if (confirmAction === 'clearAll') {
      clearAllStorage();
      setAlert({
        type: 'success',
        message: 'All data cleared successfully'
      });
      
      // Reload the page after clearing
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else if (confirmAction === 'clearInvoices') {
      clearStorage(STORAGE_KEYS.INVOICES);
      setAlert({
        type: 'success',
        message: 'Invoices cleared successfully'
      });
      
      // Reload the page after clearing
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    
    setConfirmAction(null);
  };

  const cancelClear = () => {
    setConfirmAction(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Data Management</h2>
      
      {alert && (
        <div 
          className={`mb-4 p-3 rounded flex items-center ${
            alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {alert.type === 'success' ? (
            <Check size={18} className="mr-2" />
          ) : (
            <AlertCircle size={18} className="mr-2" />
          )}
          {alert.message}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExport}
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <Save size={18} className="mr-2" />
            Export All Data ({invoices.length} invoices)
          </button>
          
          <button
            onClick={handleImportClick}
            className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            <Upload size={18} className="mr-2" />
            Import Data Backup
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Data Reset</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleClearInvoices}
              className="flex items-center justify-center bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
            >
              <Trash size={18} className="mr-2" />
              Clear Invoices Only
            </button>
            
            <button
              onClick={handleClearAll}
              className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              <Trash size={18} className="mr-2" />
              Clear All Data
            </button>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Action</h3>
            <p className="mb-6">
              {confirmAction === 'clearAll' 
                ? 'This will delete all your invoices and settings. This action cannot be undone. Are you sure?'
                : 'This will delete all your invoices. This action cannot be undone. Are you sure?'}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={cancelClear}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmClear}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement; 