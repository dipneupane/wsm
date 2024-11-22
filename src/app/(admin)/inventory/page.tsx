'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { getAllCategories } from '@/services/categories';
import { getAllInventoryItems } from '@/services/inventory-item';
import { getAllSupplierInformation } from '@/services/supplier';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownIcon, Loader2Icon, PlusCircleIcon } from 'lucide-react';

import {
  CATEGORY_QUERY_KEY,
  INVENTORY_QUERY_KEY,
  SUPPLIER_QUERY_KEY,
} from '@/config/query-keys';

import { handleInventoryItemExport } from '@/lib/helper/export-inventory-items';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import InventoryItemsTable from '@/components/inventory/table';
import { MultiSelectDropdown } from '@/components/MultiSelectDropDown/multiselectdropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const InventoryRootPage = () => {
  const [filterText, setFilterText] = useState('');
  const [categoryId, setCategoryId] = useState<number[]>([]);
  const [supplierId, setSupplierId] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [INVENTORY_QUERY_KEY],
    queryFn: () =>
      getAllInventoryItems({
        filterText,
        filterParams: [
          { key: 'categoryId', value: categoryId },
          { key: 'supplierId', value: supplierId },
        ],
      }),
    initialData: [],
  });

  let { data: categories } = useQuery({
    queryKey: CATEGORY_QUERY_KEY,
    queryFn: getAllCategories,
  });

  let { data: suppliers } = useQuery({
    queryKey: SUPPLIER_QUERY_KEY,
    queryFn: getAllSupplierInformation,
  });

  useEffect(() => {
    if ((filterText || categoryId || supplierId) && openDropdown == null) {
      refetch();
    }
  }, [filterText, categoryId, supplierId, openDropdown]);

  const [isExporting, setIsExporting] = useState(false);

  const handleItemExport = async (data: any) => {
    setIsExporting(true);
    await handleInventoryItemExport(data);
    setIsExporting(false);
  };

  const handleFilterChange = () => {
    setOpenDropdown(null);
  };

  const handleFilterReset = () => {
    setFilterText('');
    setCategoryId([]);
    setSupplierId([]);
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filterUI = (
    <div className="mb-4 flex flex-wrap gap-4 lg:flex-nowrap">
      <Input
        placeholder="Search by Code or Description"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      {categories && categories?.length > 0 && (
        <MultiSelectDropdown
          label="Select Categories"
          options={categories?.map((cat) => ({
            label: cat.value,
            value: cat.key,
          }))}
          selectedOptions={categoryId}
          setSelectedOptions={setCategoryId}
          isOpen={openDropdown === 'category'}
          toggleOpen={() => handleDropdownToggle('category')}
        />
      )}
      {suppliers && suppliers?.length > 0 && (
        <MultiSelectDropdown
          label="Select Suppliers"
          options={suppliers?.map((sup) => ({
            label: sup.fullName,
            value: sup.id,
          }))}
          selectedOptions={supplierId}
          setSelectedOptions={setSupplierId}
          isOpen={openDropdown === 'supplier'}
          toggleOpen={() => handleDropdownToggle('supplier')}
        />
      )}
      <Button type="button" onClick={handleFilterChange}>
        Apply Filters
      </Button>
      <Button
        type="button"
        className="bg-red-500 text-white hover:bg-red-400"
        onClick={handleFilterReset}
      >
        Reset
      </Button>
    </div>
  );

  return (
    <DashboardShell>
      <DashboardHeader text="Manage your Inventory Item" heading="Inventory" />

      <div className="flex w-full justify-end gap-x-2">
        <Button onClick={() => handleItemExport(data!)} disabled={isExporting}>
          {isExporting ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowDownIcon />
          )}
          Export
        </Button>
        <Link href="/inventory/add">
          <Button>
            <PlusCircleIcon />
            Add New
          </Button>
        </Link>
      </div>
      <InventoryItemsTable data={data} filterUI={filterUI} />
    </DashboardShell>
  );
};

export default InventoryRootPage;
