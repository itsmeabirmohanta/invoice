import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import InvoiceHeader from './InvoiceHeader';
import BusinessDetails from './BusinessDetails';
import InvoiceItems from './InvoiceItems';
import InvoiceNotes from './InvoiceNotes';
import InvoiceSignature from './InvoiceSignature';
import InvoicePhotos from './InvoicePhotos';
import InvoiceFooter from './InvoiceFooter';

const InvoiceEditView: React.FC = () => {
  const { currentInvoice: invoice } = useInvoice();

  if (!invoice) {
    return <div>Loading invoice...</div>;
  }

  return (
    <div className="space-y-6">
      <InvoiceHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusinessDetails 
          type="from"
          label="From"
          business={invoice.from}
        />
        <BusinessDetails 
          type="to"
          label="Bill To"
          business={invoice.to}
        />
      </div>
      
      <InvoiceItems />
      <InvoiceNotes />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InvoiceSignature />
          <InvoicePhotos />
        </div>
      </div>

      <InvoiceFooter />
    </div>
  );
};

export default InvoiceEditView;