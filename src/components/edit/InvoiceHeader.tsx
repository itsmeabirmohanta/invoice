import React, { useRef } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { ImagePlus, Check, X } from 'lucide-react';

const InvoiceHeader: React.FC = () => {
  const { currentInvoice, updateInvoice } = useInvoice();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      updateInvoice({ logo: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateInvoice({ logo: undefined });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice</label>
        <input
          type="text"
          value={currentInvoice.number}
          onChange={(e) => updateInvoice({ number: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div 
        className="flex items-center justify-center border border-gray-300 rounded-md p-4 h-full cursor-pointer hover:bg-gray-50"
        onClick={handleLogoClick}
      >
        {currentInvoice.logo ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={currentInvoice.logo} 
              alt="Company Logo" 
              className="max-h-16 max-w-full object-contain" 
            />
            <button 
              onClick={handleRemoveLogo}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              title="Remove logo"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <ImagePlus size={24} aria-hidden="true" />
            <span className="text-xs mt-1">+ Logo</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleLogoUpload}
        />
      </div>
    </div>
  );
};

export default InvoiceHeader;