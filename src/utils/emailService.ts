import { Invoice } from '../types';

export const sendInvoiceEmail = async (
  invoice: Invoice,
  recipientEmail: string,
  pdfFileName?: string
): Promise<{ success: boolean; message: string }> => {
  // In a real application, this would connect to an email service API
  // For this demo, we'll simulate a successful email send after a short delay
  
  try {
    // Check for required parameters
    if (!invoice) {
      throw new Error('Invoice data is required');
    }
    
    if (!recipientEmail) {
      throw new Error('Recipient email is required');
    }
    
    if (!pdfFileName) {
      throw new Error('PDF attachment is required');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return {
        success: false,
        message: 'Invalid email address format'
      };
    }
    
    // Check if invoice has required fields
    if (!invoice.number || !invoice.from.name) {
      throw new Error('Invoice is missing required information (number or sender name)');
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Sending invoice email', {
      to: recipientEmail,
      subject: `Invoice ${invoice.number} from ${invoice.from.name}`,
      invoiceId: invoice.id,
      pdfAttachment: pdfFileName
    });
    
    // Return success
    return {
      success: true,
      message: `Invoice has been sent to ${recipientEmail} successfully`
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}; 