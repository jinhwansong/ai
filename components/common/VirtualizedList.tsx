'use client';

import React, { type ReactNode } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface BaseVirtualizedListProps<T> {
  /** 렌더링할 데이터 리스트 */
  data: T[];
  /** 각 아이템 렌더 함수 */
  renderItem: (item: T, index: number) => ReactNode;
  /** className */
  className?: string;
  /** 로딩 상태 */
  loading?: boolean;
  /** 에러 메시지 */
  error?: string;
  /** 빈 리스트 메시지 */
  emptyText?: string;
  /** 높이 */
  height?: number | string;
}

export interface ChatVirtualHandle {
  scrollToBottom: (behavior?: 'auto' | 'smooth') => void;
  scrollToIndex: (index: number, behavior?: 'auto' | 'smooth') => void;
}

interface ChatListProps<T> extends BaseVirtualizedListProps<T> {
  mode: 'chat';
  /** 첫 번째 아이템의 인덱스 (prepend 지원) */
  firstItemIndex?: number;
  /** 스크롤이 최상단에 도달했을 때 호출 (이전 메시지 로드) */
  onLoadPrevious?: () => void;
  /** 더 불러올 이전 메시지가 있는지 */
  hasPrevious?: boolean;
  /** 이전 메시지 로딩 중 */
  loadingPrevious?: boolean;
  /** TanStack Virtual ref (외부에서 스크롤 제어용) */
  virtuosoRef?: React.RefObject<ChatVirtualHandle | null>;
  /** 스크롤이 하단에 있는지 상태 변경 콜백 */
  onAtBottomStateChange?: (isAtBottom: boolean) => void;
}

interface FeedListProps<T> extends BaseVirtualizedListProps<T> {
  mode: 'feed';
  loadMore?: () => void;
  hasMore?: boolean;
}

type VirtualizedListProps<T> = ChatListProps<T> | FeedListProps<T>;

// 메인 VirtualizedList 컴포넌트
export default function VirtualizedList<T>(props: VirtualizedListProps<T>) {
  const {
    data,
    renderItem,
    className = '',
    loading = false,
    error,
    emptyText = '데이터가 없습니다.',
    height = '100%',
  } = props;

  /** 공통 에러 처리 */
  if (error) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-rose-500">
        {error}
      </div>
    );
  }

  /** 공통 빈 데이터 처리 */
  if (!data || data.length === 0) {
    if (loading) {
      return (
        <div className="flex h-48 items-center justify-center text-sm text-(--text-muted)">
          로딩 중...
        </div>
      );
    }
    return (
      <div className="flex h-48 items-center justify-center text-sm text-(--text-muted)">
        {emptyText}
      </div>
    );
  }

  const isFeedMode = props.mode === 'feed';
  const loadMore = isFeedMode ? props.loadMore : undefined;
  const hasMore = isFeedMode ? props.hasMore : false;

  return (
    <div className={`${className}`}>
      <Virtuoso
        useWindowScroll
        data={data}
        style={{ height }}
        endReached={() => {
          if (hasMore && loadMore && !loading) {
            loadMore();
          }
        }}
        itemContent={(index, item) => (
          <div className="pb-4">
            {renderItem(item, index)}
          </div>
        )}
        components={{
          Footer: () =>
            loading ? (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-sm text-(--text-muted) font-bold">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-(--primary) border-t-transparent" />
                  뉴스를 더 불러오는 중...
                </div>
              </div>
            ) : <div className="h-10" />,
        }}
      />
    </div>
  );
}
