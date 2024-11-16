import * as XLSX from 'xlsx';

import { CustomerGetAllType } from '@/types/customer';

interface CustomerExcelRow {
  ID: number;
  'Full Name': string;
  Phone: string;
  Email: string;
  Note: string;
}

export const exportCustomersToExcel = (
  customers: CustomerGetAllType[]
): void => {
  try {
    // Transform the data into excel rows
    const excelRows: CustomerExcelRow[] = customers.map((customer) => ({
      ID: customer.id,
      'Full Name': customer.fullName,
      Phone: customer.phone,
      Email: customer.email,
      Note: customer.note,
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 8 }, // ID
      { wch: 30 }, // Full Name
      { wch: 15 }, // Phone
      { wch: 35 }, // Email
      { wch: 40 }, // Note
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    // Create filename with formatted date
    const fileName = `${currentDate}_customers.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

// Usage example with proper typing
export const handleCustomerExport = async (
  customers: CustomerGetAllType[]
): Promise<void> => {
  try {
    exportCustomersToExcel(customers);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};
