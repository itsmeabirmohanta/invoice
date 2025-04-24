import { Invoice } from '../types';

export interface PaymentSchedule {
  id: string;
  invoiceId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  notes?: string;
}

interface ScheduleParams {
  invoiceAmount: number;
  numberOfPayments: number;
  startDate: string;
  invoiceId?: string;
}

/**
 * Check if code is running in browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const createPaymentSchedule = (
  params: ScheduleParams
): PaymentSchedule[] => {
  const { invoiceAmount, numberOfPayments, startDate, invoiceId = 'temp-id' } = params;
  const amountPerPayment = invoiceAmount / numberOfPayments;
  
  // Parse the date string instead of creating a new Date directly
  const scheduleStartDate = new Date(startDate);
  
  // Generate schedule
  const schedule: PaymentSchedule[] = [];
  for (let i = 0; i < numberOfPayments; i++) {
    const paymentDate = new Date(scheduleStartDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);
    
    schedule.push({
      id: `${invoiceId}-payment-${i + 1}`,
      invoiceId: invoiceId,
      amount: amountPerPayment,
      dueDate: paymentDate.toISOString().split('T')[0],
      status: 'pending',
    });
  }
  
  return schedule;
};

export const formatScheduleForDisplay = (
  schedule: PaymentSchedule[],
  currencyCode: string
): string => {
  // Simple text formatting of the schedule
  return schedule.map((payment, index) => {
    // Always use the ISO date string format during SSR to prevent hydration errors
    let date = payment.dueDate;
    
    // Only format date on client
    if (isBrowser()) {
      try {
        date = new Date(payment.dueDate).toLocaleDateString();
      } catch (e) {
        console.error('Error formatting date:', e);
      }
    }
      
    const amount = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currencyCode 
    }).format(payment.amount);
    
    return `Payment ${index + 1}: ${amount} due on ${date}`;
  }).join('\n');
}; 