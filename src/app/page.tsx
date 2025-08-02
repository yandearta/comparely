import { CreateSessionForm } from '@/components/create-session-form';
import { SessionsList } from '@/components/sessions-list';

export default function HomePage() {
    return (
        <main className="min-h-screen py-8">
            <div className="container mx-auto px-4 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Comparely
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Buat keputusan sulit jadi lebih mudah dengan voting perbandingan berpasangan. Bandingkan item
                        dua per dua untuk menemukan preferensi aslimu.
                    </p>
                </div>

                {/* Create Session Form */}
                <section>
                    <CreateSessionForm />
                </section>

                {/* Sessions List */}
                <section>
                    <SessionsList />
                </section>
            </div>
        </main>
    );
}
