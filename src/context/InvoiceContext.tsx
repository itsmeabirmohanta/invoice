import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceSettings, InvoiceView, InvoiceFilter, InvoiceSort } from '../types';
import { generatePDF as generatePDFUtil } from '../utils/pdfGenerator';
import { sendInvoiceEmail } from '../utils/emailService';
import { createPaymentSchedule, PaymentSchedule } from '../utils/paymentSchedule';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storageUtils';

interface InvoiceContextType {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  settings: InvoiceSettings;
  activeView: InvoiceView;
  filter: InvoiceFilter;
  sort: InvoiceSort;
  searchTerm: string;
  paymentSchedule: PaymentSchedule[];
  isProcessing: boolean;
  statusMessage: string;
  updateInvoice: (updates: Partial<Invoice>) => void;
  updateInvoiceItem: (id: string, updates: any) => void;
  addInvoiceItem: () => void;
  removeInvoiceItem: (id: string) => void;
  updateSettings: (updates: Partial<InvoiceSettings>) => void;
  setActiveView: (view: InvoiceView) => void;
  setFilter: (filter: InvoiceFilter) => void;
  setSort: (sort: InvoiceSort) => void;
  setSearchTerm: (term: string) => void;
  calculateTotal: () => number;
  calculateSubtotal: () => number;
  generatePDF: () => Promise<string | null>;
  emailInvoice: (recipientEmail: string) => Promise<boolean>;
  createNewInvoice: () => void;
  selectInvoice: (id: string) => void;
  saveInvoice: () => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  createSchedule: (intervals: number, startDate?: string) => void;
}

const defaultInvoice: Invoice = {
  id: uuidv4(),
  number: 'INV0001',
  date: '2024-01-01', // Default static date to prevent hydration mismatch
  terms: 'On Receipt',
  from: {
    name: '',
    email: '',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    },
    phone: '',
    businessNumber: '',
  },
  to: {
    name: '',
    email: '',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    },
    phone: '',
  },
  items: [
    {
      id: uuidv4(),
      description: '',
      rate: 0,
      qty: 1,
    },
  ],
  currency: 'INR',
  tax: {
    type: 'None',
    rate: 0,
  },
  discount: {
    type: 'None',
  },
  status: 'draft',
  year: 2024, // Default static year to prevent hydration mismatch
};

