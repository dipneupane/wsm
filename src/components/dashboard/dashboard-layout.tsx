import React from 'react';

import { RootPath } from '@/types';

import AppSidebar from '../sidebar/app-sidebar';

const DashBoardLayout = ({
  children,
  rootPath,
}: {
  children: React.ReactNode;
  rootPath: RootPath;
}) => {
  return <AppSidebar rootPath={rootPath}>{children}</AppSidebar>;
};

export default DashBoardLayout;
