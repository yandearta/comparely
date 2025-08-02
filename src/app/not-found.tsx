import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
    title: 'Halaman Tidak Ditemukan',
    description: 'Halaman yang kamu cari tidak ditemukan.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <FileQuestion className="size-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">404</h1>
                        <h2 className="text-xl font-semibold text-destructive">Halaman Tidak Ditemukan</h2>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Halaman yang kamu cari tidak ada atau telah dipindahkan.
                    </p>
                    <div className="flex justify-center">
                        <Button asChild size="sm">
                            <Link href="/">
                                <Home />
                                Ke Beranda
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
