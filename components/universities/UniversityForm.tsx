'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import api from '@/lib/api';
import { University } from '@/lib/types';

const universitySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    name_local: z.string().optional(),
    website_url: z.string().url().optional().or(z.literal('')),
    logo_url: z.string().url().optional().or(z.literal('')),
    country: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    ranking_qs: z.coerce.number().int().optional(),
    ranking_times: z.coerce.number().int().optional(),
    ranking_national: z.coerce.number().int().optional(),
    type: z.string().optional(),
    primary_language: z.string().optional(),
    description: z.string().optional(),
});

type UniversityFormValues = z.infer<typeof universitySchema>;

type UniversityFormProps = {
    initialData?: University | null;
    onSuccess: () => void;
};

export function UniversityForm({ initialData, onSuccess }: UniversityFormProps) {
    const queryClient = useQueryClient();
    const form = useForm<UniversityFormValues>({
        resolver: zodResolver(universitySchema),
        defaultValues: {
            name: initialData?.name || '',
            name_local: initialData?.name_local || '',
            website_url: initialData?.website_url || '',
            logo_url: initialData?.logo_url || '',
            country: initialData?.country || '',
            city: initialData?.city || '',
            region: initialData?.region || '',
            ranking_qs: initialData?.ranking_qs || 0,
            ranking_times: initialData?.ranking_times || 0,
            ranking_national: initialData?.ranking_national || 0,
            type: initialData?.type || '',
            primary_language: initialData?.primary_language || '',
            description: initialData?.description || '',
        },
    });

    const mutation = useMutation({
        mutationFn: (values: UniversityFormValues) => {
            if (initialData) {
                return api.put(`/universities/${initialData.id}`, values);
            }
            return api.post('/universities', values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['universities'] });
            toast.success(initialData ? 'University updated' : 'University created');
            onSuccess();
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Operation failed');
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6 pb-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name_local"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Local Name</FormLabel>
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
                        name="website_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website URL</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="logo_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Logo URL</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. Public, Private" className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="ranking_qs"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>QS Ranking</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ranking_times"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Times Higher Ed</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="bg-neutral-800 border-neutral-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ranking_national"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>National Ranking</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="bg-neutral-800 border-neutral-700" />
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
