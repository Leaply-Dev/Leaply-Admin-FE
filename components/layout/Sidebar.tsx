'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    School,
    GraduationCap,
    Users,
    LogOut,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent
} from '@/components/ui/sidebar';

const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { title: 'Universities', icon: School, href: '/universities' },
    { title: 'Programs', icon: GraduationCap, href: '/programs' },
    { title: 'Users', icon: Users, href: '/users' },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <Sidebar className="border-r border-neutral-800 bg-neutral-950">
            <SidebarHeader className="h-16 flex items-center px-6 border-b border-neutral-800">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black">L</div>
                    <span>Leaply</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                                    isActive
                                                        ? "bg-neutral-800 text-white shadow-sm"
                                                        : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                                )}
                                            >
                                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral-500")} />
                                                <span className="font-medium">{item.title}</span>
                                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-neutral-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-neutral-400 hover:text-red-400 hover:bg-neutral-900 gap-3"
                    onClick={logout}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
