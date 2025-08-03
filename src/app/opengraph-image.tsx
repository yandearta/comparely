import { ImageResponse } from 'next/og';

export default async function Image() {
    const text = 'Comparely';

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: '#f0f0f0',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#333333',
                }}
            >
                {text}
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Geist',
                    data: await loadGoogleFont('Geist', text),
                    style: 'normal',
                },
            ],
        },
    );
}

async function loadGoogleFont(font: string, text: string): Promise<ArrayBuffer> {
    const url = `https://fonts.googleapis.com/css2?family=${font}:wght@700&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const fontUrlMatch = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css);

    if (!fontUrlMatch?.[1]) {
        throw new Error('Font URL not found');
    }

    const response = await fetch(fontUrlMatch[1]);
    if (!response.ok) {
        throw new Error(`Font fetch failed: ${response.status}`);
    }

    return response.arrayBuffer();
}
