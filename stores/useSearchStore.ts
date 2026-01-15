import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SearchState {
  recentSearches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addSearch: (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== trimmed);
          const updated = [trimmed, ...filtered].slice(0, 10);
          return { recentSearches: updated };
        });
      },
      removeSearch: (query: string) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        }));
      },
      clearHistory: () => {
        set({ recentSearches: [] });
      },
    }),
    {
      name: 'recent_searches', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
