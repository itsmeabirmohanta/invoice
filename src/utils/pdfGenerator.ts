import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Invoice } from '../types';

export const generatePDF = async (invoiceId: string, invoice: Invoice) => {
  try {
    const invoiceElement = document.getElementById('invoice-preview');
    
    if (!invoiceElement) {
      throw new Error('Invoice preview element not found');
    }
    
    // Make sure styles are applied and images are loaded
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Create a temporary clone of the invoice element for PDF generation
    // This prevents modifying the visible element on screen
    const clonedElement = invoiceElement.cloneNode(true) as HTMLElement;
    clonedElement.style.width = '210mm'; // A4 width
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '15mm'; // Standard A4 margins
    clonedElement.style.backgroundColor = '#ffffff';
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.borderRadius = '0';
    clonedElement.style.border = 'none';
    
    // Remove any buttons and unnecessary elements
    const buttons = clonedElement.querySelectorAll('button');
    buttons.forEach(button => {
      button.remove();
    });
    
    // Append the clone to the body temporarily
    document.body.appendChild(clonedElement);
    
    // Create a canvas from the cloned element with better settings
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Good balance between quality and performance
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      imageTimeout: 15000, // Increased timeout for image loading
      onclone: (cloneDocument, element) => {
        // Additional styling fixes can be applied here if needed
        Array.from(element.querySelectorAll('*')).forEach((el) => {
          const computedStyle = window.getComputedStyle(el);
          if (computedStyle.display === 'none') {
            (el as HTMLElement).style.display = 'block';
          }
        });
      }
    });
    
    // Clean up the cloned element
    document.body.removeChild(clonedElement);
    
    // A4 dimensions in mm and conversion to canvas points
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    
    // Calculate the ratio to fit width to A4
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF with proper settings
    const pdf = new jsPDF({
      orientation: imgHeight > pdfHeight ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      hotfixes: ['px_scaling']
    });
    
    // Add image to PDF, handling pagination if needed
    if (imgHeight <= pdfHeight) {
      // Content fits on one page
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95), // Using JPEG for smaller file size
        'JPEG',
        0,
        0,
        pdfWidth,
        imgHeight
      );
    } else {
      // Content needs multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;
      
      // Add first page
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        position,
        pdfWidth,
        imgHeight
      );
      
      heightLeft -= pdfHeight;
      
      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position = -pdfHeight * page;
        page++;
        
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0,
          position,
          pdfWidth,
          imgHeight
        );
        
        heightLeft -= pdfHeight;
      }
    }
    
    // Generate filename
    const fileName = `${invoice.number} - ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(invoice.date))}.pdf`;
    
    // Save PDF
    pdf.save(fileName);
    
    return fileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 