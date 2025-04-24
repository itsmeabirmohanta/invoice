import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { InvoiceView } from '../../types';
import { FileDown, Mail, Calendar, Loader } from 'lucide-react';

const TabButton: React.FC<{
  view: InvoiceView;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ view, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        active
          ? 'bg-white text-gray-900 border-b-2 border-blue-500'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};

const ActionButton: React.FC<{
  label: string;
  onClick: () => void;
  primary?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}> = ({ label, onClick, primary = false, icon, isLoading = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`px-4 py-2 text-sm font-medium rounded flex items-center ${
        primary
          ? 'bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-500'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
      }`}
    >
      {isLoading ? <Loader size={16} className="mr-2 animate-spin" /> : icon}
      {label}
    </button>
  );
};

const InvoiceTabs: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    generatePDF, 
    emailInvoice, 
    isProcessing, 
    createSchedule, 
    currentInvoice 
  } = useInvoice();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [intervals, setIntervals] = useState(3);

  const handlePDFGeneration = async () => {
    try {
      await generatePDF();
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const handleEmailSend = async () => {
    if (!recipientEmail) return;
    
    try {
      const success = await emailInvoice(recipientEmail);
      if (success) {
        setShowEmailDialog(false);
        setRecipientEmail('');
      }
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  };

  const handleCreateSchedule = () => {
    if (intervals < 1) return;
    
    try {
      createSchedule(intervals);
      setShowScheduleDialog(false);
    } catch (error) {
      console.error('Failed to create payment schedule:', error);
    }
  };

  return (
    <div className="flex justify-between border-b border-gray-200">
      <div className="flex">
        <TabButton
          view="preview"
          label="Preview"
          active={activeView === 'preview'}
          onClick={() => setActiveView('preview')}
        />
        <TabButton
          view="edit"
          label="Edit"
          active={activeView === 'edit'}
          onClick={() => setActiveView('edit')}
        />
        <TabButton
          view="history"
          label="History"
          active={activeView === 'history'}
          onClick={() => setActiveView('history')}
        />
      </div>
      <div className="flex p-1 gap-2">
        <ActionButton 
          label="Payment scheduling" 
          onClick={() => setShowScheduleDialog(true)}
          icon={<Calendar size={16} className="mr-2" />} 
          disabled={!currentInvoice}
        />
        <ActionButton 
          label="PDF" 
          onClick={handlePDFGeneration}
          icon={<FileDown size={16} className="mr-2" />}
          isLoading={isProcessing}
          disabled={!currentInvoice}
        />
        <ActionButton 
          label="Email Invoice" 
          onClick={() => setShowEmailDialog(true)} 
          primary
          icon={<Mail size={16} className="mr-2" />}
          disabled={!currentInvoice}
        />
      </div>

      {/* Email Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Send Invoice via Email</h3>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Recipient email address"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowEmailDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleEmailSend}
                disabled={isProcessing || !recipientEmail}
              >
                {isProcessing ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Dialog */}
      {showScheduleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Create Payment Schedule</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of payments
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={intervals}
                onChange={(e) => setIntervals(parseInt(e.target.value) || 1)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowScheduleDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleCreateSchedule}
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTabs;