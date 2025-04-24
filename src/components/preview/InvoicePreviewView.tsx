import React, { useState, useEffect, useRef } from 'react';
import { useInvoice } from '../../context/InvoiceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FileDown, Loader, AlertCircle, Check, ArrowLeft, Printer } from 'lucide-react';

const InvoicePreviewView: React.FC = () => {
  const { 
    currentInvoice, 
    calculateTotal, 
    calculateSubtotal,
    generatePDF, 
    isProcessing, 
    statusMessage,
    setActiveView
  } = useInvoice();
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Reset states when invoice changes or component mounts
    setPdfGenerated(false);
    setError('');
    setIsClient(true);
  }, [currentInvoice?.id]);

  if (!currentInvoice) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-500">Loading invoice...</p>
        </div>
      </div>
    );
  }
  
  const handleGeneratePDF = async () => {
    setPdfGenerated(false);
    setError('');
    
    try {
      // No need to set processing state manually as it's handled in the context
      
      // Ensure preview is fully rendered before generating PDF
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = await generatePDF();
      setPdfGenerated(!!result);
      
      if (!result) {
        setError('Failed to generate PDF. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the PDF.');
      console.error('PDF generation error:', err);
    }
  };

  // Add a function to handle printing, focusing only on the invoice
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow || !currentInvoice) return;
    
    // Generate a clean, self-contained invoice for printing
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${currentInvoice.number}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            
            /* Reset styles */
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
            }
            
            body { 
              background: white;
              color: #000;
              font-size: 11pt;
              line-height: 1.4;
              width: 100%;
              max-width: 100%;
              height: 100%;
              padding: 5mm;
            }
            
            /* Layout */
            .invoice-container {
              width: 100%;
              max-width: 100%;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            
            .header-left {
              max-width: 60%;
            }
            
            .header-right {
              text-align: right;
            }
            
            /* Typography */
            h1 { font-size: 16pt; margin-bottom: 4px; font-weight: bold; }
            h2 { font-size: 14pt; margin-bottom: 4px; font-weight: bold; }
            h3 { font-size: 12pt; margin-bottom: 3px; font-weight: bold; }
            h4 { font-size: 11pt; margin-bottom: 3px; font-weight: 600; }
            
            p { margin-bottom: 4px; }
            
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            
            .font-bold { font-weight: bold; }
            .text-sm { font-size: 10pt; }
            .text-xs { font-size: 9pt; }
            .uppercase { text-transform: uppercase; }
            
            .section {
              margin-bottom: 20px;
            }
            
            /* Table styles */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            th {
              text-align: left;
              padding: 8px 4px;
              border-bottom: 1px solid #ddd;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 9pt;
              color: #555;
            }
            
            td {
              padding: 8px 4px;
              border-bottom: 1px solid #eee;
            }
            
            /* Utilities */
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-4 { margin-bottom: 16px; }
            
            .gray { color: #555; }
            
            .totals-section {
              width: 100%;
              display: flex;
              justify-content: flex-end;
            }
            
            .totals-table {
              width: 40%;
            }
            
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
            }
            
            .total-border-top {
              border-top: 1px solid #ddd;
              padding-top: 4px;
              margin-top: 4px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header with business info and invoice details -->
            <div class="header">
              <!-- From section -->
              <div class="header-left">
                <h1>${currentInvoice.from.name}</h1>
                <p>${currentInvoice.from.address.street1}${currentInvoice.from.address.street2 ? `, ${currentInvoice.from.address.street2}` : ''}</p>
                <p>${currentInvoice.from.address.city}${currentInvoice.from.address.state ? `, ${currentInvoice.from.address.state}` : ''}${currentInvoice.from.address.zip ? ` ${currentInvoice.from.address.zip}` : ''}</p>
                <p>${currentInvoice.from.phone || ''}</p>
                <p>${currentInvoice.from.email || ''}</p>
                ${currentInvoice.from.businessNumber ? `<p>Business Number: ${currentInvoice.from.businessNumber}</p>` : ''}
              </div>
              
              <!-- Invoice details -->
              <div class="header-right">
                <h2 class="uppercase">INVOICE</h2>
                <p class="mb-2">${currentInvoice.number}</p>
                
                <h4 class="uppercase text-sm gray mb-1">Date</h4>
                <p class="mb-2">${formatDisplayDate(currentInvoice.date)}</p>
                
                <h4 class="uppercase text-sm gray mb-1">Due</h4>
                <p class="mb-2">${currentInvoice.terms || 'On Receipt'}</p>
                
                <h4 class="uppercase text-sm gray mb-1">Balance Due</h4>
                <p class="font-bold">${formatCurrency(calculateTotal(), currentInvoice.currency)}</p>
              </div>
            </div>
            
            <!-- Bill To section -->
            <div class="section">
              <h4 class="uppercase text-sm gray mb-1">Bill To</h4>
              <h3>${currentInvoice.to.name}</h3>
              <p>${currentInvoice.to.address.street1}${currentInvoice.to.address.street2 ? `, ${currentInvoice.to.address.street2}` : ''}</p>
              <p>${currentInvoice.to.address.city}${currentInvoice.to.address.state ? `, ${currentInvoice.to.address.state}` : ''}${currentInvoice.to.address.zip ? ` ${currentInvoice.to.address.zip}` : ''}</p>
              ${currentInvoice.to.phone ? `<p>${currentInvoice.to.phone}</p>` : ''}
              ${currentInvoice.to.email ? `<p>${currentInvoice.to.email}</p>` : ''}
            </div>
            
            <!-- Invoice Items -->
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Rate</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${currentInvoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="text-right">${formatCurrency(item.rate, currentInvoice.currency)}</td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-right">${formatCurrency(item.rate * item.qty, currentInvoice.currency)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div class="totals-section">
              <div class="totals-table">
                <div class="totals-row">
                  <span>Total</span>
                  <span>${formatCurrency(calculateSubtotal(), currentInvoice.currency)}</span>
                </div>
                
                ${currentInvoice.tax?.type !== 'None' && currentInvoice.tax?.rate && currentInvoice.tax.rate > 0 ? `
                  <div class="totals-row">
                    <span>GST (${currentInvoice.tax.rate}%)</span>
                    <span>${formatCurrency(calculateTax(), currentInvoice.currency)}</span>
                  </div>
                ` : ''}
                
                ${currentInvoice.discount?.type !== 'None' && currentInvoice.discount?.value ? `
                  <div class="totals-row">
                    <span>Discount ${currentInvoice.discount.type === 'Percentage' ? `(${currentInvoice.discount.value}%)` : ''}</span>
                    <span>-${formatCurrency(calculateDiscount(), currentInvoice.currency)}</span>
                  </div>
                ` : ''}
                
                <div class="totals-row total-border-top">
                  <span>Balance Due</span>
                  <span>${currentInvoice.currency} ${formatCurrency(calculateTotal(), currentInvoice.currency, false)}</span>
                </div>
              </div>
            </div>
            
            <!-- Notes -->
            ${currentInvoice.notes ? `
              <div class="section">
                <h3 class="mb-2">Notes</h3>
                <p>${currentInvoice.notes.replace(/\n/g, '<br>')}</p>
              </div>
            ` : ''}
            
            <!-- Signature -->
            ${currentInvoice.signature ? `
              <div class="section" style="margin-top: 20px;">
                <img src="${currentInvoice.signature}" alt="Signature" style="max-height: 50px; max-width: 150px;" />
                <p>${currentInvoice.from.name}</p>
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `);
    
    // Print the window
    printWindow.document.close();
    printWindow.focus();
    
    // Add a slight delay to ensure styles are applied
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing is done
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    if (currentInvoice.tax?.type !== 'None' && currentInvoice.tax?.rate) {
      return subtotal * (currentInvoice.tax.rate / 100);
    }
    return 0;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (currentInvoice.discount?.type !== 'None' && currentInvoice.discount?.value) {
      if (currentInvoice.discount.type === 'Percentage') {
        return subtotal * (currentInvoice.discount.value / 100);
      } else if (currentInvoice.discount.type === 'Fixed Amount') {
        return currentInvoice.discount.value;
      }
    }
    return 0;
  };
  
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    // Return the original date string during server-side rendering
    if (!isClient) {
      return dateString;
    }
    
    // Only format dates on the client side after hydration is complete
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      {/* UI Controls - Not printed */}
      <div className="print-hidden">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setActiveView('edit')}
            className="flex items-center text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Edit
          </button>
        </div>
      </div>

      {/* Invoice Preview - This is what gets printed */}
      <div id="invoice-preview" className="border border-gray-200 p-8 rounded-lg shadow-sm" ref={previewRef}>
        {/* Top section with business info and invoice details */}
        <div className="flex justify-between mb-12 header">
          {/* From (Your Business) Info - Left Side */}
          <div className="max-w-[60%] header-left">
            <h1 className="text-2xl font-bold mb-1">{currentInvoice.from.name}</h1>
            <p className="text-gray-600">
              {currentInvoice.from.address.street1}
              {currentInvoice.from.address.street2 && `, ${currentInvoice.from.address.street2}`}
            </p>
            <p className="text-gray-600">
              {currentInvoice.from.address.city}
              {currentInvoice.from.address.state && `, ${currentInvoice.from.address.state}`}
              {currentInvoice.from.address.zip && ` ${currentInvoice.from.address.zip}`}
            </p>
            <p className="text-gray-600 mt-1">{currentInvoice.from.phone}</p>
            <p className="text-gray-600">{currentInvoice.from.email}</p>
            {currentInvoice.from.businessNumber && (
              <p className="text-gray-600 mt-1">Business Number: {currentInvoice.from.businessNumber}</p>
            )}
          </div>

          {/* Invoice Details - Right Side */}
          <div className="text-right header-right">
            <h2 className="text-xl uppercase font-bold text-gray-800 mb-2">Invoice</h2>
            <p className="text-gray-700 mb-4">{currentInvoice.number}</p>
            
            <div className="mb-2">
              <h3 className="text-sm uppercase font-semibold text-gray-500">Date</h3>
              <p>{formatDisplayDate(currentInvoice.date)}</p>
            </div>
            
            <div className="mb-2">
              <h3 className="text-sm uppercase font-semibold text-gray-500">Due</h3>
              <p>{currentInvoice.terms || 'On Receipt'}</p>
            </div>
            
            <div className="mb-2">
              <h3 className="text-sm uppercase font-semibold text-gray-500">Balance Due</h3>
              <p className="font-bold">{formatCurrency(calculateTotal(), currentInvoice.currency)}</p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-8 section bill-to">
          <h2 className="text-sm uppercase font-semibold text-gray-500 mb-2">Bill To</h2>
          <h3 className="text-lg font-bold mb-1">{currentInvoice.to.name}</h3>
          <p className="text-gray-600">
            {currentInvoice.to.address.street1}
            {currentInvoice.to.address.street2 && `, ${currentInvoice.to.address.street2}`}
          </p>
          <p className="text-gray-600">
            {currentInvoice.to.address.city}
            {currentInvoice.to.address.state && `, ${currentInvoice.to.address.state}`}
            {currentInvoice.to.address.zip && ` ${currentInvoice.to.address.zip}`}
          </p>
          {currentInvoice.to.phone && (
            <p className="text-gray-600">{currentInvoice.to.phone}</p>
          )}
          {currentInvoice.to.email && (
            <p className="text-gray-600">{currentInvoice.to.email}</p>
          )}
        </div>

        {/* Invoice Items Table */}
        <div className="mb-8 section">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 text-left text-sm uppercase font-semibold text-gray-500">Description</th>
                <th className="py-2 text-right text-sm uppercase font-semibold text-gray-500">Rate</th>
                <th className="py-2 text-center text-sm uppercase font-semibold text-gray-500">Qty</th>
                <th className="py-2 text-right text-sm uppercase font-semibold text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoice.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{formatCurrency(item.rate, currentInvoice.currency)}</td>
                  <td className="py-3 text-center">{item.qty}</td>
                  <td className="py-3 text-right">{formatCurrency(item.rate * item.qty, currentInvoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8 totals section">
          <div className="w-1/3 totals-inner">
            <div className="flex justify-between py-2 total-row">
              <span className="font-semibold text-gray-600">Total</span>
              <span>{formatCurrency(calculateSubtotal(), currentInvoice.currency)}</span>
            </div>
            
            {currentInvoice.tax?.type !== 'None' && currentInvoice.tax?.rate && currentInvoice.tax.rate > 0 && (
              <div className="flex justify-between py-2 total-row">
                <span className="font-semibold text-gray-600">
                  GST ({currentInvoice.tax.rate}%)
                </span>
                <span>{formatCurrency(calculateTax(), currentInvoice.currency)}</span>
              </div>
            )}
            
            {currentInvoice.discount?.type !== 'None' && currentInvoice.discount?.value && (
              <div className="flex justify-between py-2 total-row">
                <span className="font-semibold text-gray-600">
                  Discount {currentInvoice.discount.type === 'Percentage' 
                    ? `(${currentInvoice.discount.value}%)` 
                    : ''}
                </span>
                <span>-{formatCurrency(calculateDiscount(), currentInvoice.currency)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2 total-row total-border-top font-bold">
              <span className="uppercase">Balance Due</span>
              <span>{currentInvoice.currency} {formatCurrency(calculateTotal(), currentInvoice.currency, false)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {currentInvoice.notes && (
          <div className="mb-6 notes section">
            <h2 className="font-bold mb-1">Notes</h2>
            <p className="text-gray-700 whitespace-pre-line">{currentInvoice.notes}</p>
          </div>
        )}
        
        {/* Signature */}
        {currentInvoice.signature && (
          <div className="mt-6 signature section">
            <div className="flex items-center">
              <img 
                src={currentInvoice.signature} 
                alt="Signature" 
                className="max-h-16 mb-1" 
              />
            </div>
            <p className="text-gray-600">{currentInvoice.from.name}</p>
          </div>
        )}
      </div>

      {/* Action buttons - Not printed */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8 print-hidden">
        <button 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          onClick={() => setActiveView('edit')}
        >
          Back to Edit
        </button>
        
        <div className="flex items-center space-x-3">
          {error && (
            <div className="text-red-500 text-sm mr-3 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {error}
            </div>
          )}
          
          {/* Print Button */}
          <button 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center"
            onClick={handlePrint}
          >
            <Printer size={16} className="mr-2" aria-hidden="true" />
            Print Invoice
          </button>
          
          {/* PDF download button */}
          <button 
            className={`px-4 py-2 rounded transition-colors flex items-center ${
              isProcessing 
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={handleGeneratePDF}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileDown size={16} className="mr-2" aria-hidden="true" />
                {pdfGenerated ? 'Download Again' : 'Save as PDF'} {pdfGenerated && <Check size={14} className="ml-1 text-green-300" />}
              </>
            )}
          </button>
        </div>
      </div>
      
      {statusMessage && (
        <div className="text-sm text-gray-500 mt-2 text-center print-hidden">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default InvoicePreviewView;