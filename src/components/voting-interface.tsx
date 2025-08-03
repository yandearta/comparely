'use client';

import { ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNextComparison, useSessionBySlug, useSessionProgress, useVotingActions } from '@/hooks/use-database';

type VotingInterfaceProps = {
    slug: string;
};

export function VotingInterface({ slug }: VotingInterfaceProps) {
    const session = useSessionBySlug(slug);
    const sessionId = session?.id ?? null;
    const nextComparison = useNextComparison(sessionId);
    const progress = useSessionProgress(sessionId);
    const { submitVote, undoLastVote } = useVotingActions();
    const router = useRouter();

    const [showCompletionMessage, setShowCompletionMessage] = useState(false);

    const handleVote = useCallback(
        async (winner: string) => {
            if (!nextComparison?.id) return;

            await submitVote(nextComparison.id, winner);
            toast.success('Sip, udah dipilih!');
        },
        [nextComparison, submitVote],
    );

    const handleUndo = useCallback(async () => {
        if (!sessionId) return;

        await undoLastVote(sessionId);
        toast.success('Oke, udah di-undo!');
    }, [sessionId, undoLastVote]);

    // Reset completion message when there's a new comparison available
    useEffect(() => {
        if (nextComparison && showCompletionMessage) {
            setShowCompletionMessage(false);
        }
    }, [nextComparison, showCompletionMessage]);

    // Keyboard navigation
    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (!nextComparison) return;

            if (event.key === '1' || event.key === 'ArrowLeft') {
                event.preventDefault();
                void handleVote(nextComparison.itemA);
            } else if (event.key === '2' || event.key === 'ArrowRight') {
                event.preventDefault();
                void handleVote(nextComparison.itemB);
            } else if (event.key === 'u' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                void handleUndo();
            }
        }

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [nextComparison, handleVote, handleUndo]);

    // Show completion message when voting is done
    useEffect(() => {
        // Only trigger completion flow if:
        // 1. There's no next comparison available
        // 2. Session exists and is marked as completed
        // 3. Progress shows work has been done (total > 0 and completed equals total)
        // 4. We haven't already shown the completion message
        if (
            !nextComparison &&
            session &&
            session.isCompleted &&
            progress &&
            progress.total > 0 &&
            progress.completed === progress.total &&
            !showCompletionMessage
        ) {
            setShowCompletionMessage(true);
            toast.success('🎉 Selesai! Yuk liat hasilnya.');
            setTimeout(() => router.push(`/${slug}`), 2000);
        }
    }, [nextComparison, session, progress, showCompletionMessage, sessionId, router, slug]);

    // Loading state
    if (session === undefined || progress === undefined) {
        return (
            <div className="mx-auto w-full max-w-4xl">
                <LoadingSpinner message="Memuat..." />
            </div>
        );
    }

    if (!session) {
        return (
            <Card className="mx-auto w-full max-w-2xl">
                <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Eh, nggak ketemu</h3>
                        <p className="text-muted-foreground">Sesi yang kamu cari nggak ada nih.</p>
                        <Button className="mt-4" asChild>
                            <Link href="/">Balik ke Beranda</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (showCompletionMessage) {
        return (
            <Card className="mx-auto w-full max-w-2xl">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                    <h2 className="mb-2 text-2xl font-semibold">Voting Selesai!</h2>
                    <p className="text-muted-foreground mb-4">
                        Semua perbandingan sudah selesai. Mengarahkan ke halaman hasil...
                    </p>
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                </CardContent>
            </Card>
        );
    }

    if (!nextComparison) {
        return (
            <Card className="mx-auto w-full max-w-2xl">
                <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Udah selesai!</h3>
                        <p className="text-muted-foreground">Nggak ada lagi yang perlu dibandingin.</p>
                        <div className="mt-4 flex justify-center gap-2">
                            <Button asChild>
                                <Link href={`/${slug}`}>Liat Hasil</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/">Balik ke Beranda</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/">
                                <ArrowLeft />
                                Balik ke Beranda
                            </Link>
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUndo}
                        disabled={!progress || progress.completed === 0}
                    >
                        <RotateCcw />
                        Undo
                    </Button>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">{session.title}</h1>
                    <p className="text-muted-foreground">Pilih yang mana nih yang kamu lebih suka?</p>
                </div>
            </div>

            {/* Progress */}
            {progress && (
                <Card>
                    <CardContent className="py-4">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-muted-foreground text-sm">
                                {progress.completed} dari {progress.total}
                            </span>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                        <p className="text-muted-foreground mt-1 text-xs">{progress.percentage}% selesai</p>
                    </CardContent>
                </Card>
            )}

            {/* Voting Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline">Opsi A (1)</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="py-8 text-center">
                            <h2 className="mb-4 text-xl font-semibold">{nextComparison.itemA}</h2>
                            <Button
                                onClick={() => handleVote(nextComparison.itemA)}
                                className="w-full transition-transform group-hover:scale-105"
                                size="lg"
                                aria-label={`Choose ${nextComparison.itemA} (Press 1 or left arrow)`}
                            >
                                Pilih yang Ini
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline">Opsi B (2)</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="py-8 text-center">
                            <h2 className="mb-4 text-xl font-semibold">{nextComparison.itemB}</h2>
                            <Button
                                onClick={() => handleVote(nextComparison.itemB)}
                                className="w-full transition-transform group-hover:scale-105"
                                size="lg"
                                aria-label={`Choose ${nextComparison.itemB} (Press 2 or right arrow)`}
                            >
                                Pilih yang Ini
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Instructions */}
            <Card className="bg-muted/50">
                <CardContent className="py-4">
                    <div className="text-muted-foreground space-y-2 text-center text-sm">
                        <p>
                            💡 <strong>Tips:</strong> Pilih dengan hati-hati ya. Tapi kalau salah, bisa di-undo kok.
                        </p>
                        {/* Keyboard shortcuts - hide on mobile */}
                        <div className="hidden md:block">
                            <p className="flex items-center justify-center gap-4 text-xs">
                                <span>
                                    Tekan{' '}
                                    <kbd className="bg-background text-foreground rounded border px-1 py-0.5">1</kbd>{' '}
                                    atau{' '}
                                    <kbd className="bg-background text-foreground rounded border px-1 py-0.5">←</kbd>{' '}
                                    untuk Opsi A
                                </span>
                                <span>
                                    Tekan{' '}
                                    <kbd className="bg-background text-foreground rounded border px-1 py-0.5">2</kbd>{' '}
                                    atau{' '}
                                    <kbd className="bg-background text-foreground rounded border px-1 py-0.5">→</kbd>{' '}
                                    untuk Opsi B
                                </span>
                                <span>
                                    Tekan{' '}
                                    <kbd className="bg-background text-foreground rounded border px-1 py-0.5">
                                        Ctrl+U
                                    </kbd>{' '}
                                    untuk batalkan
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
