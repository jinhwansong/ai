import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  completed: boolean;
  keywords: string[];
  addKeyword: (k: string) => void;
  removeKeyword: (k: string) => void;
  setKeywords: (list: string[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  hasHydrated: boolean;
  _hydrate: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      keywords: [],
      hasHydrated: false,
      _hydrate: () => set({ hasHydrated: true }),
      addKeyword: (k) =>
        set((state) => ({
          keywords: Array.from(new Set([...state.keywords, k])),
        })),

      removeKeyword: (k) =>
        set((state) => ({
          keywords: state.keywords.filter((it) => it !== k),
        })),

      setKeywords: (list) => set({ keywords: list }),

      completeOnboarding: () => set({ completed: true }),

      resetOnboarding: () =>
        set({
          completed: false,
          keywords: [],
        }),
    }),
    {
      name: 'onboarding',
    }
  )
);
