'use client';

import { ArrowLeft, Award, Copy, Medal, RotateCcw, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSessionActions, useSessionBySlug, useSessionResults } from '@/hooks/use-database';

type ResultsTableProps = {
    slug: string;
};

export function ResultsTable({ slug }: ResultsTableProps) {
    const session = useSessionBySlug(slug);
    const sessionId = session?.id ?? null;
    const results = useSessionResults(sessionId);
    const { duplicateSession, resetSession } = useSessionActions();
    const router = useRouter();

    if (!session) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Eh, nggak ketemu</h3>
                        <p className="text-muted-foreground">Sesi yang kamu cari nggak ada nih.</p>
                        <Button className="mt-4" asChild>
                            <Link href="/">Kembali ke Beranda</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    async function handleDuplicate() {
        if (!sessionId) {
            toast.error('ID sesi nggak valid');
            return;
        }
        const newSession = await duplicateSession(sessionId);
        toast.success('Sip, udah diduplikat! Yuk mulai lagi.');
        router.push(`/${newSession.slug}`);
    }

    async function handleReset() {
        if (!sessionId) {
            toast.error('ID sesi nggak valid');
            return;
        }
        await resetSession(sessionId);
        toast.success('Udah di-reset! Mulai dari awal yuk.');
        router.push(`/${slug}`);
    }

    function getRankIcon(index: number) {
        if (index === 0) return <Trophy className="size-5 text-yellow-500" />;
        if (index === 1) return <Medal className="size-5 text-gray-400" />;
        if (index === 2) return <Award className="size-5 text-amber-600" />;
        return null;
    }

    function getRankBadge(index: number) {
        if (index === 0) return <Badge className="bg-yellow-500 hover:bg-yellow-600">1st</Badge>;
        if (index === 1) return <Badge className="bg-gray-500 hover:bg-gray-600">2nd</Badge>;
        if (index === 2) return <Badge className="bg-amber-600 hover:bg-amber-700">3rd</Badge>;
        return <Badge variant="outline">{index + 1}th</Badge>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/">
                        <ArrowLeft />
                        Balik ke Beranda
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">{session.title}</h1>
                    <p className="text-muted-foreground">Hasil Akhir</p>
                </div>
            </div>

            {/* Winner Card */}
            {results && results.length > 0 && results[0] && (
                <Card className="border-2 border-yellow-200 bg-yellow-50/50">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {getRankIcon(0)}
                            <CardTitle className="text-2xl">Pemenang!</CardTitle>
                        </div>
                        <div className="text-4xl font-bold text-yellow-600 mb-2">{results[0].item}</div>
                        <div className="text-lg text-muted-foreground">
                            Win Rate: {results[0].winRate}% ({results[0].wins}/{results[0].appearances})
                        </div>
                    </CardHeader>
                </Card>
            )}

            {/* Results Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Ranking Lengkap</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Ranking</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Menang</TableHead>
                                <TableHead className="text-center">Total</TableHead>
                                <TableHead className="text-center">Win Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results?.map((result, index) => (
                                <TableRow key={result.item} className={index < 3 ? 'bg-muted/20' : ''}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getRankIcon(index)}
                                            {getRankBadge(index)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{result.item}</TableCell>
                                    <TableCell className="text-center font-mono">{result.wins}</TableCell>
                                    <TableCell className="text-center font-mono">{result.appearances}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="font-mono font-semibold">{result.winRate}%</span>
                                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-300"
                                                    style={{ width: `${result.winRate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardContent className="py-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <RotateCcw />
                                    Reset & Bandingin Lagi
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Reset Sesi?</DialogTitle>
                                    <DialogDescription>
                                        Yakin mau reset? Semua hasil bakal hilang dan kamu mulai dari awal lagi nih.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Batal</Button>
                                    </DialogClose>
                                    <Button variant="destructive" onClick={handleReset}>
                                        Ya, Reset
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" onClick={handleDuplicate}>
                            <Copy />
                            Duplikat Sesi
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground text-center mt-4">
                        Mau bandingin yang lain? Duplikat sesi ini atau bikin yang baru.
                    </p>
                </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Statistik</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-primary">{session.items.length}</div>
                            <div className="text-sm text-muted-foreground">Item Dibandingin</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-primary">
                                {results ? results.reduce((sum, r) => sum + r.appearances, 0) : 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Perbandingan</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-primary">
                                {results ? Math.max(...results.map((r) => r.winRate)) : 0}%
                            </div>
                            <div className="text-sm text-muted-foreground">Win Rate Tertinggi</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-primary">
                                {results ? Math.min(...results.map((r) => r.winRate)) : 0}%
                            </div>
                            <div className="text-sm text-muted-foreground">Win Rate Terendah</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
