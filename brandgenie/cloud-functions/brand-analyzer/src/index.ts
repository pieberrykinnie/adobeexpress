import { Router } from 'itty-router';
import Vibrant from '@vibrant/core';
import PngQuant from '@vibrant/png';
import Jpeg from '@vibrant/jpeg';
import { distance } from 'fastest-levenshtein';
import { load } from 'cheerio';

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

// --- New helper utilities ---
const GOOGLE_FONTS: string[] = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Playfair Display',
  'Merriweather',
  'Raleway',
  'Nunito',
  'Oswald',
  'Work Sans',
  'Inter',
  'Libre Baskerville',
  'Roboto Condensed',
  'Mukta',
  'Rubik',
  'Ubuntu',
];

function pickClosestFonts(base: string, count = 5): string[] {
  const scored = GOOGLE_FONTS.map((f) => ({ f, d: distance(base.toLowerCase(), f.toLowerCase()) }));
  return scored.sort((a, b) => a.d - b.d).slice(0, count).map((s) => s.f);
}

async function fetchFirstImagePalette(url: string): Promise<string[] | null> {
  try {
    const res = await fetch(url, { cf: { cacheTtl: 86400 } });
    const html = await res.text();
    const $ = load(html);
    // try og:image or first img
    const imgSrc =
      $('meta[property="og:image"]').attr('content') || $('img').first().attr('src');
    if (!imgSrc) return null;
    const absolute = new URL(imgSrc, url).href;
    const imgResp = await fetch(absolute);
    const arrayBuffer = await imgResp.arrayBuffer();
    const palette = await Vibrant.from(arrayBuffer).getPalette();
    return Object.values(palette)
      .filter(Boolean)
      .map((swatch) => swatch!.getHex());
  } catch (e) {
    console.warn('Palette fetch failed', e);
    return null;
  }
}

function extractFontsFromHtml(html: string): string[] {
  const $ = load(html);
  const fontFamilies: Set<string> = new Set();
  const styleLinks: string[] = [];

  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) styleLinks.push(href);
  });

  $('style').each((_, el) => {
    const css = $(el).text();
    css.match(/font-family:\s*['\"]?([A-Za-z0-9\s]+)['\"]?/gi)?.forEach((m) => {
      const name = m.split(':')[1]?.replace(/["'`;]/g, '').trim();
      if (name) fontFamilies.add(name);
    });
  });

  return Array.from(fontFamilies).slice(0, 10);
}

// --- End helpers ---

// Endpoint to analyze a website URL
router.post('/analyze/url', async (request) => {
  try {
    const { url } = await request.json<any>();
    if (!url || typeof url !== 'string') {
      return jsonResponse({ error: 'Missing url' }, { status: 400 });
    }
    // Fetch page HTML
    const res = await fetch(url, { cf: { cacheTtl: 3600 } });
    if (!res.ok) {
      return jsonResponse({ error: 'Unable to fetch url' }, { status: 422 });
    }
    const html = await res.text();
    const fonts = extractFontsFromHtml(html);
    const palette = await fetchFirstImagePalette(url);

    return jsonResponse({ palette, fonts });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Could not analyze URL' }, { status: 500 });
  }
});

// Endpoint to recommend fonts
router.post('/recommend/fonts', async (request) => {
  try {
    const { baseFont, count = 5 } = await request.json<any>();
    if (!baseFont) {
      return jsonResponse({ error: 'baseFont required' }, { status: 400 });
    }
    const suggestions = pickClosestFonts(baseFont, Math.min(count, 10));
    return jsonResponse({ suggestions });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Could not recommend fonts' }, { status: 500 });
  }
});

// --- Firefly Integration Endpoints (Phase 3) ---
router.post('/firefly/palette', async (request, env: any) => {
  try {
    const { seed } = await request.json<any>();
    const apiKey = env?.FIREFLY_API_KEY || '';
    if (!apiKey) {
      // fallback mock
      return jsonResponse({ palette: ['#ff5e5e', '#ffd45e', '#5effc1'] });
    }
    const res = await fetch('https://firefly.adobe.io/v1/palette', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ seed }),
    });
    const data = await res.json();
    return jsonResponse({ palette: data.palette || [] });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Firefly palette error' }, { status: 500 });
  }
});

router.post('/firefly/templates', async (request, env: any) => {
  try {
    const { brandName } = await request.json<any>();
    const apiKey = env?.FIREFLY_API_KEY || '';
    if (!apiKey) {
      // mock images
      return jsonResponse({ images: [
        'https://picsum.photos/seed/1/1200/628',
        'https://picsum.photos/seed/2/1200/628',
        'https://picsum.photos/seed/3/1200/628',
      ] });
    }

    const res = await fetch('https://firefly.adobe.io/v1/generate/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt: `${brandName} social media post template`, count: 3 }),
    });
    const data = await res.json();

    // Save to KV temp storage (expires 1 day)
    const images: string[] = data.images || [];
    if (env.ASSETS && images.length) {
      await Promise.all(
        images.map((url: string, idx: number) => env.ASSETS.put(`template:${brandName}:${idx}`, url, { expirationTtl: 86400 })),
      );
    }

    return jsonResponse({ images });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'Firefly template error' }, { status: 500 });
  }
});
// --- End Firefly ---

router.all('*', () => new Response('Not found', { status: 404 }));

export default {
  fetch: (request: Request, _env: unknown, _ctx: ExecutionContext) => router.handle(request),
};