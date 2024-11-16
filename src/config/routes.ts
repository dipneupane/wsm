import { SiteMap } from '@/types';

export const navigationSiteMap: SiteMap = {
  admin: {
    rootUrl: '/',
    subPaths: {
      dashboard: {
        path: '/',
        icon: 'dashboard',
        visible: true,
      },
      inventory: {
        path: '/inventory',
        icon: 'inventory',
        visible: true,
      },
      assemblies: {
        path: '/assemblies',
        icon: 'assemblies',
        visible: true,
      },
      pickList: {
        path: '/picklist',
        icon: 'picklist',
        visible: true,
      },
      purchaseOrder: {
        path: '/purchaseorder',
        icon: 'order',
        visible: true,
      },
      settings: {
        path: '/settings',
        icon: 'settings',
        visible: true,
        children: {
          customers: {
            path: '/settings/customers',
            icon: 'users',
          },
          supplier: {
            path: '/settings/supplier',
            icon: 'moon',
          },
        },
      },
    },
  },
};
