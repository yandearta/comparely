import { ExternalLink } from 'lucide-react';

import { Card, CardContent } from './ui/card';

export function Footer() {
    return (
        <footer className="w-full max-w-4xl mx-auto">
            <Card>
                <CardContent>
                    <p>
                        Made with ❤️ by{' '}
                        <a
                            href="https://github.com/yandearta"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                        >
                            @yandearta <ExternalLink className="size-4" />
                        </a>
                    </p>
                </CardContent>
            </Card>
        </footer>
    );
}
