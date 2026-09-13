import { jsPDF } from 'jspdf';

export function isIndicText(text: string): boolean {
  // Unicode ranges for Devanagari, Bengali, Gurmukhi, Gujarati, Oriya, Tamil, Telugu, Kannada, Malayalam
  return /[\u0900-\u0D7F]/.test(text);
}

export function printDocument(content: string, title: string = 'NyayaPath_Formal_Complaint') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // If popup blocked, fallback to window.print()
    window.print();
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&family=Noto+Sans+Gurmukhi:wght@400;600;700&family=Noto+Sans+Kannada:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Noto+Sans:wght@400;600;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }
    body {
      margin: 0;
      padding: 20px;
      color: #000000;
      background: #ffffff;
      font-family: 'Noto Serif', 'Noto Sans Devanagari', 'Noto Sans Gurmukhi', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Gujarati', 'Noto Sans Kannada', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.6;
    }
    pre {
      white-space: pre-wrap;
      font-family: inherit;
      margin: 0;
    }
    .header {
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      font-family: sans-serif;
      font-size: 9pt;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="header">
    <span>NYAYAPATH — CITIZEN GRIEVANCE DOSSIER</span>
    <span>CONFIDENTIAL / WHISTLEBLOWER</span>
  </div>
  <pre>${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function generatePDF(content: string, filename: string = 'NyayaPath_Formal_Complaint.pdf') {
  // If Indic text detected, use the browser's native vector print engine to guarantee 100% glyph fidelity
  if (isIndicText(content)) {
    printDocument(content, filename.replace('.pdf', ''));
    return;
  }

  // Pure Latin (English) fallback via jsPDF
  try {
    const doc = new jsPDF();
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    
    const margin = 20;
    const pageHeight = 297;
    const splitText = doc.splitTextToSize(content, 210 - margin * 2);
    
    let cursorY = margin;
    
    for (let i = 0; i < splitText.length; i++) {
      if (cursorY > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(splitText[i], margin, cursorY);
      cursorY += 6.5;
    }
    
    doc.save(filename);
  } catch {
    // Graceful fallback to print document
    printDocument(content, filename.replace('.pdf', ''));
  }
}
