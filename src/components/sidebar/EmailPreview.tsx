import React, { useState, useEffect } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Check, Send, AlertCircle, Loader } from 'lucide-react';

const EmailPreview: React.FC = () => {
  const { currentInvoice, emailInvoice, isProcessing, statusMessage } = useInvoice();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (currentInvoice?.to?.email) {
      setEmail(currentInvoice.to.email);
    }
  }, [currentInvoice]);

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }
  
  const handleSendEmail = async () => {
    setEmailSent(false);
    setError('');
    
    if (!email) {
      setError('Please enter an email address');
      return;
    }
    
    const success = await emailInvoice(email);
    setEmailSent(success);
    
    if (!success) {
      setError('Failed to send email. Please try again.');
    }
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview via Email</h3>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Email address"
          disabled={isProcessing}
        />
        {emailSent && (
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">
            <Check size={18} aria-hidden="true" />
          </span>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-xs flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </div>
      )}
      
      <button
        className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
        onClick={handleSendEmail}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader size={16} className="mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send size={16} className="mr-2" aria-hidden="true" />
            Send
          </>
        )}
      </button>
      
      {statusMessage && (
        <div className="text-xs text-gray-500 mt-1">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default EmailPreview;