
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@/lib/types';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingBag,
  Users, 
  Lightbulb,
  Droplet, 
  Settings,
  FileText,
  PlusCircle,
  Building 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  user: User | null;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['administrator', 'sales_representative'] },
  { href: '/sales/new', label: 'New Order', icon: PlusCircle, roles: ['administrator', 'sales_representative'] }, 
  { href: '/sales/reports', label: 'Order Reports', icon: FileText, roles: ['administrator', 'sales_representative'] }, 
  { href: '/products', label: 'Products', icon: ShoppingBag, roles: ['administrator'] },
  { href: '/dispensaries', label: 'Dispensaries', icon: Building, roles: ['administrator'] }, 
  { href: '/insights', label: 'AI Insights', icon: Lightbulb, roles: ['administrator'] },
  // { href: '/users', label: 'User Management', icon: Users, roles: ['administrator'] },
  // { href: '/settings', label: 'Settings', icon: Settings, roles: ['administrator', 'sales_representative'] },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 p-2 text-lg font-semibold font-headline">
          <Droplet className="h-8 w-8 text-accent" /> 
          <span className="text-foreground group-data-[collapsible=icon]:hidden">
            Grams <span className="text-primary">&amp;</span> Gains
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                tooltip={item.label}
                className={cn(
                  (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
         <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden text-center">
            &copy; {new Date().getFullYear()}
        </p>
      </SidebarFooter>
    </>
  );
}
