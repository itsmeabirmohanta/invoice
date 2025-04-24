import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { ImagePlus, Check } from 'lucide-react';

const InvoiceHeader: React.FC = () => {
  const { currentInvoice, updateInvoice } = useInvoice();

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice</label>
        <input
          type="text"
          value={currentInvoice.number}
          onChange={(e) => updateInvoice({ number: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center justify-center border border-gray-300 rounded-md p-4 h-full">
        <div className="flex flex-col items-center text-gray-500">
          <ImagePlus size={24} aria-hidden="true" />
          <span className="text-xs mt-1">+ Logo</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;