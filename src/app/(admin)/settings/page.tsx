'use client';

import React from 'react';

import Link from 'next/link';

import { TruckIcon, UsersIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SettingsRootPage = () => {
  return (
    <>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Settings</CardTitle>
            <CardDescription>
              Manage your suppliers and customers
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-x-2">
            <Link href="/settings/supplier" passHref>
              <Button className="w-fit justify-start" variant="outline">
                <TruckIcon className="mr-2 h-4 w-4" />
                Manage Supplier
              </Button>
            </Link>
            <Link href="/settings/customer" passHref>
              <Button className="w-fit justify-start" variant="outline">
                <UsersIcon className="mr-2 h-4 w-4" />
                Manage Customer
              </Button>
            </Link>
          </CardContent>
        </div>
      </div>
    </>
  );
};

export default SettingsRootPage;
