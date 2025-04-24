import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { Switch } from '@headlessui/react';

const ReviewSettings: React.FC = () => {
  const { settings, updateSettings } = useInvoice();

  const toggleReviews = () => {
    updateSettings({ requestReviews: !settings.requestReviews });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reviews</h3>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Request reviews</span>
        <Switch
          checked={settings.requestReviews}
          onChange={toggleReviews}
          className={`${
            settings.requestReviews ? 'bg-blue-500' : 'bg-gray-300'
          } relative inline-flex items-center h-5 rounded-full w-10 transition-colors`}
        >
          <span
            className={`${
              settings.requestReviews ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-3 h-3 transform bg-white rounded-full transition-transform`}
          />
        </Switch>
      </div>
      {settings.requestReviews && (
        <div>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Review website link"
            value={settings.reviewLink || ''}
            onChange={(e) => updateSettings({ reviewLink: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-2">
            Grow your business by collecting rating and reviews.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewSettings;