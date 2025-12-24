'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { ProgramForm } from '@/components/programs/ProgramForm';
import { Program } from '@/lib/types';
import { Suspense } from 'react';

function ProgramsContent() {
    const searchParams = useSearchParams();
    const universityId = searchParams.get('universityId');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const queryClient = useQueryClient();

    const { data: programs, isLoading } = useQuery<Program[]>({
        queryKey: ['programs', universityId],
        queryFn: async () => {
            const response = await api.get('/programs', { params: { universityId } });
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/programs/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            toast.success('Program deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete program');
        },
    });

    const filteredPrograms = programs?.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.university?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (program: Program) => {
        setEditingProgram(program);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingProgram(null);
        setIsFormOpen(true);
    };

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
                                    <BreadcrumbPage>Programs</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <Button onClick={handleCreate} className="bg-white text-black hover:bg-neutral-200">
                        <Plus className="w-4 h-4 mr-2" /> Add Program
                    </Button>
                </header>

                <main className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                            <Input
                                placeholder="Search programs..."
                                className="pl-10 bg-neutral-900 border-neutral-800 focus:ring-1 focus:ring-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {universityId && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.history.pushState({}, '', '/programs')}
                                className="border-neutral-800 text-neutral-400 hover:text-white"
                            >
                                Clear Filter
                            </Button>
                        )}
                    </div>

                    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-neutral-800/50">
                                <TableRow className="border-neutral-800 hover:bg-transparent">
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-left">Program Name</TableHead>
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-left">University</TableHead>
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-left">Degree</TableHead>
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-left">Duration</TableHead>
                                    <TableHead className="text-neutral-400 font-semibold px-6 py-4 text-right w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-neutral-800">
                                            <TableCell colSpan={5} className="px-6 py-4">
                                                <Skeleton className="h-6 w-full bg-neutral-800" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredPrograms?.length === 0 ? (
                                    <TableRow className="border-neutral-800">
                                        <TableCell colSpan={5} className="h-32 text-center text-neutral-500">
                                            No programs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPrograms?.map((p) => (
                                        <TableRow key={p.id} className="border-neutral-800 hover:bg-neutral-800/30 transition-colors group">
                                            <TableCell className="px-6 py-4 font-medium text-white group-hover:text-purple-400 transition-colors">
                                                {p.name}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-neutral-400">
                                                {p.university?.name}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-neutral-400 capitalize">
                                                {p.degree_type?.replace('_', ' ') || 'N/A'}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-neutral-400">
                                                {p.duration_months ? `${p.duration_months} mo` : '-'}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-500 hover:text-white hover:bg-neutral-800">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-white">
                                                        <DropdownMenuItem onClick={() => handleEdit(p)} className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-400 focus:text-red-400 cursor-pointer"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this program?')) {
                                                                    deleteMutation.mutate(p.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </main>

                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="max-w-3xl bg-neutral-900 border-neutral-800 text-white overflow-hidden max-h-[90vh] flex flex-col p-0">
                        <DialogHeader className="p-6 border-b border-neutral-800">
                            <DialogTitle className="text-2xl font-bold tracking-tight">
                                {editingProgram ? 'Update Program' : 'Add New Program'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto p-6">
                            <ProgramForm
                                initialData={editingProgram}
                                onSuccess={() => setIsFormOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function ProgramsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-neutral-950 text-white">
                <Skeleton className="h-12 w-64 bg-neutral-900" />
            </div>
        }>
            <ProgramsContent />
        </Suspense>
    );
}
