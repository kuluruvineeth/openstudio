import { create } from "zustand";

interface CommentStore {
  selectedComment: string | undefined;
  setSelectedComment: (comment: string | undefined) => void;
  refetchCommentList: ((removedCommentIds?: string[]) => void) | undefined;
  setRefetchCommentList: (
    refetch: ((removedCommentIds?: string[]) => void) | undefined,
  ) => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  selectedComment: undefined,
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  refetchCommentList: undefined,
  setRefetchCommentList: (refetch) => set({ refetchCommentList: refetch }),
}));
