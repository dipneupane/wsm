'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { RootPath } from '@/types';

import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { DoorSetsLogo } from '../../../public/images';
import { Icons } from '../icons/icon';
import { BreadCrumbsTrail } from './beardcrumb-trail';
import UserProfileBox from './user-profile-box';

export default function AppSidebar({
  children,
  rootPath,
}: {
  children: React.ReactNode;
  rootPath: RootPath;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* header seciton start */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="mx-auto py-4">
              <Image
                height={180}
                width={180}
                className="object-contain"
                src={DoorSetsLogo}
                alt="DoorSets Logo"
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        {/* header section end */}

        {/* main sidebar content start */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel> Admin Pannel</SidebarGroupLabel>
            <SidebarMenu>
              {Object.keys(rootPath.subPaths).map((key) => {
                const subPath = rootPath.subPaths[key].icon;
                const Icon =
                  Icons[subPath as keyof typeof Icons] || Icons['chevronRight'];

                return (
                  rootPath.subPaths[key].visible && (
                    <Link
                      key={key}
                      className={`flex items-center gap-x-2 ${rootPath.subPaths[key].path === pathname ? 'text-primary' : ''} `}
                      href={rootPath.subPaths[key].path}
                    >
                      <SidebarMenuButton key={key} tooltip={key}>
                        <Icon className="h-5 w-5" />
                        <span className="capitalize">{key}</span>
                      </SidebarMenuButton>
                    </Link>
                  )
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* end of sidebar contents */}

        {/* footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserProfileBox />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />

        {/* end of footer */}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-[10] flex h-16 shrink-0 items-center gap-2 bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadCrumbsTrail />
          </div>
        </header>
        <main className="min-h-[50vh] p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
