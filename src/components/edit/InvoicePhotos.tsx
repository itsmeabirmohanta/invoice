import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const InvoicePhotos: React.FC = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-gray-700">Photos</h2>
      <div className="border border-gray-300 rounded-md p-4">
        <button className="flex items-center justify-center text-gray-500">
          <ImageIcon size={20} className="mr-2" aria-hidden="true" />
          <span className="text-sm">Add Photo</span>
        </button>
      </div>
    </div>
  );
};

export default InvoicePhotos;