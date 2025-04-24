import React, { useState } from 'react';
import { ArrowUpDown, FileText, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Invoice, InvoiceSort } from '../../types';

interface InvoiceTableProps {
  invoices: Invoice[];
  sort: InvoiceSort;
  handleSort: (field: 'date' | 'number' | 'client' | 'amount') => void;
  selectInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  deleteInvoice: (id: string) => void;
  createNewInvoice: () => void;
  filter: string;
  isClient: boolean;
  totalOutstanding?: number;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  sort,
  handleSort,
  selectInvoice,
  markAsPaid,
  deleteInvoice,
  createNewInvoice,
  filter,
  isClient,
  totalOutstanding = 0,
}) => {
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Get due status with color code
  const getDueStatus = (invoice: Invoice) => {
    if (!isClient || !invoice.dueDate) return { text: "No due date", color: "text-gray-500" };
    
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} days`, color: "text-red-600" };
    } else if (diffDays === 0) {
      return { text: "Due today", color: "text-orange-500" };
    } else if (diffDays <= 3) {
      return { text: `Due in ${diffDays} days`, color: "text-orange-500" };
    } else {
      return { text: `Due in ${diffDays} days`, color: "text-green-600" };
    }
  };

  // Toggle action menu for a specific invoice
  const toggleActionMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Invoices</h2>
          <div className="flex items-center space-x-4">
            {filter === 'outstanding' && totalOutstanding > 0 && (
              <div className="text-sm text-gray-500">
                Total outstanding:{' '}
                <span className="font-medium text-gray-900">
                  {formatCurrency(totalOutstanding, 'USD')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('number')}
              >
                <div className="flex items-center">
                  Invoice
                  {sort.field === 'number' && (
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('client')}
              >
                <div className="flex items-center">
                  Client
                  {sort.field === 'client' && (
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {sort.field === 'date' && (
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sort.field === 'amount' && (
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length > 0 ? (
              invoices.map((invoice) => {
                const dueStatus = getDueStatus(invoice);
                return (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => selectInvoice(invoice.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.to.name}</div>
                      <div className="text-xs text-gray-500">{invoice.to.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {isClient ? new Date(invoice.date).toLocaleDateString() : invoice.date}
                      </div>
                      {invoice.dueDate && (
                        <div className={`text-xs ${dueStatus.color}`}>
                          {dueStatus.text}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'outstanding' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status === 'outstanding' ? 'Outstanding' : invoice.status === 'paid' ? 'Paid' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="font-medium">
                        {formatCurrency(
                          invoice.items.reduce((sum, item) => sum + item.rate * item.qty, 0),
                          invoice.currency
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={(e) => toggleActionMenu(invoice.id, e)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        
                        {showActionMenu === invoice.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectInvoice(invoice.id);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Edit
                              </button>
                              {invoice.status === 'outstanding' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsPaid(invoice.id);
                                    setShowActionMenu(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Mark as paid
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteInvoice(invoice.id);
                                  setShowActionMenu(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FileText size={40} className="text-gray-300 mb-3" />
                    <p className="text-lg">No invoices found.</p>
                    <p className="text-sm mb-4">Create your first invoice to get started.</p>
                    <button
                      onClick={createNewInvoice}
                      className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                    >
                      <Plus size={16} className="mr-1 inline-block" />
                      New invoice
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable; 