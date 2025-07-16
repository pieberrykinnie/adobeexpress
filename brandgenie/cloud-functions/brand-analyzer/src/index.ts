import { Router } from 'itty-router';
import Vibrant from '@vibrant/core';
import PngQuant from '@vibrant/png';
import Jpeg from '@vibrant/jpeg';

// Register image handlers
Vibrant.use(PngQuant);
Vibrant.use(Jpeg);

const router = Router();

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
    },
    ...init,
  });
}

router.post('/analyze/logo', async (request) => {
  try {
    const { image } = await request.json<any>();
    if (!image || typeof image !== 'string') {
      return jsonResponse({ error: 'Missing image data' }, { status: 400 });
    }

    // Decode base64
    const binaryString = atob(image.split(',').pop()!);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create blob for Vibrant
    const blob = new Blob([bytes.buffer]);
    const arrayBuffer = await blob.arrayBuffer();
    const palette = await Vibrant.from(arrayBuffer).getPalette();

    const colors = Object.values(palette)
      .filter(Boolean)
      .map((swatch) => swatch!.getHex());

    return jsonResponse({ palette: colors });
  } catch (err: any) {
    console.error(err);
    return jsonResponse({ error: 'Unsupported image format' }, { status: 415 });
  }
});

router.all('*', () => new Response('Not found', { status: 404 }));

export default {
  fetch: (request: Request, _env: unknown, _ctx: ExecutionContext) => router.handle(request),
};