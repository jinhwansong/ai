import Parser from 'rss-parser';

export type RSSFeedItem = {
  uuid: string;
  title: string | null;
  description: string | null;
  url: string | null;
  image_url: string | null;
  published_at: string | null;
  source: string | null;
  content: string | null;
};

// rss-parser의 Item 타입 + customFields 확장
type RSSParserItem = Parser.Item & {
  description?: string;
  'media:content'?: {
    $?: {
      url?: string;
    };
  };
  'media:thumbnail'?: {
    $?: {
      url?: string;
    };
  };
};

export type RSSFeedSource = {
  name: string;
  url: string;
  category: string;
};

// 주요 경제 뉴스 RSS 피드 소스
export const RSS_FEED_SOURCES: RSSFeedSource[] = [
  {
    name: 'Bloomberg (Google News)',
    url: 'https://news.google.com/rss/search?q=site:bloomberg.com',
    category: 'finance',
  },
  {
    name: 'Bloomberg Markets (Google News)',
    url: 'https://news.google.com/rss/search?q=site:bloomberg.com+markets',
    category: 'markets',
  },
  {
    name: 'Reuters Business (Google News)',
    url: 'https://news.google.com/rss/search?q=site:reuters.com+business',
    category: 'business',
  },
  {
    name: 'Reuters Markets (Google News)',
    url: 'https://news.google.com/rss/search?q=site:reuters.com+markets',
    category: 'markets',
  },
  {
    name: 'Financial Times',
    url: 'https://www.ft.com/?format=rss',
    category: 'finance',
  },
  {
    name: 'Wall Street Journal',
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    category: 'markets',
  },
  {
    name: 'CNBC',
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    category: 'business',
  },
];

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ['media:content', 'media:thumbnail'],
  },
  
});

/**
 * URL을 기반으로 UUID 생성 (기존 raw_news 테이블과 호환)
 */
function generateUUIDFromURL(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `rss-${Math.abs(hash).toString(36)}`;
}

/**
 * RSS 피드에서 뉴스 아이템 파싱
 */
function parseRSSItem(item: RSSParserItem, sourceName: string): RSSFeedItem | null {
  if (!item.title || !item.link) {
    return null;
  }

  const url = item.link;
  const uuid = generateUUIDFromURL(url);

  let publishedAt: string | null = null;
  if (item.pubDate) {
    try {
      publishedAt = new Date(item.pubDate).toISOString();
    } catch {
      publishedAt = new Date().toISOString();
    }
  } else {
    publishedAt = new Date().toISOString();
  }

  let imageUrl: string | null = null;
  if (item['media:content']?.['$']?.url) {
    imageUrl = item['media:content']['$'].url;
  } else if (item['media:thumbnail']?.['$']?.url) {
    imageUrl = item['media:thumbnail']['$'].url;
  } else if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
    imageUrl = item.enclosure.url;
  }

  const description =
    item.contentSnippet ||
    item.content ||
    item.description ||
    item.summary ||
    null;

  return {
    uuid,
    title: item.title || null,
    description: description
      ? description.replace(/<[^>]*>/g, '').substring(0, 500)
      : null,
    url,
    image_url: imageUrl,
    published_at: publishedAt,
    source: sourceName,
    content: description
      ? description.replace(/<[^>]*>/g, '').substring(0, 1000)
      : null,
  };
}

/**
 * 단일 RSS 피드에서 뉴스 수집
 */
export async function fetchRSSFeed(
  source: RSSFeedSource,
  limit: number = 20,
): Promise<RSSFeedItem[]> {
  try {
    console.log(`📡 [RSS] Fetching ${source.name} from ${source.url}`);
    const feed = await parser.parseURL(source.url);

    if (!feed.items || feed.items.length === 0) {
      console.warn(`⚠️ [RSS] No items found in ${source.name}`);
      return [];
    }

    const items = feed.items
      .slice(0, limit)
      .map((item) => parseRSSItem(item as RSSParserItem, source.name))
      .filter((item): item is RSSFeedItem => item !== null);

    console.log(
      `✅ [RSS] ${source.name}: ${items.length}/${feed.items.length} items parsed`,
    );
    return items;
  } catch (error) {
    console.error(`❌ [RSS] Failed to fetch ${source.name}:`, error);
    throw error;
  }
}

/**
 * 모든 RSS 피드에서 뉴스 수집
 */
export async function fetchAllRSSFeeds(
  limitPerFeed: number = 20,
): Promise<RSSFeedItem[]> {
  const allItems: RSSFeedItem[] = [];

  for (const source of RSS_FEED_SOURCES) {
    try {
      const items = await fetchRSSFeed(source, limitPerFeed);
      allItems.push(...items);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
    } catch {
      console.error(`❌ [RSS] Skipping ${source.name} due to error`);
    }
  }

  return allItems;
}

/**
 * 키워드로 뉴스 필터링 (섹터별 수집용)
 */
export function filterNewsByKeywords(
  items: RSSFeedItem[],
  keywords: string[],
): RSSFeedItem[] {
  if (keywords.length === 0) return items;

  const keywordLower = keywords.map((k) => k.toLowerCase());

  return items.filter((item) => {
    const title = (item.title || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const content = (item.content || '').toLowerCase();
    const searchText = `${title} ${description} ${content}`;
    return keywordLower.some((keyword) => searchText.includes(keyword));
  });
}
