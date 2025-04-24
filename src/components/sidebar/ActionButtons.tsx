import React, { useState } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Link, Printer, Copy, AlertCircle, Check } from 'lucide-react';

const ActionButtons: React.FC = () => {
  const { generatePDF, isProcessing, statusMessage } = useInvoice();
  const [error, setError] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const handleGeneratePDF = async () => {
    setError('');
    try {
      const result = await generatePDF();
      if (!result) {
        setError('Failed to generate PDF. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while generating the PDF.');
      console.error(err);
    }
  };

  const handleGetLink = () => {
    setLinkCopied(false);
    setError('');
    
    try {
      // Create a shareable link (in a real app, this would generate a unique URL)
      const linkUrl = `${window.location.origin}/shared-invoice/${Date.now()}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(linkUrl)
        .then(() => {
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 3000);
        })
        .catch(err => {
          setError('Failed to copy link to clipboard.');
          console.error(err);
        });
    } catch (err) {
      setError('Failed to generate link.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Options</h3>
      
      {error && (
        <div className="text-red-500 text-xs flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <button 
          className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex justify-center items-center"
          onClick={handleGetLink}
          disabled={isProcessing}
        >
          <Link size={16} className="mr-2" />
          {linkCopied ? (
            <span className="flex items-center">
              Copied <Check size={14} className="ml-1 text-green-300" />
            </span>
          ) : (
            <span>Get Link</span>
          )}
        </button>
        
        <button 
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex justify-center items-center"
          onClick={handleGeneratePDF}
          disabled={isProcessing}
        >
          <Printer size={16} className="mr-2" />
          Print Invoice
        </button>
      </div>
      
      {statusMessage && (
        <div className="text-xs text-gray-500 mt-1">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default ActionButtons;