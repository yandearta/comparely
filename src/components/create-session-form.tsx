'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSessionActions } from '@/hooks/use-database';
import { processItemsFromText, sessionFormSchema } from '@/lib/validation';

export function CreateSessionForm() {
    const router = useRouter();
    const { createSession } = useSessionActions();

    const form = useForm<z.infer<typeof sessionFormSchema>>({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            title: '',
            itemsText: '',
        },
    });

    async function onSubmit(values: z.infer<typeof sessionFormSchema>) {
        const processedItems = processItemsFromText(values.itemsText);

        try {
            const session = await createSession(values.title.trim(), processedItems);
            form.reset();
            router.push(`/${session.slug}`);
            toast.success('Oke, udah siap! Yuk mulai bandingin.');
        } catch (error) {
            toast.error('Waduh, ada yang error nih');
            console.error('Failed to create session:', error);
        }
    }

    const exampleItems = `HP Baru
PC Gaming
PlayStation 5`;

    function handleLoadExample() {
        form.setValue('title', `Wishlist ${new Date().getFullYear()}`);
        form.setValue('itemsText', exampleItems);
    }

    return (
        <Card className="mx-auto max-w-xl">
            <CardHeader>
                <CardTitle>Bikin Sesi Baru</CardTitle>
                <CardDescription>Mau bandingin apa nih? Masukin aja item-itemnya di bawah.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Judul</FormLabel>
                                    <FormControl>
                                        <Input placeholder="contoh: Destinasi Liburan Terbaik" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="itemsText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yang Mau Dibandingin</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tulis setiap item di baris baru..."
                                            className="min-h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Tulis satu item per baris. Minimal 2 item buat mulai.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3">
                            <Button type="button" variant="outline" onClick={handleLoadExample} className="flex-1">
                                Muat Contoh
                            </Button>
                            <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Bentar...' : 'Yuk Mulai!'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
