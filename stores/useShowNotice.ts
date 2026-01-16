import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NoticeState {
  isDismissed: boolean;
  onClose: () => void;
}

export const useShowNotice = create<NoticeState>()(
  persist(
    (set) => ({
      isDismissed: false,
      onClose: () => set({ isDismissed: true }),
    }),
    {
      name: 'ai_notice_dismissed', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);