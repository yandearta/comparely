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
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
