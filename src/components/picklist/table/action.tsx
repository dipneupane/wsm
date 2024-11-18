'use client';

import React from 'react';

import Link from 'next/link';

import { downloadPickListProductionSheet } from '@/services/pick-list';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { PickListGetAllType } from '@/types/pick-list';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ICellComponentProps {
  row: Row<PickListGetAllType>;
}

export default function ActionCellComponent({ row }: ICellComponentProps) {
  const generatePDF = async (pickListID: number) => {
    try {
      const { blob, filename } =
        await downloadPickListProductionSheet(pickListID);
      // Create a Blob URL
      const blobUrl = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename); // Use the extracted filename
      document.body.appendChild(link);
      link.click();
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
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
          <Link href={"#"} className="w-full" onClick={() => generatePDF(row.original.id)}>
            Download
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="w-full" href={`/picklist/${row.original.id}`}>
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="w-full" href={`/picklist/${row.original.id}/edit`}>
            Edit
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
