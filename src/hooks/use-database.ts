import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'sonner';

import { DatabaseService } from '@/lib/db';

// Helper for consistent error handling
function withErrorHandling<T extends unknown[], R>(fn: (...args: T) => Promise<R>, errorMessage: string) {
    return async (...args: T): Promise<R> => {
        try {
            return await fn(...args);
        } catch (error) {
            const message = error instanceof Error ? error.message : errorMessage;
            toast.error(message);
            throw error;
        }
    };
}

// Hook to get all sessions
export function useSessions() {
    return useLiveQuery(() => DatabaseService.getAllSessions(), []);
}

// Hook to get specific session by slug
export function useSessionBySlug(slug: string | null) {
    return useLiveQuery(async () => {
        if (!slug) return undefined;
        try {
            const session = await DatabaseService.getSessionBySlug(slug);
            return session ?? null;
        } catch (error) {
            console.error('Error fetching session by slug:', error);
            return null;
        }
    }, [slug]);
}

// Hook to get next comparison
export function useNextComparison(sessionId: number | null) {
    return useLiveQuery(() => (sessionId ? DatabaseService.getNextComparison(sessionId) : undefined), [sessionId]);
}

// Hook to get session progress
export function useSessionProgress(sessionId: number | null) {
    return useLiveQuery(() => (sessionId ? DatabaseService.getSessionProgress(sessionId) : null), [sessionId]);
}

// Hook to get session results
export function useSessionResults(sessionId: number | null) {
    return useLiveQuery(() => (sessionId ? DatabaseService.getSessionResults(sessionId) : []), [sessionId]);
}

// Hook with actions for managing sessions
export function useSessionActions() {
    return {
        createSession: withErrorHandling(
            (title: string, items: string[]) => DatabaseService.createSession(title, items),
            'Gagal membuat sesi',
        ),

        updateSession: withErrorHandling(
            (sessionId: number, updates: Parameters<typeof DatabaseService.updateSession>[1]) =>
                DatabaseService.updateSession(sessionId, updates),
            'Gagal mengupdate sesi',
        ),

        deleteSession: withErrorHandling(
            (sessionId: number) => DatabaseService.deleteSession(sessionId),
            'Gagal menghapus sesi',
        ),

        duplicateSession: withErrorHandling(
            (sessionId: number) => DatabaseService.duplicateSession(sessionId),
            'Gagal menduplikasi sesi',
        ),

        resetSession: withErrorHandling(
            (sessionId: number) => DatabaseService.resetSessionComparisons(sessionId),
            'Gagal mereset sesi',
        ),
    };
}

// Hook with actions for voting
export function useVotingActions() {
    return {
        submitVote: withErrorHandling(
            (comparisonId: number, winner: string) => DatabaseService.submitVote(comparisonId, winner),
            'Gagal submit vote',
        ),

        undoLastVote: withErrorHandling(
            (sessionId: number) => DatabaseService.undoLastVote(sessionId),
            'Gagal batalkan vote',
        ),
    };
}
