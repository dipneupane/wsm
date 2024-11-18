'use client';

import { useState } from 'react';

import Link from 'next/link';

import { getAllInventoryItems } from '@/services/inventory-item';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownIcon, Loader2Icon, PlusCircleIcon } from 'lucide-react';

import { INVENTORY_QUERY_KEY } from '@/config/query-keys';

import { handleInventoryItemExport } from '@/lib/helper/export-inventory-items';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import InventoryItemsTable from '@/components/inventory/table';
import { Button } from '@/components/ui/button';

const InventoryRootPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: INVENTORY_QUERY_KEY,
    queryFn: getAllInventoryItems,
  });
  const [isExporting, setIsExporting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleItemExport = async (data: any) => {
    setIsExporting(true);
    await handleInventoryItemExport(data);
    setIsExporting(false);
  };

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
            Add Inventory Item
          </Button>
        </Link>
      </div>
      <InventoryItemsTable data={data} />
    </DashboardShell>
  );
};

export default InventoryRootPage;
