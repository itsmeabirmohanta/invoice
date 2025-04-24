import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceNotes: React.FC = () => {
  const { currentInvoice, updateInvoice } = useInvoice();

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

  const handleBankDetailsChange = (field: string, value: string) => {
    updateInvoice({
      bankDetails: {
        ...currentInvoice.bankDetails,
        [field]: value,
      }
    });
  };

  // Helper to clean bank detail placeholders
  const cleanBankField = (field: string): string => {
    if (!field) return '';
    
    // Remove labels like "A/C No.: " to show just the value
    const prefixes = ['A/C No.: ', 'CIF: ', 'Branch: ', 'IFSC: '];
    
    for (const prefix of prefixes) {
      if (field.startsWith(prefix)) {
        return field.substring(prefix.length);
      }
    }
    
    return field;
  };

  // Format bank details for display without the field labels
  const formatBankDetailsForField = (): string => {
    const cleanedAccountNumber = cleanBankField(currentInvoice.bankDetails?.accountNumber || '');
    const cleanedCifNumber = cleanBankField(currentInvoice.bankDetails?.cifNumber || '');
    const cleanedBranch = cleanBankField(currentInvoice.bankDetails?.branch || '');
    const cleanedIfsc = cleanBankField(currentInvoice.bankDetails?.ifsc || '');
    
    return `${cleanedAccountNumber}
${cleanedCifNumber}
${cleanedBranch}
${cleanedIfsc}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">Notes</h2>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
          placeholder="Additional notes..."
          value={currentInvoice.notes || ''}
          onChange={(e) => updateInvoice({ notes: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">Bank Details</h2>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
          placeholder="Enter bank details (Account Number, CIF Number, Branch Name, IFSC Code)..."
          value={formatBankDetailsForField()}
          onChange={(e) => {
            const lines = e.target.value.split('\n');
            
            if (lines.length >= 1) handleBankDetailsChange('accountNumber', `A/C No.: ${lines[0]?.trim() || ''}`);
            if (lines.length >= 2) handleBankDetailsChange('cifNumber', `CIF: ${lines[1]?.trim() || ''}`);
            if (lines.length >= 3) handleBankDetailsChange('branch', `Branch: ${lines[2]?.trim() || ''}`);
            if (lines.length >= 4) handleBankDetailsChange('ifsc', `IFSC: ${lines[3]?.trim() || ''}`);
          }}
        />
        <p className="text-xs text-gray-500">Enter bank details in this format: A/C No., CIF, Branch, IFSC (one per line)</p>
      </div>
    </div>
  );
};

export default InvoiceNotes;