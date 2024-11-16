import * as XLSX from 'xlsx';

import { SupplierGetAllType } from '@/types/supplier';

interface SupplierExcelRow {
  ID: number;
  'Full Name': string;
  Phone: string;
  Email: string;
  Note: string;
}

export const exportSuppliersToExcel = (
  Suppliers: SupplierGetAllType[]
): void => {
  try {
    // Transform the data into excel rows
    const excelRows: SupplierExcelRow[] = Suppliers.map((Supplier) => ({
      ID: Supplier.id,
      'Full Name': Supplier.fullName,
      Phone: Supplier.phone,
      Email: Supplier.email,
      Note: Supplier.note,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers');

    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    // Create filename with formatted date
    const fileName = `${currentDate}_Suppliers.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

// Usage example with proper typing
export const handleSupplierExport = async (
  Suppliers: SupplierGetAllType[]
): Promise<void> => {
  try {
    exportSuppliersToExcel(Suppliers);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};
