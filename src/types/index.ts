export interface InvoiceItem {
  id: string;
  description: string;
  rate: number;
  qty: number;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country?: string;
}

export interface BusinessDetails {
  name: string;
  email: string;
  address: Address;
  phone?: string;
  businessNumber?: string;
}

export interface BankDetails {
  accountNumber?: string;
  cifNumber?: string;
  branch?: string;
  ifsc?: string;
}

export interface PaymentScheduleInfo {
  intervals: number;
  startDate: string;
  completed?: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate?: string;
  terms?: string;
  from: BusinessDetails;
  to: BusinessDetails;
  items: InvoiceItem[];
  notes?: string;
  bankDetails?: BankDetails;
  tax?: {
    type: string;
    rate?: number;
  };
  discount?: {
    type: string;
    value?: number;
  };
  currency: string;
  logo?: string;
  signature?: string;
  status: 'draft' | 'outstanding' | 'paid';
  year: number;
  paymentSchedule?: PaymentScheduleInfo;
}

export type TemplateColor = 
  | 'default'
  | 'gray'
  | 'dark'
  | 'slate'
  | 'red'
  | 'pink'
  | 'purple'
  | 'navy'
  | 'blue'
  | 'sky'
  | 'teal'
  | 'green'
  | 'lime'
  | 'custom';

export interface InvoiceSettings {
  templateColor: TemplateColor;
  customColor?: string;
  requestReviews: boolean;
  reviewLink?: string;
}

export type InvoiceView = 'dashboard' | 'edit' | 'preview' | 'history';

export type InvoiceFilter = 'all' | 'outstanding' | 'paid';

export interface InvoiceSort {
  field: 'date' | 'number' | 'client' | 'amount';
  direction: 'asc' | 'desc';
}