'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lightbulb } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSessionActions } from '@/hooks/use-database';
import type { VotingSession } from '@/lib/db';
import { processItemsFromText, sessionFormSchema } from '@/lib/validation';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type EditSessionFormProps = {
    session: VotingSession;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function EditSessionForm({ session, onSuccess, onCancel }: EditSessionFormProps) {
    const { updateSession } = useSessionActions();

    const form = useForm<z.infer<typeof sessionFormSchema>>({
        resolver: zodResolver(sessionFormSchema),
        defaultValues: {
            title: session.title,
            itemsText: session.items.join('\n'),
        },
    });

    async function onSubmit(values: z.infer<typeof sessionFormSchema>) {
        const processedItems = processItemsFromText(values.itemsText);

        if (!session.id) {
            toast.error('ID sesi nggak valid');
            return;
        }

        // Check if items have changed
        const itemsChanged =
            processedItems.length !== session.items.length ||
            processedItems.some((item, index) => item !== session.items[index]);

        try {
            await updateSession(session.id, {
                title: values.title.trim(),
                items: processedItems,
            });

            if (itemsChanged) {
                toast.success('Sip, udah diupdate! Voting bakal mulai dari awal lagi ya.');
            } else {
                toast.success('Sip, udah diupdate!');
            }
            onSuccess?.();
        } catch (error) {
            toast.error('Gagal mengupdate sesi');
            console.error('Failed to update session:', error);
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit Sesi</DialogTitle>
                <DialogDescription>Ubah judul dan item yang akan dibandingkan dalam sesi ini.</DialogDescription>
            </DialogHeader>

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
                                        className="min-h-32 max-h-40"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Tulis satu item per baris. Minimal 2 item buat mulai.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Alert variant="destructive">
                        <Lightbulb />
                        <AlertTitle>Hati-hati!</AlertTitle>
                        <AlertDescription>
                            Kalau ubah item, semua voting bakal di-reset dan mulai dari awal.
                        </AlertDescription>
                    </Alert>

                    <DialogFooter>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Batal
                            </Button>
                        )}
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
}
