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
  published_at: string;
  content?: string;
}

export interface NormalizedNews {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
  image_url?: string;
  published_at: string;

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
  sortBy?: 'published_at' | 'relevancy';
  pageSize?: number;
}


export interface AnalysisData {
  title: string;
  content: string;
  publishedAt: string;
  tags: string[];
  checkPoints: string[];
  relatedSectors: {
    name: string;
    status: '강세' | '약세' | '중립';
    trend: 'Strong' | 'Moderate' | 'Building';
  }[];
  relatedNews: {
    title: string;
    source: string;
    time: string;
    url: string | null;
  }[];
}