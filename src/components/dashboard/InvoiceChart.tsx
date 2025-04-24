import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Invoice } from '../../types';

interface InvoiceChartProps {
  invoices: Invoice[];
  isClient: boolean;
}

const InvoiceChart: React.FC<InvoiceChartProps> = ({ invoices, isClient }) => {
  // Don't render the chart on the server
  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Chart loading...</p>
        </div>
      </div>
    );
  }
  
  // Group invoices by month for the last 6 months
  const chartData = useMemo(() => {
    // Get last 6 months
    const today = new Date();
    const months: string[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
    }
    
    // Initialize data structure
    const data = months.map(month => ({
      month,
      paid: 0,
      outstanding: 0,
    }));
    
    // Fill with invoice data
    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.date);
      const monthYear = `${monthNames[invoiceDate.getMonth()]} ${invoiceDate.getFullYear()}`;
      
      const monthIndex = data.findIndex(item => item.month === monthYear);
      if (monthIndex !== -1) {
        const amount = invoice.items.reduce((sum, item) => sum + (item.rate * item.qty), 0);
        
        if (invoice.status === 'paid') {
          data[monthIndex].paid += amount;
        } else if (invoice.status === 'outstanding') {
          data[monthIndex].outstanding += amount;
        }
      }
    });
    
    return data;
  }, [invoices]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Invoice Summary</h2>
      </div>
      
      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => 
                new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value)
              } 
            />
            <Tooltip 
              formatter={(value: number) => 
                new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(value)
              } 
            />
            <Legend />
            <Bar dataKey="paid" fill="#10B981" name="Paid" />
            <Bar dataKey="outstanding" fill="#FBBF24" name="Outstanding" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvoiceChart; 