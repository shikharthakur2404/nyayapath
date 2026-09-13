import { jsPDF } from 'jspdf';

export function generatePDF(content: string, filename: string = 'Formal_Complaint.pdf') {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  
  // Split text to fit within page width (approx 170mm for A4 with margins)
  const margin = 20;
  const pageHeight = 297; // A4 height in mm
  
  const splitText = doc.splitTextToSize(content, 210 - margin * 2);
  
  let cursorY = margin;
  
  for (let i = 0; i < splitText.length; i++) {
    if (cursorY > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(splitText[i], margin, cursorY);
    cursorY += 7; // line height
  }
  
  doc.save(filename);
}
