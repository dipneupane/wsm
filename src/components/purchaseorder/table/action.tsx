'use client';

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { clonePurchaseOrderById } from '@/services/purchase-order';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';

import { PurchaseOrderGetAllType } from '@/types/purchase-order';

import { PURCHASEORDER_QUERY_KEY } from '@/config/query-keys';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ICellComponentProps {
  row: Row<PurchaseOrderGetAllType>;
}

export default function ActionCellComponent({ row }: ICellComponentProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: clonePurchaseOrderById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PURCHASEORDER_QUERY_KEY,
      });
      toast.success('Purchase order cloned successfully');
      router.push('/purchaseorder');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDuplicate = async (id: number) => {
    mutation.mutateAsync(id);
  };

  const ConfirmCloneDialog = () => {
    return (
      <Dialog>
        <DialogTrigger>Clone </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are You absolutely sure you want to clone this PO?
            </DialogTitle>
            <Button
              className="my-6 ms-auto w-fit cursor-pointer"
              onClick={() => handleDuplicate(row.original.id)}
            >
              Clone
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon
            data-testid="open-invite-action-cell-btn-direction"
            className="h-4 w-4"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link className="w-full" href={`/purchaseorder/${row.original.id}`}>
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="w-full"
            href={`/purchaseorder/${row.original.id}/edit`}
          >
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
          <ConfirmCloneDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
