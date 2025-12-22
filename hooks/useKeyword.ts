import { useQuery, useMutation } from '@tanstack/react-query';
import { searchKeyword, fetchKeywordResult } from '@/lib/api/keyword';
import { withQueryDefaults } from './withQueryDefaults';

export const useSearchKeyword = () =>
  useMutation({
    mutationFn: (keyword: string) => searchKeyword(keyword),
  });

export const useKeywordResult = (tag: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: ['keyword', tag],
      queryFn: () => fetchKeywordResult(tag),
      enabled: !!tag,
    })
  );
