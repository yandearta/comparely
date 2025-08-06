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
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="space-y-4 pt-6 text-center">
                    <div className="flex justify-center">
                        <AlertTriangle className="text-destructive size-12" />
                    </div>
                    <h2 className="text-xl font-semibold">Ada yang salah</h2>
                    <p className="text-muted-foreground text-sm">
                        Ada error nih yang nggak terduga. Coba lagi atau refresh halamannya.
                    </p>
                    {error && env.NODE_ENV === 'development' && (
                        <details className="bg-muted rounded p-3 text-left text-xs">
                            <summary className="mb-2 cursor-pointer font-medium">Detail Error</summary>
                            <pre className="overflow-auto whitespace-pre-wrap">{error.message}</pre>
                        </details>
                    )}
                    <div className="flex justify-center gap-2">
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
