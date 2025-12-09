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

export interface SearchNewsResponse {
  keyword: string;
  total: number;
  articles: NewsArticle[];
}

interface SummaryInsight {
  title: string;
  summary: string;
  marketImpact: string;
}
export interface SummaryResult {
  keyword: string;
  insights: SummaryInsight[];
}
