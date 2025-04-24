import React from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { TemplateColor } from '../../types';

const colorOptions: { color: TemplateColor; bgClass: string }[] = [
  { color: 'default', bgClass: 'bg-white border border-gray-300' },
  { color: 'gray', bgClass: 'bg-gray-800' },
  { color: 'dark', bgClass: 'bg-gray-900' },
  { color: 'slate', bgClass: 'bg-slate-600' },
  { color: 'red', bgClass: 'bg-red-600' },
  { color: 'pink', bgClass: 'bg-pink-600' },
  { color: 'purple', bgClass: 'bg-purple-600' },
  { color: 'navy', bgClass: 'bg-indigo-900' },
  { color: 'blue', bgClass: 'bg-blue-600' },
  { color: 'sky', bgClass: 'bg-sky-500' },
  { color: 'teal', bgClass: 'bg-teal-600' },
  { color: 'green', bgClass: 'bg-green-600' },
  { color: 'lime', bgClass: 'bg-lime-600' },
];

const TemplateSelector: React.FC = () => {
  const { settings, updateSettings } = useInvoice();

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Template</h3>
      <div className="grid grid-cols-6 gap-2">
        {colorOptions.map(({ color, bgClass }) => (
          <button
            key={color}
            className={`w-8 h-8 rounded ${bgClass} ${
              settings.templateColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
            onClick={() => updateSettings({ templateColor: color })}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
          />
        ))}
        
        <button
          className="w-8 h-8 rounded bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"
          onClick={() => updateSettings({ templateColor: 'custom' })}
          title="Custom Color"
        />
      </div>
      
      {settings.templateColor === 'custom' && (
        <div className="flex items-center mt-2">
          <div className="flex-1">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value="Custom Color"
            >
              <option>Custom Color</option>
            </select>
          </div>
        </div>
      )}
      
      <button
        className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
      >
        Customize
      </button>
    </div>
  );
};

export default TemplateSelector;