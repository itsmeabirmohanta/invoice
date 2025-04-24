import React from 'react';

const HelpPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Help & Documentation</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Getting Started</h2>
        <p className="mb-4">
          Invoice Simple is an easy-to-use invoicing application for freelancers and small businesses.
          Here's how to get started:
        </p>
        
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Creating an invoice</h3>
            <p>
              Click the "New invoice" button on the dashboard to create a new invoice. Fill in the required 
              information such as client details, items, and payment terms.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Managing invoices</h3>
            <p>
              View all your invoices on the dashboard. You can filter between paid and outstanding invoices,
              and search for specific clients.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Generating PDFs</h3>
            <p>
              While viewing an invoice, click the "Save as PDF" button to generate a PDF of your invoice
              that you can download or send to your client.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Invoice settings</h3>
            <p>
              Customize your invoice appearance and default settings in the Settings page.
            </p>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Need more help?</h3>
        <p>
          For additional assistance, please contact our support team at support@invoicesimple.com.
        </p>
      </div>
    </div>
  );
};

export default HelpPage; 