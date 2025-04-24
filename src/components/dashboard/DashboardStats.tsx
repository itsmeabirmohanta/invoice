import React from 'react';
import { FileText, Check, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Invoice } from '../../types';

interface DashboardStatsProps {
  invoices: Invoice[];
  isClient: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ invoices, isClient }) => {
  // Calculate dashboard stats
  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'outstanding')
    .reduce((sum, inv) => sum + inv.items.reduce((total, item) => total + item.rate * item.qty, 0), 0);
  
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.items.reduce((total, item) => total + item.rate * item.qty, 0), 0);
  
  const totalInvoices = invoices.length;
  const outstandingInvoices = invoices.filter(inv => inv.status === 'outstanding').length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;

  // Find overdue invoices
  const overdueInvoices = isClient ? invoices.filter(inv => {
    if (inv.status !== 'outstanding' || !inv.dueDate) return false;
    const dueDate = new Date(inv.dueDate);
    const today = new Date();
    return dueDate < today;
  }).length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="p-3 rounded-full bg-blue-100 mr-4">
          <FileText size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
          <p className="text-2xl font-bold">{totalInvoices}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="p-3 rounded-full bg-green-100 mr-4">
          <Check size={24} className="text-green-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Paid</h3>
          <p className="text-2xl font-bold">{paidInvoices}</p>
          <p className="text-sm text-gray-500">{formatCurrency(totalPaid, 'USD')}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="p-3 rounded-full bg-yellow-100 mr-4">
          <Clock size={24} className="text-yellow-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Outstanding</h3>
          <p className="text-2xl font-bold">{outstandingInvoices}</p>
          <p className="text-sm text-gray-500">{formatCurrency(totalOutstanding, 'USD')}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="p-3 rounded-full bg-red-100 mr-4">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
          <p className="text-2xl font-bold">{overdueInvoices}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 