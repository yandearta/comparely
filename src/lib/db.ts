import Dexie, { type EntityTable } from 'dexie';
import slugify from 'slugify';

// Database schema types
export type VotingSession = {
    id?: number;
    title: string;
    slug: string;
    items: string[];
    createdAt: Date;
    updatedAt: Date;
    isCompleted: boolean;
};

type Comparison = {
    id?: number;
    sessionId: number;
    itemA: string;
    itemB: string;
    winner: string | null;
    createdAt: Date;
    updatedAt: Date;
};

// Dexie database class
class ComparelydDB extends Dexie {
    sessions!: EntityTable<VotingSession, 'id'>;
    comparisons!: EntityTable<Comparison, 'id'>;

    constructor() {
        super('ComparelydDB');

        this.version(1).stores({
            sessions: '++id, title, slug, createdAt, updatedAt, isCompleted',
            comparisons: '++id, sessionId, itemA, itemB, winner, createdAt, updatedAt',
        });
    }
}

// Create database instance
const db = new ComparelydDB();

// Utility functions for database operations
export class DatabaseService {
    // Helper to generate unique slug
    static async generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
        const baseSlug = slugify(title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        // Keep trying until we find a unique slug
        while (true) {
            const existing = await db.sessions.where('slug').equals(slug).first();
            if (!existing || (excludeId && existing.id === excludeId)) {
                break;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }

    // Session operations
    static async createSession(title: string, items: string[]): Promise<VotingSession> {
        const slug = await this.generateUniqueSlug(title);

        const session: Omit<VotingSession, 'id'> = {
            title,
            slug,
            items,
            createdAt: new Date(),
            updatedAt: new Date(),
            isCompleted: false,
        };

        const sessionId = await db.sessions.add(session);

        if (typeof sessionId !== 'number') {
            throw new Error('Failed to create session');
        }

        await this.createComparisonPairs(sessionId, items);

        return { ...session, id: sessionId };
    }

    static async getSession(id: number): Promise<VotingSession | undefined> {
        return await db.sessions.get(id);
    }

    static async getSessionBySlug(slug: string): Promise<VotingSession | undefined> {
        return await db.sessions.where('slug').equals(slug).first();
    }

    static async getAllSessions(): Promise<VotingSession[]> {
        return await db.sessions.orderBy('updatedAt').reverse().toArray();
    }

    static async updateSession(id: number, updates: Partial<VotingSession>): Promise<void> {
        const updateData = { ...updates, updatedAt: new Date() };

        // If title is being updated, regenerate slug
        if (updates.title) {
            updateData.slug = await this.generateUniqueSlug(updates.title, id);
        }

        // If items are being updated, we need to recreate comparison pairs
        if (updates.items && updates.items.length > 0) {
            const newItems = updates.items;
            await db.transaction('rw', [db.sessions, db.comparisons], async () => {
                // Update the session
                await db.sessions.update(id, updateData);

                // Delete existing comparisons
                await db.comparisons.where('sessionId').equals(id).delete();

                // Create new comparison pairs with the updated items
                await this.createComparisonPairs(id, newItems);

                // Mark session as not completed since we have new comparisons
                await db.sessions.update(id, { isCompleted: false });
            });
        } else {
            // Just update the session without touching comparisons
            await db.sessions.update(id, updateData);
        }
    }

    static async deleteSession(id: number): Promise<void> {
        await db.transaction('rw', [db.sessions, db.comparisons], async () => {
            await db.sessions.delete(id);
            await db.comparisons.where('sessionId').equals(id).delete();
        });
    }

    static async duplicateSession(id: number): Promise<VotingSession> {
        const session = await this.getSession(id);
        if (!session) throw new Error('Session not found');

        return await this.createSession(`${session.title} (Copy)`, [...session.items]);
    }

    // Comparison operations - Generate all possible pairs for pairwise comparison
    static async createComparisonPairs(sessionId: number, items: string[]): Promise<void> {
        const now = new Date();
        const pairs: Omit<Comparison, 'id'>[] = [];

        // Generate n*(n-1)/2 unique pairs using nested loops
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const itemA = items[i];
                const itemB = items[j];
                if (itemA && itemB) {
                    pairs.push({
                        sessionId,
                        itemA,
                        itemB,
                        winner: null,
                        createdAt: now,
                        updatedAt: now,
                    });
                }
            }
        }

        await db.comparisons.bulkAdd(pairs);
    }

    static async getSessionComparisons(sessionId: number): Promise<Comparison[]> {
        return await db.comparisons.where('sessionId').equals(sessionId).toArray();
    }

    static async getNextComparison(sessionId: number): Promise<Comparison | undefined> {
        return await db.comparisons
            .where('sessionId')
            .equals(sessionId)
            .and((comparison) => comparison.winner === null)
            .first();
    }

    static async submitVote(comparisonId: number, winner: string): Promise<void> {
        await db.comparisons.update(comparisonId, {
            winner,
            updatedAt: new Date(),
        });

        // Check if session is completed
        const comparison = await db.comparisons.get(comparisonId);
        if (comparison) {
            const remainingComparisons = await db.comparisons
                .where('sessionId')
                .equals(comparison.sessionId)
                .and((c) => c.winner === null)
                .count();

            if (remainingComparisons === 0) {
                await this.updateSession(comparison.sessionId, { isCompleted: true });
            }
        }
    }

    static async getSessionProgress(
        sessionId: number,
    ): Promise<{ completed: number; total: number; percentage: number }> {
        // Get all comparisons in single query for better performance
        const comparisons = await db.comparisons.where('sessionId').equals(sessionId).toArray();
        const total = comparisons.length;
        const completed = comparisons.filter((c) => c.winner !== null).length;

        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    }

    static async getSessionResults(sessionId: number): Promise<
        Array<{
            item: string;
            wins: number;
            appearances: number;
            winRate: number;
        }>
    > {
        const [comparisons, session] = await Promise.all([
            this.getSessionComparisons(sessionId),
            this.getSession(sessionId),
        ]);

        if (!session) return [];

        // Calculate results for each item using efficient map
        const results = session.items.map((item) => {
            const appearances = comparisons.filter((c) => c.itemA === item || c.itemB === item).length;
            const wins = comparisons.filter((c) => c.winner === item).length;
            const winRate = appearances > 0 ? Math.round((wins / appearances) * 100) : 0;

            return { item, wins, appearances, winRate };
        });

        // Sort by win rate (descending), then by wins (descending) for tie-breaking
        return results.sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);
    }

    static async resetSessionComparisons(sessionId: number): Promise<void> {
        await db.transaction('rw', [db.sessions, db.comparisons], async () => {
            // Reset all comparison winners to null
            await db.comparisons.where('sessionId').equals(sessionId).modify({
                winner: null,
                updatedAt: new Date(),
            });

            // Mark session as not completed
            await this.updateSession(sessionId, { isCompleted: false });
        });
    }

    static async undoLastVote(sessionId: number): Promise<void> {
        // Get the most recent completed comparison
        const lastComparison = await db.comparisons
            .where('sessionId')
            .equals(sessionId)
            .and((c) => c.winner !== null)
            .reverse()
            .sortBy('updatedAt')
            .then((comparisons) => comparisons[0]);

        if (lastComparison?.id) {
            await db.transaction('rw', [db.sessions, db.comparisons], async () => {
                // Reset the vote
                await db.comparisons.update(lastComparison.id, {
                    winner: null,
                    updatedAt: new Date(),
                });

                // Always mark session as not completed when undoing
                await db.sessions.update(sessionId, { isCompleted: false });
            });
        }
    }
}
