import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const InvoiceFooter: React.FC = () => {
  const { saveInvoice, setActiveView } = useInvoice();

  return (
    <div className="flex justify-between pt-6 border-t border-gray-200">
      <button
        onClick={() => setActiveView('dashboard')}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
      >
        Close Invoice
      </button>
      <div className="space-x-2">
        <button
          onClick={saveInvoice}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Invoice
        </button>
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
          Delete Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceFooter;