import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import InvoiceTabs from './tabs/InvoiceTabs';
import InvoiceEditView from './edit/InvoiceEditView';
import InvoicePreviewView from './preview/InvoicePreviewView';
import InvoiceDashboard from './dashboard/InvoiceDashboard';
import InvoiceSidebar from './sidebar/InvoiceSidebar';

const InvoiceBuilder: React.FC = () => {
  const { activeView, currentInvoice } = useInvoice();

  if (activeView === 'dashboard') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <InvoiceDashboard />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/4 border-r border-gray-200">
            <InvoiceTabs />
            <div className="p-4">
              {activeView === 'edit' && currentInvoice && <InvoiceEditView />}
              {activeView === 'preview' && currentInvoice && <InvoicePreviewView />}
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <InvoiceSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceBuilder;