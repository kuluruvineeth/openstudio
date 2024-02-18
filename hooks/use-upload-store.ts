import { create } from "zustand";

import { FileRejection } from "react-dropzone";
import { Uploader } from "@/lib/uploader";
import { UploadedImage } from "@/app/api/images/route";

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
  images: UploadedImage[];
  completed: number;
  allUploadsCompleted: boolean;
  isOverallLoading: boolean;
}

type UploadStoreActions = {
  updateProgress(filename: string, percentage: number): void;
  setFiles(
    files: FileUpload[],
    rejectedFiles: FileRejection[],
    closeAction: boolean
  ): void;
  setBulkProcessing(): void;
  setLoading(isLoading: boolean): void;
  setUploadFailed(hasUploadFailed: boolean): void;
  setUploads(uploads: FileUpload[]): void;
  setImages(images: UploadedImage[]): void;
  updateCompleted(): void;
  setIsOverallLoading(isOverallLoading: boolean): void;
  setIsAllUploadCompleted(isAllCompleted: boolean): void;
};

type UploadStoreActionsKeys = keyof UploadStoreActions;

// const useUploadStore = create<UploadStoreState & UploadStoreActions>((set) => ({
//   files: [],
//   rejectedFiles: [],
//   isBulkProcessing: false,
//   isLoading: false,
//   hasUploadFailed: false,
//   uploads: [],
//   images: [],
//   completed: 0,
//   allUploadsCompleted: false,
//   isOverallLoading: false,
//   updateProgress: (filename: string, percentage: number) =>
//     set((state) => ({
//       uploads: state.uploads.map((upload) =>
//         upload.uploader.file.name === filename
//           ? { ...upload, progress: percentage }
//           : upload
//       ),
//     })),
//   setFiles: (
//     files: FileUpload[],
//     rejectedFiles: FileRejection[],
//     closeAction: boolean
//   ) =>
//     set((state) => ({
//       files: closeAction ? files : files.length ? files : state.files,
//       rejectedFiles: rejectedFiles,
//     })),
//   setBulkProcessing: () =>
//     set((state) => ({
//       isBulkProcessing: !state.isBulkProcessing,
//     })),
//   setLoading: (isLoading: boolean) =>
//     set((state) => ({
//       isLoading: isLoading,
//       hasUploadFailed: false,
//       rejectedFiles: [],
//     })),
//   setUploadFailed: (hasUploadFailed: boolean) =>
//     set((state) => ({
//       hasUploadFailed: hasUploadFailed,
//       isLoading: false,
//     })),
//   setUploads: (uploads: FileUpload[]) =>
//     set((state) => ({
//       uploads: uploads,
//     })),
//   setImages: (images: UploadedImage[]) =>
//     set((state) => ({
//       images: images,
//     })),
//   setCompleted: (completed: number) =>
//     set((state) => ({
//       completed: completed,
//       allUploadsCompleted:
//         state.completed > 0 && completed === state.uploads.length,
//       isOverallLoading:
//         state.completed > 0 && completed === state.uploads.length
//           ? false
//           : state.isOverallLoading,
//     })),
//   setIsOverallLoading: (isOverallLoading: boolean) =>
//     set((state) => ({
//       isOverallLoading: isOverallLoading,
//     })),
//   setIsAllUploadCompleted: (isAllCompleted: boolean) =>
//     set((state) => ({
//       allUploadsCompleted: isAllCompleted,
//     })),
// }));

const useUploadStore = create<UploadStoreState & UploadStoreActions>((set) => ({
  files: [],
  rejectedFiles: [],
  isBulkProcessing: false,
  isLoading: false,
  hasUploadFailed: false,
  uploads: [],
  images: [],
  completed: 0,
  allUploadsCompleted: false,
  isOverallLoading: false,
  updateProgress: (filename, percentage) =>
    set((state) => ({
      uploads: state.uploads.map((upload) =>
        upload.uploader.file.name === filename
          ? { ...upload, progress: percentage }
          : upload
      ),
    })),
  setFiles: (files, rejectedFiles, closeAction) =>
    set((state) => ({
      files: closeAction ? files : files.length ? files : state.files,
      rejectedFiles: rejectedFiles,
    })),
  setBulkProcessing: () =>
    set((state) => ({
      isBulkProcessing: !state.isBulkProcessing,
    })),
  setLoading: (isLoading) =>
    set((state) => ({
      isLoading: isLoading,
      hasUploadFailed: false,
      rejectedFiles: [],
    })),
  setUploadFailed: (hasUploadFailed) =>
    set((state) => ({
      hasUploadFailed: hasUploadFailed,
      isLoading: false,
    })),
  setUploads: (uploads) =>
    set((state) => ({
      uploads: uploads,
    })),
  setImages: (newImages) =>
    set((state) => ({
      images: [...newImages],
    })),
  updateCompleted: () =>
    set((state) => ({
      completed: state.completed + 1,
      allUploadsCompleted:
        state.completed > 0 && state.completed === state.uploads.length,
      isOverallLoading:
        state.completed > 0 && state.completed === state.uploads.length
          ? false
          : state.isOverallLoading,
    })),
  setIsOverallLoading: (isOverallLoading) =>
    set((state) => ({
      isOverallLoading: isOverallLoading,
    })),
  setIsAllUploadCompleted: (isAllCompleted: boolean) =>
    set((state) => ({
      allUploadsCompleted: isAllCompleted,
    })),
}));

export default useUploadStore;
