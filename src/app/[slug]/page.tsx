'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';

import { ResultsTable } from '@/components/results-table';
import { VotingInterface } from '@/components/voting-interface';
import { useSessionBySlug } from '@/hooks/use-database';

export default function SessionPage() {
    const params = useParams();
    const slug = params.slug as string;

    const session = useSessionBySlug(slug);

    if (session === null) {
        notFound();
    }

    if (!session) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <div className="space-y-2 text-center">
                    <div className="border-primary mx-auto size-8 animate-spin rounded-full border-b-2"></div>
                    <p className="text-muted-foreground">Memuat sesi...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {session.isCompleted ? <ResultsTable slug={slug} /> : <VotingInterface slug={slug} />}
            </div>
        </main>
    );
}
