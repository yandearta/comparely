import { CreateSessionForm } from '@/components/create-session-form';
import { Footer } from '@/components/footer';
import { SessionsList } from '@/components/sessions-list';

export default function HomePage() {
    return (
        <main className="min-h-screen py-8">
            <div className="container mx-auto space-y-12 px-4">
                {/* Header */}
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold md:text-6xl">Comparely</h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                        Kadang bingung milih karena kebanyakan pilihan? Bandingin pelan-pelan, satu lawan satu, biar
                        nemu yang bener-bener cocok.
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

                <Footer />
            </div>
        </main>
    );
}
