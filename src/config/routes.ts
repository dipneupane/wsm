import { Icons } from '@/components/icons/icon';

export interface SideBarSiteMap {
  name: string;
  path: string;
  icon: keyof typeof Icons;
  visible: boolean;
  subPath?: {
    name: string;
    path: string;
  }[];
}
export const adminNavigationSiteMap: SideBarSiteMap[] = [
  {
    name: 'Inventory',
    path: '/inventory',
    icon: 'inventory',
    visible: true,
  },
  {
    name: 'Assemblies',
    path: '/assemblies',
    icon: 'assemblies',
    visible: true,
  },
  {
    name: 'Pick List',
    path: '/picklist',
    icon: 'picklist',
    visible: true,
  },
  {
    name: 'Purchase Order',
    path: '/purchaseorder',
    icon: 'order',
    visible: true,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'settings',
    visible: true,
    subPath: [
      {
        name: 'Customers',
        path: '/settings/customer',
      },
      {
        name: 'Supplier',
        path: '/settings/supplier',
      },
    ],
  },
];