const defaultSettings: InvoiceSettings = {
  templateColor: 'default',
  requestReviews: false,
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to track if we're on the client side
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Load initial state from localStorage
  const [invoices, setInvoices] = useState<Invoice[]>(() => 
    getFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, [])
  );
  
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(() => 
    getFromStorage<Invoice>(STORAGE_KEYS.CURRENT_INVOICE, defaultInvoice)
  );
  
  const [settings, setSettings] = useState<InvoiceSettings>(() => 
    getFromStorage<InvoiceSettings>(STORAGE_KEYS.SETTINGS, defaultSettings)
  );
  
  const [activeView, setActiveView] = useState<InvoiceView>('dashboard');
  const [filter, setFilter] = useState<InvoiceFilter>('all');
  const [sort, setSort] = useState<InvoiceSort>({ field: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Update date and year once on client-side
  useEffect(() => {
    if (isClient && currentInvoice) {
      // Only update if these values are still the default static values
      if (currentInvoice.date === '2024-01-01' || currentInvoice.year === 2024) {
        const today = new Date();
        setCurrentInvoice(prev => ({
          ...prev,
          date: today.toISOString().split('T')[0],
          year: today.getFullYear()
        }));
      }
    }
  }, [isClient, currentInvoice]);

  // Save to localStorage whenever states change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
  }, [invoices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_INVOICE, currentInvoice);
  }, [currentInvoice]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  const updateInvoice = (updates: Partial<Invoice>) => {
    setCurrentInvoice((prev) => ({ ...prev, ...updates }));
  };

  const updateInvoiceItem = (id: string, updates: any) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  };

  const addInvoiceItem = () => {
    setCurrentInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), description: '', rate: 0, qty: 1 }],
    }));
  };

  const removeInvoiceItem = (id: string) => {
    if (currentInvoice.items.length <= 1) return;
    setCurrentInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const updateSettings = (updates: Partial<InvoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const calculateSubtotal = () => {
    return currentInvoice.items.reduce((total, item) => total + item.rate * item.qty, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    let total = subtotal;

    if (currentInvoice.tax?.type !== 'None' && currentInvoice.tax?.rate) {
      total += subtotal * (currentInvoice.tax.rate / 100);
    }

    if (currentInvoice.discount?.type !== 'None' && currentInvoice.discount?.value) {
      if (currentInvoice.discount.type === 'Percentage') {
        total -= subtotal * (currentInvoice.discount.value / 100);
      } else if (currentInvoice.discount.type === 'Fixed Amount') {
        total -= currentInvoice.discount.value;
      }
    }

    return total;
  };

  const generatePDF = async (): Promise<string | null> => {
    if (!currentInvoice) return null;
    
    setIsProcessing(true);
    setStatusMessage('Generating PDF...');
    
    try {
      // Make sure the UI is fully updated before generating the PDF
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const fileName = await generatePDFUtil(currentInvoice.id, currentInvoice);
      
      setStatusMessage(`PDF generated successfully: ${fileName}`);
      return fileName;
    } catch (error) {
      console.error('Error in PDF generation:', error);
      setStatusMessage(error instanceof Error ? `Error: ${error.message}` : 'Failed to generate PDF');
      return null;
    } finally {
      // Make sure processing state is always cleared
      setIsProcessing(false);
    }
  };

  const emailInvoice = async (recipientEmail: string): Promise<boolean> => {
    if (!currentInvoice) return false;
    
    setIsProcessing(true);
    setStatusMessage('Preparing to send email...');
    
    try {
      // First generate the PDF
      let pdfFileName = null;
      try {
        pdfFileName = await generatePDF();
        if (!pdfFileName) {
          throw new Error('Could not generate PDF for email attachment');
        }
      } catch (pdfError) {
        setStatusMessage(`PDF generation failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`);
        return false;
      }
      
      // Then send the email
      setStatusMessage('Sending email...');
      const result = await sendInvoiceEmail(currentInvoice, recipientEmail, pdfFileName);
      
      setStatusMessage(result.message);
      return result.success;
    } catch (error) {
      console.error('Error sending email:', error);
      setStatusMessage(error instanceof Error ? `Email error: ${error.message}` : 'Failed to send email');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const createSchedule = (intervals: number, startDate?: string) => {
    if (!currentInvoice) return;
    
    // Use client-safe date handling
    const schedule = createPaymentSchedule({
      invoiceAmount: calculateTotal(),
      numberOfPayments: intervals,
      startDate: startDate || (isClient ? new Date().toISOString().split('T')[0] : '2024-01-01'),
    });
    
    setPaymentSchedule(schedule);
  };

  const createNewInvoice = () => {
    const newInvoice = {
      ...defaultInvoice,
      id: uuidv4(),
      number: `INV${String(invoices.length + 1).padStart(4, '0')}`,
    };
    setCurrentInvoice(newInvoice);
    setActiveView('edit');
  };

  const selectInvoice = (id: string) => {
    const invoice = invoices.find((inv) => inv.id === id);
    if (invoice) {
      setCurrentInvoice(invoice);
      setActiveView('edit');
    }
  };

  const saveInvoice = () => {
    setInvoices((prev) => {
      const index = prev.findIndex((inv) => inv.id === currentInvoice.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = currentInvoice;
        return updated;
      }
      return [...prev, { ...currentInvoice, status: 'outstanding' }];
    });
    
    setActiveView('dashboard');
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    if (currentInvoice.id === id) {
      setCurrentInvoice(defaultInvoice);
      setActiveView('dashboard');
    }
  };

  const markAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        currentInvoice,
        settings,
        activeView,
        filter,
        sort,
        searchTerm,
        paymentSchedule,
        isProcessing,
        statusMessage,
        updateInvoice,
        updateInvoiceItem,
        addInvoiceItem,
        removeInvoiceItem,
        updateSettings,
        setActiveView,
        setFilter,
        setSort,
        setSearchTerm,
        calculateTotal,
        calculateSubtotal,
        generatePDF,
        emailInvoice,
        createNewInvoice,
        selectInvoice,
        saveInvoice,
        deleteInvoice,
        markAsPaid,
        createSchedule,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};