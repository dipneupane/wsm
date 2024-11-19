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
import { ArrowDownIcon, MoveDown, Search } from 'lucide-react';

import { InventoryItemsGetAllType } from '@/types/inventory-items';

import { handleInventoryItemExport } from '@/lib/helper/export-inventory-items';

import DataTablePagination from '@/components/generic-table/data-table-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
}

export default function InventoryItemsTable({ data }: IUsersTableProps) {
  return (
    <DataTable<InventoryItemsGetAllType>
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
}
function DataTable<T>({
  data,
  columns,
  searchFields,
}: GenericTableProps<InventoryItemsGetAllType>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (selectedField) {
      setColumnFilters([
        {
          id: selectedField,
          value: value,
        },
      ]);
    }
  };

  const handleFieldChange = (field: string) => {
    setSelectedField(field);
    setSearchValue('');
    setColumnFilters([]);
  };

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <div className="mx-auto flex w-full flex-col space-y-4">
      <Button
        className="w-fit"
        onClick={() =>
          handleInventoryItemExport(
            table.getFilteredRowModel().rows.map((row) => row.original)
          )
        }
      >
        <ArrowDownIcon />
        Export the Filtered Data
      </Button>
      {searchFields && (
        <div className="flex items-center gap-2">
          <Select value={selectedField} onValueChange={handleFieldChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {searchFields.map((field) => (
                <SelectItem
                  key={String(field.column)}
                  value={String(field.column)}
                >
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                selectedField
                  ? `Search by ${searchFields.find((f) => String(f.column) === selectedField)?.label}...`
                  : 'Select a field first...'
              }
              value={searchValue}
              onChange={(event) => handleSearch(event.target.value)}
              className="pl-8"
              disabled={!selectedField}
            />
          </div>
        </div>
      )}

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
                  className={`border-black dark:border-white ${row.original.stock <= row.original.minStockQuantity ? 'bg-red-300/60 hover:bg-red-300/30 dark:bg-red-600' : ''} `}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
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
