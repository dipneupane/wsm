'use server';

import { Readable } from 'stream';

import PDFDocument from 'pdfkit';

type CustomerData = {
  id: number;
  referenceNo: string;
  customerId: number;
  customerName: string;
  statusId: number;
  status: string;
  itemsCount: number;
  createdDate: string;
};

export async function generateCustomerPDF(customerData: CustomerData) {
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);

    // Add content to the PDF
    doc.fontSize(25).text('Customer Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Customer ID: ${customerData.id}`);
    doc.fontSize(14).text(`Reference No: ${customerData.referenceNo}`);
    doc.fontSize(14).text(`Customer Name: ${customerData.customerName}`);
    doc.fontSize(14).text(`Status: ${customerData.status}`);
    doc.fontSize(14).text(`Items Count: ${customerData.itemsCount}`);
    doc
      .fontSize(14)
      .text(
        `Created Date: ${new Date(customerData.createdDate).toLocaleString()}`
      );

    doc.moveDown();
    doc
      .fontSize(12)
      .text('This is an automatically generated report for the customer.', {
        align: 'center',
      });

    // Finalize the PDF
    doc.end();
  });
}
