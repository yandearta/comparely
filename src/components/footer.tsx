import { ExternalLink } from 'lucide-react';

import { ModeToggle } from './mode-toggle';
import { Card, CardContent } from './ui/card';

export function Footer() {
    return (
        <footer>
            <Card>
                <CardContent className="flex items-center justify-between">
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

                    <ModeToggle />
                </CardContent>
            </Card>
        </footer>
    );
}
