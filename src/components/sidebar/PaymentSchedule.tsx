import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { formatScheduleForDisplay } from '../../utils/paymentSchedule';

const PaymentSchedule: React.FC = () => {
  const { currentInvoice, createSchedule, paymentSchedule } = useInvoice();
  const [isExpanded, setIsExpanded] = useState(false);
  const [intervals, setIntervals] = useState(2);
  const [startDate, setStartDate] = useState('');
  
  if (!currentInvoice) {
    return <div>Loading...</div>;
  }
  
  const handleCreateSchedule = () => {
    createSchedule(intervals, startDate || undefined);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Schedule</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <ChevronUp size={16} aria-hidden="true" />
          ) : (
            <ChevronDown size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-2 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-600 block">Number of Payments</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={intervals}
              onChange={(e) => setIntervals(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 6, 12].map((option) => (
                <option key={option} value={option}>
                  {option} payment{option !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-gray-600 block">Start Date</label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Calendar 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                aria-hidden="true" 
              />
            </div>
          </div>
          
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleCreateSchedule}
          >
            Create Schedule
          </button>
        </div>
      )}
      
      {paymentSchedule.length > 0 && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
          <h4 className="font-medium text-blue-800 mb-1">Payment Plan:</h4>
          <div className="text-blue-700 whitespace-pre-line">
            {formatScheduleForDisplay(paymentSchedule, currentInvoice.currency)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSchedule; 