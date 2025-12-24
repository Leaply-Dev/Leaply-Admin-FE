'use client';

import {
    School,
    GraduationCap,
    Users,
    Activity,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppSidebar } from '@/components/layout/Sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

const stats = [
    { title: 'Total Universities', value: '1,284', icon: School, trend: '+12% from last month', color: 'text-blue-500' },
    { title: 'Active Programs', value: '8,432', icon: GraduationCap, trend: '+5% from last month', color: 'text-purple-500' },
    { title: 'Total Users', value: '45,291', icon: Users, trend: '+18% from last month', color: 'text-green-500' },
    { title: 'Daily Applications', value: '154', icon: Activity, trend: '+24% from last month', color: 'text-orange-500' },
];

export default function DashboardPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-neutral-950">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-800 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Leaply Admin</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
                        <p className="text-neutral-400">Welcome back to the Leaply admin panel. Here&apos;s what&apos;s happening today.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <Card key={stat.title} className="bg-neutral-900 border-neutral-800">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-neutral-400">{stat.title}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <p className="text-xs text-neutral-500 mt-1">{stat.trend}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 bg-neutral-900 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Activity</CardTitle>
                                <CardDescription className="text-neutral-400">Latest updates across the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                                                <Activity className="w-4 h-4 text-neutral-400" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium text-white">New university added: MIT Vietnam Campus</p>
                                                <p className="text-xs text-neutral-500">2 hours ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3 bg-neutral-900 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-white">Upcoming Deadlines</CardTitle>
                                <CardDescription className="text-neutral-400">Priority program reviews</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <Calendar className="w-4 h-4 text-neutral-500" />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium text-white">Fall 2026 Admissions Open</p>
                                                <p className="text-xs text-neutral-500">Stanford University • Dec 30</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
