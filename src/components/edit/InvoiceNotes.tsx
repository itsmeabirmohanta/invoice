import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceNotes: React.FC = () => {
  const { currentInvoice, updateInvoice } = useInvoice();

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

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
    </div>
  );
};

export default InvoiceNotes;