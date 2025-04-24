import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { Invoice } from '../../types';

interface RecentActivityProps {
  invoices: Invoice[];
  isClient: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ invoices, isClient }) => {
  // Sort invoices by date descending to get the most recent ones
  const sortedInvoices = [...invoices].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 5); // Take the 5 most recent invoices

  // Get formatted date
  const formatDate = (dateStr: string) => {
    if (!isClient) return dateStr;
    
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get time ago string
  const getTimeAgo = (dateStr: string) => {
    if (!isClient) return '';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedInvoices.length > 0 ? (
          sortedInvoices.map((invoice) => (
            <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    invoice.status === 'paid' 
                      ? 'bg-green-100' 
                      : invoice.status === 'outstanding' 
                        ? 'bg-yellow-100' 
                        : 'bg-gray-100'
                  }`}>
                    {invoice.status === 'paid' ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <Clock size={18} className="text-yellow-600" />
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.status === 'paid' 
                        ? `Payment received from ${invoice.to.name}` 
                        : `Invoice sent to ${invoice.to.name}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(invoice.date)}
                      <span className="mx-1">•</span>
                      {getTimeAgo(invoice.date)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(
                      invoice.items.reduce((sum, item) => sum + item.rate * item.qty, 0),
                      invoice.currency
                    )}
                  </p>
                  <p className={`text-xs uppercase font-medium mt-1 rounded-full px-2 py-0.5 inline-flex 
                    ${invoice.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : invoice.status === 'outstanding' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                    {invoice.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity; 