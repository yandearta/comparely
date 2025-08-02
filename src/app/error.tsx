'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { env } from '@/env';

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('Error caught by error boundary:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <AlertTriangle className="size-12 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold">Ada yang salah</h2>
                    <p className="text-muted-foreground text-sm">
                        Terjadi error yang tidak terduga. Coba lagi atau refresh halaman.
                    </p>
                    {error && env.NODE_ENV === 'development' && (
                        <details className="text-left bg-muted p-3 rounded text-xs">
                            <summary className="cursor-pointer font-medium mb-2">Detail Error</summary>
                            <pre className="overflow-auto whitespace-pre-wrap">{error.message}</pre>
                        </details>
                    )}
                    <div className="flex gap-2 justify-center">
                        <Button onClick={reset} variant="outline" size="sm">
                            <RefreshCw />
                            Coba Lagi
                        </Button>
                        <Button onClick={() => (window.location.href = '/')} size="sm">
                            Ke Beranda
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
