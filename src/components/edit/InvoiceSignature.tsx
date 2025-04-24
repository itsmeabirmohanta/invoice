import React from 'react';
import { Plus } from 'lucide-react';

const InvoiceSignature: React.FC = () => {
  return (
    <div className="space-y-2 mb-6">
      <h2 className="text-sm font-medium text-gray-700">Signature</h2>
      <div className="flex items-center justify-center border border-gray-300 rounded-md p-4 h-24">
        <button className="text-gray-500 flex flex-col items-center">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default InvoiceSignature;