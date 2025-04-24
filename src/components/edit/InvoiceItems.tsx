import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Plus, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const InvoiceItems: React.FC = () => {
  const { currentInvoice, updateInvoiceItem, addInvoiceItem, removeInvoiceItem, calculateSubtotal, calculateTotal } = useInvoice();

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-2 bg-gray-100 p-3 rounded-t-md text-sm font-medium text-gray-700">
        <div className="col-span-1"></div>
        <div className="col-span-5">DESCRIPTION</div>
        <div className="col-span-2 text-right">RATE</div>
        <div className="col-span-2 text-center">QTY</div>
        <div className="col-span-2 text-right">AMOUNT</div>
      </div>
      
      {currentInvoice.items.map((item) => (
        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-1">
            <button 
              onClick={() => removeInvoiceItem(item.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="col-span-5">
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateInvoiceItem(item.id, { description: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">
            <input
              type="number"
              value={item.rate}
              onChange={(e) => updateInvoiceItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
            />
          </div>
          <div className="col-span-2">
            <input
              type="number"
              value={item.qty}
              onChange={(e) => updateInvoiceItem(item.id, { qty: parseInt(e.target.value) || 0 })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
            />
          </div>
          <div className="col-span-2 text-right py-2">
            {formatCurrency(item.rate * item.qty, currentInvoice.currency)}
          </div>
        </div>
      ))}
      
      <div>
        <button 
          onClick={addInvoiceItem}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" aria-hidden="true" />
          <span className="text-sm">Add item</span>
        </button>
      </div>
      
      <div className="flex justify-end space-y-2">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium">{formatCurrency(calculateSubtotal(), currentInvoice.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-sm font-medium">{formatCurrency(calculateTotal(), currentInvoice.currency)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-sm font-medium">Balance Due</span>
            <span className="text-sm font-bold">{formatCurrency(calculateTotal(), currentInvoice.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItems;