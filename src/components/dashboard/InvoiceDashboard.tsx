import React, { useState, useEffect } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Search, Plus } from 'lucide-react';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import InvoiceTable from './InvoiceTable';
import RecentActivity from './RecentActivity';
import InvoiceChart from './InvoiceChart';

const InvoiceDashboard: React.FC = () => {
  const {
    invoices,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    createNewInvoice,
    selectInvoice,
    markAsPaid,
    deleteInvoice,
    sort,
    setSort,
  } = useInvoice();

  // Add state for client-side rendering
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle sorting
  const handleSort = (field: 'date' | 'number' | 'client' | 'amount') => {
    if (sort.field === field) {
      setSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, direction: 'desc' });
    }
  };

  // Sort invoices based on current sort settings
  const sortInvoices = (invs: typeof invoices) => {
    return [...invs].sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      
      switch (sort.field) {
        case 'date':
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
        case 'number':
          return a.number.localeCompare(b.number) * direction;
        case 'client':
          return a.to.name.localeCompare(b.to.name) * direction;
        case 'amount':
          const aTotal = a.items.reduce((sum, item) => sum + item.rate * item.qty, 0);
          const bTotal = b.items.reduce((sum, item) => sum + item.rate * item.qty, 0);
          return (aTotal - bTotal) * direction;
        default:
          return 0;
      }
    });
  };

  // Apply filters and sorting
  const filteredInvoices = sortInvoices(
    invoices.filter((invoice) => {
      if (filter === 'outstanding') return invoice.status === 'outstanding';
      if (filter === 'paid') return invoice.status === 'paid';
      return true;
    })
    .filter((invoice) =>
      invoice.to.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate total outstanding amount for the invoice table header
  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'outstanding')
    .reduce((sum, inv) => sum + inv.items.reduce((total, item) => total + item.rate * item.qty, 0), 0);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All invoices
          </button>
          <button
            onClick={() => setFilter('outstanding')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'outstanding'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Outstanding
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'paid'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Paid
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            onClick={createNewInvoice}
            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            <Plus size={20} className="mr-2" />
            New invoice
          </button>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <DashboardStats invoices={invoices} isClient={isClient} />

      {/* Dashboard Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="md:col-span-2">
          <QuickActions createNewInvoice={createNewInvoice} setFilter={setFilter} />
        </div>
        
        {/* Recent Activity */}
        <div className="md:col-span-1">
          <RecentActivity invoices={invoices} isClient={isClient} />
        </div>
      </div>

      {/* Invoice Chart */}
      <InvoiceChart invoices={invoices} isClient={isClient} />

      {/* Invoice Table */}
      <InvoiceTable 
        invoices={filteredInvoices}
        sort={sort}
        handleSort={handleSort}
        selectInvoice={selectInvoice}
        markAsPaid={markAsPaid}
        deleteInvoice={deleteInvoice}
        createNewInvoice={createNewInvoice}
        filter={filter}
        isClient={isClient}
        totalOutstanding={totalOutstanding}
      />
    </div>
  );
};

export default InvoiceDashboard;