import React, { useEffect } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import InvoiceForm from '../../components/invoice/InvoiceForm';

export default function NewInvoicePage() {
  const { createNewInvoice } = useInvoice();
  
  // Create a new invoice when the page loads
  useEffect(() => {
    createNewInvoice();
  }, [createNewInvoice]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Invoice</h1>
      <InvoiceForm />
    </div>
  );
} 