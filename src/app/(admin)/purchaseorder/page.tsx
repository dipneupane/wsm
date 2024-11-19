'use client';

import React from 'react';

import Link from 'next/link';

import { getAllPurchaseOrderInformation } from '@/services/purchase-order';
import { useQuery } from '@tanstack/react-query';
import { PlusCircleIcon } from 'lucide-react';

import { PURCHASEORDER_QUERY_KEY } from '@/config/query-keys';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import PurchaseOrderItemsTable from '@/components/purchaseorder/table';
import { Button } from '@/components/ui/button';

export default function Component() {
  const { data } = useQuery({
    queryKey: PURCHASEORDER_QUERY_KEY,
    queryFn: getAllPurchaseOrderInformation,
  });

  return (
    <>
      <DashboardShell>
        <DashboardHeader
          text=" Manage your PurchaseOrder"
          heading="PurchaseOrder"
        />
        <div className="flex w-full justify-end gap-x-2">
          <Link href="/purchaseorder/add">
            <Button>
              <PlusCircleIcon />
              Add Item
            </Button>
          </Link>
        </div>
        <PurchaseOrderItemsTable data={data} />
      </DashboardShell>
    </>
  );
}
