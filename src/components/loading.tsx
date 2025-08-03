import { Card, CardContent } from '@/components/ui/card';

export function LoadingSpinner({ message = 'Memuat...' }: { message?: string }) {
    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                <p className="text-muted-foreground">{message}</p>
            </CardContent>
        </Card>
    );
}

export function LoadingCard() {
    return (
        <Card className="animate-pulse">
            <CardContent className="py-6">
                <div className="space-y-3">
                    <div className="bg-muted h-4 w-3/4 rounded" />
                    <div className="bg-muted h-4 w-1/2 rounded" />
                    <div className="mt-4 flex gap-2">
                        <div className="bg-muted h-8 w-20 rounded" />
                        <div className="bg-muted h-8 w-20 rounded" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
