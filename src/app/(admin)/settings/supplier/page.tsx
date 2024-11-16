'use client';

import React from 'react';

import Link from 'next/link';

import { getAllSupplierInformation } from '@/services/supplier';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownIcon, PlusCircleIcon } from 'lucide-react';

import { SUPPLIER_QUERY_KEY } from '@/config/query-keys';

import { handleCustomerExport } from '@/lib/helper/export-customer';
import { handleSupplierExport } from '@/lib/helper/export-supplier';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import SupplierTable from '@/components/supplier/table';
import { Button } from '@/components/ui/button';

const SupplierRootPage = () => {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: SUPPLIER_QUERY_KEY,
    queryFn: getAllSupplierInformation,
  });

  if (isLoading && !isFetched) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <DashboardShell>
        <DashboardHeader text=" Manage your Suppilers" heading="Suppiler" />
        <div className="flex w-full justify-end gap-x-2">
          <Button
            onClick={() => {
              handleSupplierExport(data!);
            }}
          >
            <ArrowDownIcon />
            Export
          </Button>
          <Button>
            <PlusCircleIcon />
            <Link href="/settings/supplier/add">Add Supplier</Link>
          </Button>
        </div>
        <SupplierTable data={data} />
      </DashboardShell>
    </>
  );
};

export default SupplierRootPage;
