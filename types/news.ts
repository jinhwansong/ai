export interface NewsSource {
  id: string | null;
  name: string;
}

export interface NewsArticle {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export type TranslateNewsItem = {
  url: string;
  title: string;
  description: string;
};

export type FetchNewsParams = {
  endpoint: 'top-headlines' | 'everything';
  query?: string;
  category?: string;
  language?: string;
  pageSize?: number;
  sortBy?: 'publishedAt' | 'relevancy';
};
