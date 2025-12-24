'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserX, ShieldCheck, Mail } from 'lucide-react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AppSidebar } from '@/components/layout/Sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import api from '@/lib/api';
import { User } from '@/lib/types';

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/users/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete user');
        },
    });

    const filteredUsers = users?.filter((u) =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-neutral-950 text-white">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-800 px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">Leaply Admin</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>User Management</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <main className="p-6 space-y-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Active Users</h1>
                        <p className="text-neutral-400 text-sm">Review and manage student accounts on the platform.</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                            <Input
                                placeholder="Search by email..."
                                className="pl-10 bg-neutral-900 border-neutral-800 focus:ring-1 focus:ring-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-neutral-800/50">
                                <TableRow className="border-neutral-800 hover:bg-transparent">
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-left">Email Address</TableHead>
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-left">Status</TableHead>
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-left">Joined Date</TableHead>
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-right w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-neutral-800">
                                            <TableCell colSpan={4} className="px-6 py-4">
                                                <Skeleton className="h-6 w-full bg-neutral-800" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredUsers?.length === 0 ? (
                                    <TableRow className="border-neutral-800">
                                        <TableCell colSpan={4} className="h-32 text-center text-neutral-500">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers?.map((u) => (
                                        <TableRow key={u.id} className="border-neutral-800 hover:bg-neutral-800/30 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-neutral-500" />
                                                    <span className="font-medium text-white">{u.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                {u.email_verified ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                        <ShieldCheck className="w-3 h-3" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
                                                        Pending
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-neutral-400 text-sm">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-neutral-500 hover:text-red-400 hover:bg-red-400/10"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this user? This action is irreversible.')) {
                                                            deleteMutation.mutate(u.id);
                                                        }
                                                    }}
                                                >
                                                    <UserX className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
