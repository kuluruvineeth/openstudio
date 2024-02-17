import { Uploader } from "@/lib/uploader";
import { FileRejection } from "react-dropzone";
import { create } from "zustand";

interface FileUpload {
  uploader: Uploader;
  progress: number;
}

interface UploadStoreState {
  files: FileUpload[];
  rejectedFiles: FileRejection[];
  isBulkProcessing: boolean;
  isLoading: boolean;
  hasUploadFailed: boolean;
  uploads: FileUpload[];
  completed: number;
  images: any[];
  isOverallLoading: boolean;
}

interface UploadStoreActions {
  setFiles: (newFiles: FileUpload[], newRejectedFiles: FileRejection[]) => void;
  toggleBulkProcessing: () => void;
  setLoading: (loading: boolean) => void;
  setUploadFailed: (failed: boolean) => void;
  setUploads: (newUploads: FileUpload[]) => void;
  setCompleted: (completed: number) => void;
  setImages: (newImages: any[]) => void;
  setIsOverallLoading: (loading: boolean) => void;
}

const useUploadStore = create<UploadStoreState & UploadStoreActions>((set) => ({
  files: [],
  rejectedFiles: [],
  isBulkProcessing: false,
  isLoading: false,
  hasUploadFailed: false,
  uploads: [],
  completed: 0,
  images: [],
  isOverallLoading: false,
  setFiles: (newFiles, newRejectedFiles) =>
    set((state) => ({
      ...state,
      files: newFiles,
      rejectedFiles: newRejectedFiles,
    })),
  toggleBulkProcessing: () =>
    set((state) => ({
      ...state,
      isBulkProcessing: !state.isBulkProcessing,
    })),
  setLoading: (loading) =>
    set((state) => ({
      ...state,
      isLoading: loading,
      hasUploadFailed: false,
      rejectedFiles: [],
    })),
  setUploadFailed: (failed) =>
    set((state) => ({
      ...state,
      hasUploadFailed: failed,
      isLoading: false,
    })),
  setUploads: (newUploads) =>
    set((state) => ({
      ...state,
      uploads: newUploads,
    })),
  setCompleted: (completed) =>
    set((state) => ({
      ...state,
      completed,
    })),
  setImages: (newImages) =>
    set((state) => ({
      ...state,
      images: newImages,
    })),
  setIsOverallLoading: (loading) =>
    set((state) => ({
      ...state,
      isOverallLoading: loading,
    })),
}));

export default useUploadStore;
