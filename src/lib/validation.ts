import { z } from 'zod';

// Helper function to process items from text
export function processItemsFromText(itemsText: string): string[] {
    return itemsText
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

// Shared form schema for sessions with comprehensive validation
export const sessionFormSchema = z.object({
    title: z
        .string()
        .min(1, 'Judul sesi harus diisi')
        .min(3, 'Judul sesi minimal 3 karakter')
        .max(100, 'Judul sesi maksimal 100 karakter'),
    itemsText: z
        .string()
        .min(1, 'Item harus diisi')
        .refine((value) => {
            const items = processItemsFromText(value);
            return items.length >= 2;
        }, 'Minimal 2 item untuk dibandingkan')
        .refine((value) => {
            const items = processItemsFromText(value);
            const uniqueItems = new Set(items);
            return uniqueItems.size === items.length;
        }, 'Semua item harus unik, tidak boleh ada yang sama'),
});
