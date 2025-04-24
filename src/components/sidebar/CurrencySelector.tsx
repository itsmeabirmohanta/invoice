import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

const CurrencySelector: React.FC = () => {
  const { currentInvoice, updateInvoice } = useInvoice();

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</h3>
      <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-2">
        <select
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
          value={currentInvoice.currency}
          onChange={(e) => updateInvoice({ currency: e.target.value })}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code}
            </option>
          ))}
        </select>
        <span className="text-gray-500 font-medium flex items-center space-x-1">
          <span>{currencies.find(c => c.code === currentInvoice.currency)?.symbol}</span>
          {currentInvoice.currency === 'INR' && (
            <span className="w-6 h-4 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-sm"></span>
          )}
        </span>
      </div>
    </div>
  );
};

export default CurrencySelector;