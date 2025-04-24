import React, { useState } from 'react';
import { Plus, DollarSign, Clock, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { InvoiceFilter } from '../../types';

interface QuickActionsProps {
  createNewInvoice: () => void;
  setFilter: (filter: InvoiceFilter) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ createNewInvoice, setFilter }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            {expanded ? 'Hide' : 'Show'} <ChevronDown size={16} className={`ml-1 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={createNewInvoice}
            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center transition-colors"
          >
            <Plus size={18} className="mr-2 text-blue-600" />
            <span>Create New Invoice</span>
          </button>
          <Link 
            href="/settings" 
            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center transition-colors"
          >
            <DollarSign size={18} className="mr-2 text-green-600" />
            <span>Manage Payment Methods</span>
          </Link>
          <button 
            onClick={() => setFilter('outstanding')}
            className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center transition-colors"
          >
            <Clock size={18} className="mr-2 text-yellow-600" />
            <span>View Outstanding Invoices</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickActions; 