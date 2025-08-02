import { type Metadata } from 'next';
import { Geist } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'Comparely — Biar Nggak Salah Pilih',
    description: 'Nggak perlu ribet mikir, bandingin satu-satu sampe nemu yang paling pas buat kamu.',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
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
