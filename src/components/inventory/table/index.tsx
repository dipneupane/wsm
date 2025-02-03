' use client';

import React, { useState } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { InventoryItemsGetAllType } from '@/types/inventory-items';

import DataTablePagination from '@/components/generic-table/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { columns } from './column';

interface IUsersTableProps {
  data: InventoryItemsGetAllType[] | any;
  filterUI?: React.ReactNode;
  onSelectedRowsChange: (rows: InventoryItemsGetAllType[] | []) => void;
}

export default function InventoryItemsTable({
  data,
  filterUI,
  onSelectedRowsChange,
}: IUsersTableProps) {
  return (
    <DataTable<InventoryItemsGetAllType>
      filterUI={filterUI}
      onSelectedRowsChange={onSelectedRowsChange}
      data={data}
      columns={columns}
      searchFields={[
        { column: 'code', label: 'Code' },
        { column: 'categoryName', label: 'CategoryName' },
        { column: 'supplierName', label: 'SuppilerName' },
      ]}
    />
  );
}

// table
interface SearchField<T> {
  column: keyof T;
  label: string;
}

interface GenericTableProps<InventoryItemsGetAllType> {
  data?: InventoryItemsGetAllType[];
  columns: ColumnDef<InventoryItemsGetAllType>[];
  searchFields?: SearchField<InventoryItemsGetAllType>[];
  filterUI?: React.ReactNode;
  onSelectedRowsChange: (rows: InventoryItemsGetAllType[] | []) => void;
}
function DataTable<T>({
  data,
  columns,
  filterUI,
  onSelectedRowsChange,
}: GenericTableProps<InventoryItemsGetAllType>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: async (newSelection) => {
      await setRowSelection(newSelection);
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);

      onSelectedRowsChange(selectedRows);
    },
    state: { columnFilters, sorting, rowSelection },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  return (
    <div className="mx-auto flex w-full flex-col space-y-4">
      {filterUI}
      <Table className="rounded-2xl border border-slate-400/60 dark:border-slate-400/20">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  className={`border-black dark:border-white ${row.original.stock <= row.original.safetyStockRequired ? 'bg-red-300/60 hover:bg-red-300/30 dark:bg-red-600' : ''} `}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell: any) => {
                    const cellValue = cell.getValue();
                    return (
                      <TableCell
                        className={`${isNaN(cellValue) ? 'text-left' : 'text-center'}`}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
