import { create } from "zustand";

interface AppState {
  budgetUsed: number;
  setBudgetUsed: (value: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  budgetUsed: 0,
  setBudgetUsed: (value) => set({ budgetUsed: value })
}));
