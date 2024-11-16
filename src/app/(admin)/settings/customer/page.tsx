'use client';

import React from 'react';

import Link from 'next/link';

import { getAllCustomerInformation } from '@/services/customer';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownIcon, Loader2Icon, PlusCircleIcon } from 'lucide-react';

import { CUSTOMER_QUERY_KEY } from '@/config/query-keys';

import { handleCustomerExport } from '@/lib/helper/export-customer';

import CustomerTable from '@/components/customer/table';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';

const CustomerRootPage = () => {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: CUSTOMER_QUERY_KEY,
    queryFn: getAllCustomerInformation,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <>
      <DashboardShell>
        <DashboardHeader text=" Manage your Customer" heading="Customer" />
        <div className="flex w-full justify-end gap-x-2">
          <Button
            onClick={() => {
              handleCustomerExport(data!);
            }}
          >
            <ArrowDownIcon />
            Export
          </Button>
          <Button>
            <PlusCircleIcon />
            <Link href="/settings/customer/add">Add Customer</Link>
          </Button>
        </div>
        <CustomerTable data={data} />
      </DashboardShell>
    </>
  );
};

export default CustomerRootPage;
