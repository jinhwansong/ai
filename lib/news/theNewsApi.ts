export type TheNewsApiItem = {
  uuid: string;
  title?: string | null;
  description?: string | null;
  snippet?: string | null;
  url?: string | null;
  image_url?: string | null;
  published_at?: string | null;
  source?: string | null;
};

export async function fetchTheNewsApiLatestBySearch(opts: {
  search: string;
  limit: number;
  language?: string;
  sort?: 'published_at';
}): Promise<TheNewsApiItem[]> {
  const apiToken = process.env.THE_NEWS_API_KEY;
  if (!apiToken) {
    throw new Error('THE_NEWS_API_KEY is not set');
  }

  const base = 'https://api.thenewsapi.com/v1/news/all';
  const url = new URL(base);
  url.searchParams.set('api_token', apiToken);
  url.searchParams.set('search', opts.search);
  url.searchParams.set('limit', String(opts.limit));
  url.searchParams.set('language', opts.language ?? 'en');
  url.searchParams.set('sort', opts.sort ?? 'published_at');

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`TheNewsAPI request failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as unknown;

  if (typeof json === 'object' && json !== null && 'data' in json) {
    const data = (json as { data?: unknown }).data;
    if (Array.isArray(data)) {
      return data as TheNewsApiItem[];
    }
  }

  if (Array.isArray(json)) {
    return json as TheNewsApiItem[];
  }

  return [];
}

