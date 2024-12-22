'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { getAllCustomerInformation } from '@/services/customer';
import { getAllPickListInformation } from '@/services/pick-list';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon, PlusCircleIcon } from 'lucide-react';

import { CUSTOMER_QUERY_KEY, PICKLIST_QUERY_KEY } from '@/config/query-keys';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { MultiSelectDropdown } from '@/components/MultiSelectDropDown/multiselectdropdown';
import PickListItemsTable from '@/components/picklist/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PickListRootPage() {
  const [filterText, setFilterText] = useState('');
  const [statusId, setStatusId] = useState<number[]>([]);
  const [customerId, setCustomerId] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const statusList = [
    {
      label: 'Pending',
      value: 1,
    },
    {
      label: 'InProgress ',
      value: 2,
    },
    {
      label: 'Completed',
      value: 3,
    },
  ];

  const { data, isLoading, refetch, isPending, isFetching } = useQuery({
    queryKey: PICKLIST_QUERY_KEY,
    queryFn: () =>
      getAllPickListInformation({
        filterText,
        filterParams: [
          { key: 'customerId', value: customerId },
          { key: 'statusId', value: statusId },
        ],
      }),
    // initialData: [],
    staleTime: 1000 * 60 * 5,
  });

  let { data: customers } = useQuery({
    queryKey: CUSTOMER_QUERY_KEY,
    queryFn: getAllCustomerInformation,
  });

  const handleFilterChange = () => {
    setOpenDropdown(null);
    setTimeout(() => refetch(), 0);
  };

  const handleFilterReset = () => {
    setFilterText('');
    setStatusId([]);
    setCustomerId([]);
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
        placeholder="Search by Reference No."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      {customers && customers?.length > 0 && (
        <MultiSelectDropdown
          label="Select Customer"
          options={customers?.map((cus) => ({
            label: cus.fullName,
            value: cus.id,
          }))}
          selectedOptions={customerId}
          setSelectedOptions={setCustomerId}
          isOpen={openDropdown === 'customer'}
          toggleOpen={() => handleDropdownToggle('customer')}
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
          text=" Manage your Production Sheet"
          heading="Production Sheet"
        />
        <div className="flex w-full justify-end gap-x-2">
          <Link href="/picklist/add">
            <Button>
              <PlusCircleIcon />
              Add New
            </Button>
          </Link>
        </div>
        <PickListItemsTable data={data} filterUI={filterUI} />
      </DashboardShell>
    </>
  );
}
