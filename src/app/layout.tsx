import { type Metadata } from 'next';
import { Geist } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'Comparely — Biar Nggak Salah Pilih',
    description:
        'Kadang bingung milih karena kebanyakan pilihan? Bandingin pelan-pelan, satu lawan satu, biar nemu yang bener-bener cocok.',
};

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="id" className={cn('scroll-smooth', geist.variable)} data-scroll-behavior="smooth">
            <body>
                <Toaster theme="light" richColors />
                {children}
            </body>
        </html>
    );
}
