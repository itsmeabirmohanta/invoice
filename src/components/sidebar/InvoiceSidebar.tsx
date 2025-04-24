import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import EmailPreview from './EmailPreview';
import TemplateSelector from './TemplateSelector';
import TaxSettings from './TaxSettings';
import DiscountSettings from './DiscountSettings';
import CurrencySelector from './CurrencySelector';
import ActionButtons from './ActionButtons';
import ReviewSettings from './ReviewSettings';
import PaymentSchedule from './PaymentSchedule';

const InvoiceSidebar: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 h-full">
      <div className="space-y-6">
        <EmailPreview />
        <PaymentSchedule />
        <ReviewSettings />
        <TemplateSelector />
        <TaxSettings />
        <DiscountSettings />
        <CurrencySelector />
        <ActionButtons />
      </div>
    </div>
  );
};

export default InvoiceSidebar;