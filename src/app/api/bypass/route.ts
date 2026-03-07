import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputUrl = body.url;

    if (!inputUrl) {
      return NextResponse.json({ valid: false, reasoning: 'No URL provided' }, { status: 400 });
    }

    const url = configureURL(inputUrl);
    if (!url || !checkURL(url)) {
      return NextResponse.json({ valid: false, reasoning: 'Invalid Medal URL' }, { status: 400 });
    }

    const clipId = extractClipID(url);
    if (!clipId) {
      return NextResponse.json({ valid: false, reasoning: 'Could not extract clip ID' }, { status: 400 });
    }

    const fetchURL = `https://medal.tv/clips/${clipId}`;

    const res = await fetch(fetchURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ valid: false, reasoning: 'Failed to fetch the clip page. Is the clip private or deleted?' }, { status: 404 });
    }

    const html = await res.text();

    const src = extractVideoUrl(html);

    if (src) {
      return NextResponse.json({ valid: true, src });
    } else {
      return NextResponse.json({ valid: false, reasoning: 'Could not find the direct video URL. Format might have changed.' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ valid: false, reasoning: 'Internal server error while bypassing' }, { status: 500 });
  }
}

// ---------------- Helper Functions ----------------

function extractVideoUrl(html: string): string | null {
  // Strategy 1: Find contentUrl in hydration data/JSON
  const contentUrlRegex = /"contentUrl"\s*:\s*"([^"]+)"/;
  const contentUrlMatch = html.match(contentUrlRegex);
  if (contentUrlMatch && contentUrlMatch[1] && contentUrlMatch[1].includes('.mp4')) {
    return contentUrlMatch[1];
  }

  // Strategy 2: Check for og:video:url meta tag
  const ogVideoUrlRegex = /property="og:video:url"\s+content="([^"]+)"/;
  const ogVideoMatch = html.match(ogVideoUrlRegex);
  if (ogVideoMatch && ogVideoMatch[1]) {
    return ogVideoMatch[1];
  }
  
  // Strategy 2 fallback: Check for alternative meta tags order
  const ogVideoUrlRegexFallback = /content="([^"]+)"\s+property="og:video:url"/;
  const ogVideoFallbackMatch = html.match(ogVideoUrlRegexFallback);
  if (ogVideoFallbackMatch && ogVideoFallbackMatch[1]) {
    return ogVideoFallbackMatch[1];
  }

  // Strategy 3: Check for twitter:player:stream meta tag
  const twitterVideoRegex = /name="twitter:player:stream"\s+content="([^"]+)"/;
  const twitterVideoMatch = html.match(twitterVideoRegex);
  if (twitterVideoMatch && twitterVideoMatch[1]) {
    return twitterVideoMatch[1];
  }

  return null;
}

function configureURL(url: string): string | false {
  try {
    let configuredUrl = url.trim();
    if (!configuredUrl.toLowerCase().includes('medal')) {
      if (!configuredUrl.includes('/')) {
        configuredUrl = 'https://medal.tv/?contentId=' + configuredUrl;
      } else {
        return false;
      }
    }
    
    if (configuredUrl.toLowerCase().indexOf('https://') !== configuredUrl.toLowerCase().lastIndexOf('https://')) {
      return false;
    }
    
    if (!configuredUrl.toLowerCase().includes('https://') && !configuredUrl.toLowerCase().includes('http://')) {
      configuredUrl = 'https://' + configuredUrl;
    }
    
    configuredUrl = configuredUrl.replace('?theater=true', '');
    return configuredUrl;
  } catch (e) {
    return false;
  }
}

function checkURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.toLowerCase().includes('medal')) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

function extractClipID(url: string): string | false {
  const clipIdMatch = url.match(/\/clips\/([^\/?&#]+)/);
  const contentIdMatch = url.match(/[?&]contentId=([^&#]+)/);

  if (clipIdMatch) return clipIdMatch[1];
  if (contentIdMatch) return contentIdMatch[1];
  return false;
}
