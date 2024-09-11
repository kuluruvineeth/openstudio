import { create } from "zustand";

type AiQueueState = {
  aiQueue: Set<string>;
  pushToAiQueue: (pushIds: string[]) => void;
  removeFromAiQueue: (removeId: string) => void;
  isInAiQueue: (id: string) => boolean;
};

export const useAiQueueStore = create<AiQueueState>((set, get) => ({
  aiQueue: new Set([]),

  pushToAiQueue: (pushIds: string[]) => {
    const currentIds = new Set(get().aiQueue);
    pushIds.forEach((id) => currentIds.add(id));
    set({ aiQueue: currentIds });
  },

  removeFromAiQueue: (removeId: string) => {
    const currentIds = new Set(get().aiQueue);
    currentIds.delete(removeId);
    set({ aiQueue: currentIds });
  },

  isInAiQueue: (id: string) => {
    return get().aiQueue.has(id);
  },
}));
