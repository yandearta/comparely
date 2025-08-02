import { Card, CardContent } from '@/components/ui/card';

export function LoadingSpinner({ message = 'Memuat...' }: { message?: string }) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4" />
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
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="flex gap-2 mt-4">
                        <div className="h-8 bg-muted rounded w-20" />
                        <div className="h-8 bg-muted rounded w-20" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
