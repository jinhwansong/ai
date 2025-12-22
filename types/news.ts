export interface NewsArticle {
  source?: {
    id: string | null;
    name: string;
  };
  author?: string | null;
  title?: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
}

export interface NormalizedNews {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;

  language: 'en' | 'ko';
  tags?: string[];
}

export interface TranslateNewsItem {
  url: string;
  title: string;
  description: string;
}

export interface SummarizeNewsInput {
  title: string;
  content: string;
}

export interface FetchNewsParams {
  endpoint: 'top-headlines' | 'everything';
  query?: string;
  category?: 'business' | 'technology' | 'science';
  language?: 'en' | 'ko';
  sortBy?: 'publishedAt' | 'relevancy';
  pageSize?: number;
}
