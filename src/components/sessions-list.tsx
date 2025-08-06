'use client';

import { BarChart3, Copy, Edit, Play, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { EditSessionForm } from '@/components/edit-session-form';
import { LoadingCard } from '@/components/loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useSessionActions, useSessions } from '@/hooks/use-database';
import { dayjs } from '@/lib/dayjs';
import type { VotingSession } from '@/lib/db';

export function SessionsList() {
    const router = useRouter();
    const sessions = useSessions();
    const { deleteSession, duplicateSession } = useSessionActions();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [sessionToEdit, setSessionToEdit] = useState<VotingSession | null>(null);

    function formatCreatedAt(createdAt: unknown) {
        try {
            return dayjs(createdAt as dayjs.ConfigType).fromNow();
        } catch {
            return 'Nggak tau kapan';
        }
    }

    // Loading state
    if (sessions === undefined) {
        return (
            <div className="mx-auto space-y-4">
                <SessionsHeader />
                <div className="grid gap-4">
                    {[1].map((i) => (
                        <LoadingCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (!sessions || sessions.length === 0) {
        return (
            <div className="mx-auto space-y-4">
                <SessionsHeader />
                <Card className="mx-auto w-full max-w-4xl">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="space-y-2 text-center">
                            <h3 className="text-lg font-semibold">Belum ada apa-apa nih</h3>
                            <p className="text-muted-foreground">Yuk bikin yang pertama!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Sort: running first, then finished
    const sortedSessions = [...sessions].sort((a, b) => {
        if (a.isCompleted === b.isCompleted) {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return a.isCompleted ? 1 : -1;
    });

    async function handleDuplicate(sessionId: number) {
        const newSession = await duplicateSession(sessionId);
        toast.success('Sip, udah diduplikat!');
        router.push(`/${newSession.slug}`);
    }

    function openEditDialog(session: VotingSession) {
        setSessionToEdit(session);
        setEditDialogOpen(true);
    }

    function openDeleteDialog(sessionId: number) {
        setSessionToDelete(sessionId);
        setDeleteDialogOpen(true);
    }

    function handleEditSuccess() {
        setEditDialogOpen(false);
        setSessionToEdit(null);
    }

    function handleEditCancel() {
        setEditDialogOpen(false);
        setSessionToEdit(null);
    }

    async function handleDelete() {
        if (sessionToDelete) {
            await deleteSession(sessionToDelete);
            setDeleteDialogOpen(false);
            setSessionToDelete(null);
        }
    }

    return (
        <>
            <div className="mx-auto space-y-4">
                <SessionsHeader />

                <div className="grid gap-4">
                    {sortedSessions.map((session) => (
                        <Card key={session.id} className="transition-shadow hover:shadow-md">
                            <CardHeader className="pb-3">
                                <div className="flex min-w-0 items-start justify-between">
                                    <div className="min-w-0 space-y-1">
                                        <CardTitle className="text-lg break-words">{session.title}</CardTitle>
                                        <CardDescription>
                                            {session.items.length} item • Dibuat {formatCreatedAt(session.createdAt)}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={session.isCompleted ? 'default' : 'secondary'}>
                                        {session.isCompleted ? 'Selesai' : 'Berjalan'}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {session.items.slice(0, 3).map((item, index) => (
                                        <Badge key={index} variant="outline" className="max-w-60 text-xs">
                                            <span className="truncate">{item}</span>
                                        </Badge>
                                    ))}
                                    {session.items.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{session.items.length - 3} lagi
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" asChild>
                                        <Link href={`/${session.slug}`}>
                                            {session.isCompleted ? (
                                                <>
                                                    <BarChart3 />
                                                    Liat Hasil
                                                </>
                                            ) : (
                                                <>
                                                    <Play />
                                                    Lanjut
                                                </>
                                            )}
                                        </Link>
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => session.id && handleDuplicate(session.id)}
                                    >
                                        <Copy />
                                        Duplikat
                                    </Button>

                                    <Button size="sm" variant="outline" onClick={() => openEditDialog(session)}>
                                        <Edit />
                                        Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => session.id && openDeleteDialog(session.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 />
                                        Hapus
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Sesi</DialogTitle>
                        <DialogDescription>
                            Yakin mau hapus sesi voting ini? Nggak bisa dibatalin lagi lho.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    {sessionToEdit && (
                        <EditSessionForm
                            session={sessionToEdit}
                            onSuccess={handleEditSuccess}
                            onCancel={handleEditCancel}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function SessionsHeader() {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Sesi Kamu</h2>
        </div>
    );
}
