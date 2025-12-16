import { NewsArticle, TranslateNewsItem } from "@/types/news";

export function mapToTranslateItems(
  articles: NewsArticle[]
): TranslateNewsItem[] {
  return articles.map((article) => ({
    url: article.url,
    title: article.title ?? '',
    description: article.description ?? '',
  }));
}
