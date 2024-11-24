import { redirect } from 'next/navigation';

import { adminNavigationSiteMap } from '@/config/routes';

import { auth } from '@/lib/auth';

import DashBoardLayout from '@/components/dashboard/dashboard-layout';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await auth();

  if (!data?.user.role.includes('Admin')) {
    redirect('/login');
  }
  return (
    <SidebarProvider>
      <DashBoardLayout navItems={adminNavigationSiteMap}>
        {children}
      </DashBoardLayout>
    </SidebarProvider>
  );
}
