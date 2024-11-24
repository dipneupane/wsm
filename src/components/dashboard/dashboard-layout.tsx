import React from 'react';

import { RootPath } from '@/types';

import AppSidebar from '../sidebar/app-sidebar';

const DashBoardLayout = ({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems: any;
}) => {
  return <AppSidebar navItems={navItems}>{children}</AppSidebar>;
};

export default DashBoardLayout;
