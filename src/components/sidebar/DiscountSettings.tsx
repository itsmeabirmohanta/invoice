import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const DiscountSettings: React.FC = () => {
  const { currentInvoice, updateInvoice } = useInvoice();
  
  if (!currentInvoice) {
    return <div>Loading...</div>;
  }
  
  const handleDiscountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateInvoice({
      discount: {
        ...currentInvoice.discount,
        type: e.target.value,
      }
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</h3>
      <div className="space-y-2">
        <label className="text-xs text-gray-600">Type</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={currentInvoice.discount?.type || 'None'}
          onChange={handleDiscountTypeChange}
        >
          <option value="None">None</option>
          <option value="Percentage">Percentage</option>
          <option value="Fixed Amount">Fixed Amount</option>
        </select>
      </div>
    </div>
  );
};

export default DiscountSettings;