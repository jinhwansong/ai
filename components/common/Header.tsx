'use client';

import { Search, X, History, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const navItems: { name: string; target: string }[] = [
  { name: '시그널', target: 'section-signal' },
  { name: '글로벌 시장', target: 'section-macro' },
  { name: '뉴스 & 섹터', target: 'section-news' },
  { name: '리포트', target: 'section-observation' },
];

const RECENT_SEARCHES_KEY = 'recent_searches';

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const recentSearches = useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => {
      if (typeof window === 'undefined') return [];
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!saved) return [];
      try {
        return JSON.parse(saved) as string[];
      } catch {
        return [];
      }
    },
    () => [] // 서버 사이드 렌더링 시에는 빈 배열 반환
  );

  const saveSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const filtered = recentSearches.filter(s => s !== trimmed);
    const updated = [trimmed, ...filtered].slice(0, 10);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    // storage 이벤트는 같은 창에서는 발생하지 않으므로 수동으로 트리거하거나 
    // 로컬 상태를 별도로 관리해야 할 수도 있음. 
    // 여기서는 간단하게 이벤트를 직접 발생시킴
    window.dispatchEvent(new Event('storage'));
  };

  const removeSearch = (query: string) => {
    const updated = recentSearches.filter(s => s !== query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const clearHistory = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

  const handleRecentClick = (query: string) => {
    saveSearch(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  return (
    <header className="glass-header sticky top-0 z-50 w-full px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--primary) text-(--text-white) shadow-lg shadow-indigo-500/30">
            <span className="text-sm font-bold italic">S</span>
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-(--text-title) sm:block">
            오늘의 시그널
          </span>
        </Link>

        {/* Desktop Navigation & Search */}
        <div className="flex flex-1 items-center justify-center gap-4">
          <AnimatePresence mode="wait">
            {!isSearchExpanded ? (
              <motion.nav
                key="nav"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="hidden items-center gap-1 md:flex"
              >
                {navItems.map((item) => {
                  if (item.name === '뉴스 & 섹터') {
                    return (
                      <Link
                        key={item.name}
                        href="/news"
                        className="rounded-full px-5 py-2 text-sm font-semibold transition-all text-(--text-muted) hover:bg-(--hover-surface) hover:text-(--text-body)"
                      >
                        {item.name}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        const el = document.getElementById(item.target);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="rounded-full px-5 py-2 text-sm font-semibold transition-all text-(--text-muted) hover:bg-(--hover-surface) hover:text-(--text-body)"
                    >
                      {item.name}
                    </button>
                  );
                })}
              </motion.nav>
            ) : (
              <div className="relative flex w-full max-w-md flex-col">
                <motion.form
                  key="search"
                  onSubmit={handleSearch}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex w-full items-center gap-2 rounded-full bg-(--hover-surface) px-4 py-2 border border-(--border)"
                >
                  <Search size={18} className="text-(--text-muted)" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="관심 키워드나 섹터를 검색하세요"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-(--text-muted) text-(--text-body)"
                  />
                  <button 
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="text-(--text-muted) hover:text-(--text-body)"
                  >
                    <X size={18} />
                  </button>
                </motion.form>

                {/* 최근 검색어 레이어 */}
                <AnimatePresence>
                  {isSearchExpanded && recentSearches.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 mt-2 w-full overflow-hidden rounded-2xl border border-(--border) bg-(--background) shadow-xl z-50"
                    >
                      <div className="flex items-center justify-between border-b border-(--border) px-4 py-2 bg-(--secondary-bg)">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-(--text-muted)">
                          <History size={12} />
                          최근 검색어
                        </div>
                        <button 
                          onClick={clearHistory}
                          className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                        >
                          <Trash2 size={10} />
                          전체 삭제
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto py-1">
                        {recentSearches.map((query) => (
                          <div 
                            key={query}
                            className="group flex items-center justify-between px-4 py-2 hover:bg-(--hover-surface) cursor-pointer"
                          >
                            <button
                              onClick={() => handleRecentClick(query)}
                              className="flex-1 text-left text-xs font-medium text-(--text-body)"
                            >
                              {query}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSearch(query);
                              }}
                              className="text-(--text-muted) opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isSearchExpanded && (
            <button 
              onClick={() => setIsSearchExpanded(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--hover-surface) hover:text-(--text-body)"
            >
              <Search size={20} />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
