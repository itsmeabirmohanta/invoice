import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Save, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const InvoiceForm: React.FC = () => {
  const { 
    currentInvoice, 
    updateInvoice,
    updateInvoiceItem,
    addInvoiceItem,
    removeInvoiceItem,
    saveInvoice
  } = useInvoice();
  
  const [showBankDetails, setShowBankDetails] = useState(false);

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Basic invoice details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            value={currentInvoice.number}
            onChange={(e) => updateInvoice({ number: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={currentInvoice.date}
            onChange={(e) => updateInvoice({ date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Client and sender details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">From</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={currentInvoice.from.name}
              onChange={(e) => updateInvoice({ from: { ...currentInvoice.from, name: e.target.value } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              value={currentInvoice.from.email}
              onChange={(e) => updateInvoice({ from: { ...currentInvoice.from, email: e.target.value } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">To</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={currentInvoice.to.name}
              onChange={(e) => updateInvoice({ to: { ...currentInvoice.to, name: e.target.value } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email
            </label>
            <input
              type="email"
              value={currentInvoice.to.email}
              onChange={(e) => updateInvoice({ to: { ...currentInvoice.to, email: e.target.value } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      {/* Bank Details - Collapsible Section */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => setShowBankDetails(!showBankDetails)}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-left"
        >
          <span className="text-lg font-medium text-gray-700">Payment Details (Optional)</span>
          {showBankDetails ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>
        
        {showBankDetails && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={currentInvoice.bankDetails.accountNumber}
                onChange={(e) => updateInvoice({ 
                  bankDetails: { 
                    ...currentInvoice.bankDetails, 
                    accountNumber: e.target.value 
                  } 
                })}
                placeholder=""
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CIF Number
              </label>
              <input
                type="text"
                value={currentInvoice.bankDetails.cifNumber}
                onChange={(e) => updateInvoice({ 
                  bankDetails: { 
                    ...currentInvoice.bankDetails, 
                    cifNumber: e.target.value 
                  } 
                })}
                placeholder=""
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <input
                type="text"
                value={currentInvoice.bankDetails.branch}
                onChange={(e) => updateInvoice({ 
                  bankDetails: { 
                    ...currentInvoice.bankDetails, 
                    branch: e.target.value 
                  } 
                })}
                placeholder=""
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                value={currentInvoice.bankDetails.ifsc}
                onChange={(e) => updateInvoice({ 
                  bankDetails: { 
                    ...currentInvoice.bankDetails, 
                    ifsc: e.target.value 
                  } 
                })}
                placeholder=""
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Invoice items */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Invoice Items</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentInvoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(item.id, { description: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateInvoiceItem(item.id, { qty: Number(e.target.value) })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateInvoiceItem(item.id, { rate: Number(e.target.value) })}
                      className="w-28 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {(item.qty * item.rate).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    <button
                      onClick={() => removeInvoiceItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button
          onClick={addInvoiceItem}
          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-1" />
          Add Item
        </button>
      </div>
      
      {/* Save button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={saveInvoice}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save size={16} className="mr-2" />
          Save Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm; 