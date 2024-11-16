'use client';

import React from 'react';

import Link from 'next/link';

import { deleteSupplier } from '@/services/supplier';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';

import { SupplierGetByIDType } from '@/types/supplier';

import { SUPPLIER_QUERY_KEY } from '@/config/query-keys';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
  row: Row<SupplierGetByIDType>;
}

export default function ActionCellComponent({ row }: ICellComponentProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      toast.success('Item deleted successfully');
      queryClient.invalidateQueries({ queryKey: SUPPLIER_QUERY_KEY });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const handleItemDelete = () => {
    mutation.mutate(row.original.id);
  };

  return (
    <Dialog>
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
            <Link
              className="w-full"
              href={`/settings/supplier/${row.original.id}`}
            >
              Edit
            </Link>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure that you want to delete this item?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleItemDelete} variant={'destructive'}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
