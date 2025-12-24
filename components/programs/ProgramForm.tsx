'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/lib/api';
import { Program, University } from '@/lib/types';

const programSchema = z.object({
    university_id: z.string().uuid('Please select a university'),
    name: z.string().min(1, 'Name is required'),
    degree_type: z.string().optional(),
    degree_name: z.string().optional(),
    major_categories: z.array(z.string()).optional(),
    duration_months: z.coerce.number().int().optional(),
    delivery_mode: z.string().optional(),
    language: z.string().optional(),
    scholarship_available: z.boolean().default(false),
    scholarship_notes: z.string().optional(),
    application_fee_usd: z.coerce.number().optional(),
    admissions_url: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    program_url: z.string().url().optional().or(z.literal('')),
});

type ProgramFormValues = z.infer<typeof programSchema>;

type ProgramFormProps = {
    initialData?: Program | null;
    onSuccess: () => void;
};

export function ProgramForm({ initialData, onSuccess }: ProgramFormProps) {
    const queryClient = useQueryClient();

    const { data: universities } = useQuery<University[]>({
        queryKey: ['universities'],
        queryFn: async () => {
            const response = await api.get('/universities');
            return response.data;
        },
    });

    const form = useForm<ProgramFormValues>({
        resolver: zodResolver(programSchema),
        defaultValues: {
            university_id: initialData?.university_id || '',
            name: initialData?.name || '',
            degree_type: initialData?.degree_type || 'undergraduate',
            degree_name: initialData?.degree_name || '',
            major_categories: initialData?.major_categories || [],
            duration_months: initialData?.duration_months || 0,
            delivery_mode: initialData?.delivery_mode || 'on_campus',
            language: initialData?.language || 'English',
            scholarship_available: initialData?.scholarship_available || false,
            scholarship_notes: initialData?.scholarship_notes || '',
            application_fee_usd: initialData?.application_fee_usd || 0,
            admissions_url: initialData?.admissions_url || '',
            description: initialData?.description || '',
            program_url: initialData?.program_url || '',
        },
    });

    const mutation = useMutation({
        mutationFn: (values: ProgramFormValues) => {
            if (initialData) {
                return api.put(`/programs/${initialData.id}`, values);
            }
            return api.post('/programs', values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            toast.success(initialData ? 'Program updated' : 'Program created');
            onSuccess();
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Operation failed');
        },
    });

    const universityId = useWatch({
        control: form.control,
        name: 'university_id'
    });
    const selectedUniversity = universities?.find((u) => u.id === universityId);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6 pb-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="university_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>University</FormLabel>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start bg-neutral-800 border-neutral-700">
                                            {selectedUniversity?.name || 'Select a university'}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-72 bg-neutral-900 border-neutral-800 text-white max-h-60 overflow-y-auto">
                                        {universities?.map((u) => (
                                            <DropdownMenuItem key={u.id} onClick={() => field.onChange(u.id)}>
                                                {u.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Program Name</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="degree_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Degree Type</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. masters, undergraduate" className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="degree_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Degree Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. Master of Science" className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="duration_months"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (Months)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Language</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="application_fee_usd"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>App Fee (USD)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="admissions_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Admissions URL</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="program_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Program URL</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="bg-neutral-800 border-neutral-700 min-h-[100px]" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                    <Button type="button" variant="outline" onClick={onSuccess} className="border-neutral-700 hover:bg-neutral-800">
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-white text-black hover:bg-neutral-200" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : initialData ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
