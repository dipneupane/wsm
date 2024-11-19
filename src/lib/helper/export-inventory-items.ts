import * as XLSX from 'xlsx';

import { InventoryItemsGetAllType } from '@/types/inventory-items';

interface InventoryExcelRow {
  'Item ID': number;
  'Item Code': string;
  Description: string;
  'Category ID': number;
  Category: string;
  'Supplier ID': number;
  Supplier: string;
  Cost: number;
  Stock: number;
}

export const exportInventoryToExcel = (
  inventoryItems: InventoryItemsGetAllType[]
): void => {
  try {
    // Transform the data into excel rows
    const excelRows: InventoryExcelRow[] = inventoryItems.map((item) => ({
      'Item ID': item.id,
      'Item Code': item.code,
      Description: item.description,
      'Category ID': item.categoryId,
      Category: item.categoryName,
      'Supplier ID': item.supplierId,
      Supplier: item.supplierName,
      Cost: item.cost,
      Stock: item.stock,
    }));

    // Calculate totals
    const totalStock = inventoryItems.reduce(
      (sum, item) => sum + item.stock,
      0
    );
    const totalCost = inventoryItems.reduce(
      (sum, item) => sum + item.cost * item.stock,
      0
    );

    const totalSupplierNumber = inventoryItems.length;

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 26 }, // Item ID
      { wch: 15 }, // Item Code
      { wch: 40 }, // Description
      { wch: 12 }, // Category ID
      { wch: 20 }, // Category
      { wch: 12 }, // Supplier ID
      { wch: 20 }, // Supplier
      { wch: 15 }, // Cost
      { wch: 10 }, // Stock
    ];
    worksheet['!cols'] = columnWidths;

    // Add empty row after data
    const rowCount = excelRows.length;

    // Prepare totals data with formatting
    const totalsData = [
      [{ v: 'Summary', t: 's' }],
      [
        { v: 'Total Stock:', t: 's' },
        { v: totalStock, t: 'n' },
      ],
      [
        { v: 'Total Inventory Value:', t: 's' },
        { v: totalCost, t: 'n', z: '$#,##0.00' },
      ],
      [
        { v: 'Total No of  Supplier:', t: 's' },
        { v: totalSupplierNumber, t: 'n' },
      ],
    ];

    // Add totals to worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: rowCount + 1 }); // Empty row
    XLSX.utils.sheet_add_aoa(
      worksheet,
      totalsData.map((row) => row.map((cell) => cell.v)),
      {
        origin: `A${rowCount + 2}`,
      }
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Items');

    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    // Create filename with current date
    const fileName = `${currentDate}_inventory.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

// Usage example with proper typing
export const handleInventoryItemExport = async (
  inventoryItems: InventoryItemsGetAllType[]
): Promise<void> => {
  try {
    console.log('Exporting inventory items:', inventoryItems);
    exportInventoryToExcel(inventoryItems);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};
