'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronRight } from 'lucide-react';

import { SideBarSiteMap } from '@/config/routes';

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { DoorSetsLogo } from '../../../public/images';
import { Icons } from '../icons/icon';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { BreadCrumbsTrail } from './beardcrumb-trail';
import UserProfileBox from './user-profile-box';

export default function AppSidebar({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems: SideBarSiteMap[];
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
              {navItems.map((route) => {
                const Icon = Icons[route.icon];
                return route.visible && !route.subPath ? (
                  <SidebarMenuItem key={route.name}>
                    <Link
                      className={`${pathname.startsWith(route.path) ? 'text-primary' : ''}`}
                      href={route.path}
                    >
                      <SidebarMenuButton>
                        <Icon className="h-5 w-5" />
                        <span>{route.name}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ) : (
                  <Collapsible key={route.name} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`${pathname.startsWith(route.path) ? 'text-primary' : ''}`}
                        >
                          <Link href={route.path}>
                            <Icon className="h-5 w-5" />
                          </Link>
                          <span>{route.name}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {route.subPath?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.name}>
                              <SidebarMenuSubButton
                                className={`${pathname.startsWith(subItem.path) ? 'text-primary' : ''}`}
                                asChild
                              >
                                <Link href={subItem.path}>{subItem.name}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
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
