'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { getAllPurchaseOrderInformation } from '@/services/purchase-order';
import { getAllSupplierInformation } from '@/services/supplier';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon, PlusCircleIcon } from 'lucide-react';

import {
  PURCHASEORDER_QUERY_KEY,
  SUPPLIER_QUERY_KEY,
} from '@/config/query-keys';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { MultiSelectDropdown } from '@/components/MultiSelectDropDown/multiselectdropdown';
import PurchaseOrderItemsTable from '@/components/purchaseorder/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Component() {
  const [filterText, setFilterText] = useState('');
  const [statusId, setStatusId] = useState<number[]>([]);
  const [supplierId, setSupplierId] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const statusList = [
    {
      label: 'Draft',
      value: 1,
    },
    {
      label: 'Ordered ',
      value: 2,
    },
    {
      label: 'Received',
      value: 3,
    },
  ];
  const { data, isLoading, refetch, isPending, isFetching } = useQuery({
    queryKey: PURCHASEORDER_QUERY_KEY,
    queryFn: () =>
      getAllPurchaseOrderInformation({
        filterText,
        filterParams: [
          { key: 'statusId', value: statusId },
          { key: 'supplierId', value: supplierId },
        ],
      }),
    // initialData: [],
    staleTime: 1000 * 60 * 5,
  });
  let { data: suppliers } = useQuery({
    queryKey: SUPPLIER_QUERY_KEY,
    queryFn: getAllSupplierInformation,
  });

  const handleFilterChange = () => {
    setOpenDropdown(null);
    setTimeout(() => refetch(), 0);
  };

  const handleFilterReset = () => {
    setFilterText('');
    setStatusId([]);
    setSupplierId([]);
    setOpenDropdown(null);
    setTimeout(() => refetch(), 0);
  };

  const handleDropdownToggle = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  if (isLoading || isPending || isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filterUI = (
    <div className="mb-4 flex flex-wrap gap-4 lg:flex-nowrap">
      <Input
        placeholder="Search by PO Number"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

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
      {statusList && statusList?.length > 0 && (
        <MultiSelectDropdown
          label="Select Status"
          options={statusList?.map((stat) => ({
            label: stat.label,
            value: stat.value,
          }))}
          selectedOptions={statusId}
          setSelectedOptions={setStatusId}
          isOpen={openDropdown === 'statusId'}
          toggleOpen={() => handleDropdownToggle('statusId')}
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
    <>
      <DashboardShell>
        <DashboardHeader
          text=" Manage your Purchase Orders"
          heading="Purchase Order"
        />
        <div className="flex w-full justify-end gap-x-2">
          <Link href="/purchaseorder/add">
            <Button>
              <PlusCircleIcon />
              Add Item
            </Button>
          </Link>
        </div>
        <PurchaseOrderItemsTable data={data} filterUI={filterUI} />
      </DashboardShell>
    </>
  );
}
