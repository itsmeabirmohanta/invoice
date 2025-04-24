import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { BusinessDetails as BusinessDetailsType } from '../../types';
import { Check } from 'lucide-react';

interface BusinessDetailsProps {
  type: 'from' | 'to';
  label: string;
  business: BusinessDetailsType;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ type, label, business }) => {
  const { updateInvoice } = useInvoice();

  const handleChange = (field: string, value: string) => {
    if (type === 'from') {
      updateInvoice({
        from: {
          ...business,
          [field]: value,
        }
      });
    } else {
      updateInvoice({
        to: {
          ...business,
          [field]: value,
        }
      });
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    if (type === 'from') {
      updateInvoice({
        from: {
          ...business,
          address: {
            ...business.address,
            [field]: value,
          }
        }
      });
    } else {
      updateInvoice({
        to: {
          ...business,
          address: {
            ...business.address,
            [field]: value,
          }
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-gray-700">{label}</h2>
      
      <div className="space-y-3">
        <div>
          <label htmlFor={`${type}-name`} className="block text-xs text-gray-500 mb-1">Name</label>
          <input
            id={`${type}-name`}
            type="text"
            value={business.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <label htmlFor={`${type}-email`} className="block text-xs text-gray-500 mb-1">Email</label>
          <div className="relative">
            <input
              id={`${type}-email`}
              type="email"
              value={business.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
            >
              <Check size={18} className="text-green-500" />
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor={`${type}-address`} className="block text-xs text-gray-500 mb-1">Address</label>
          <input
            id={`${type}-address`}
            type="text"
            value={business.address.street1}
            onChange={(e) => handleAddressChange('street1', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            value={business.address.street2 || ''}
            onChange={(e) => handleAddressChange('street2', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            value={business.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="City"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            value={business.address.zip}
            onChange={(e) => handleAddressChange('zip', e.target.value)}
            placeholder="ZIP/Postal Code"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor={`${type}-phone`} className="block text-xs text-gray-500 mb-1">Phone</label>
          <input
            id={`${type}-phone`}
            type="tel"
            value={business.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {type === 'from' && (
          <div>
            <label htmlFor="business-number" className="block text-xs text-gray-500 mb-1">Business Number</label>
            <input
              id="business-number"
              type="text"
              value={business.businessNumber || ''}
              onChange={(e) => handleChange('businessNumber', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
        
        {type === 'to' && (
          <div>
            <label htmlFor="mobile" className="block text-xs text-gray-500 mb-1">Mobile</label>
            <input
              id="mobile"
              type="tel"
              placeholder="Mobile number"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
        
        {type === 'to' && (
          <div>
            <label htmlFor="fax" className="block text-xs text-gray-500 mb-1">Fax</label>
            <input
              id="fax"
              type="text"
              placeholder="Fax number"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetails;