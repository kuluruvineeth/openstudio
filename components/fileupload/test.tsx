import { useCallback, useEffect, useReducer, useState } from "react";
import { Icons } from "../shared/icons";
import { useDropzone, FileRejection } from "react-dropzone";

import axios from "axios";
import { UploadedImage } from "@/app/api/images/route";
import { Uploader } from "@/lib/uploader";
import { VideoGallery } from "./video-gallery";
import { motion } from "framer-motion";
import { cn, formatBytes } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { HelpPopover } from "../ui/help-popover";
import { Button } from "../ui/button";
import useUploadStore from "@/hooks/use-upload-store";
import { useConfettiStore } from "@/hooks/use-confetti-store";

const API_BASE_URL = "/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

interface FileUpload {
  uploader: Uploader;
  progress: number;
}

interface State {
  files: FileUpload[];
  rejectedFiles: FileRejection[];
  isBulkProcessing: boolean;
  isLoading: boolean;
  hasUploadFailed: boolean;
}

type Action =
  | {
      type: "set_files";
      closeAction: boolean;
      files: FileUpload[];
      rejectedFiles: FileRejection[];
    }
  | { type: "toggle_bulk_processing" }
  | { type: "set_loading"; isLoading: boolean }
  | { type: "set_upload_failed"; hasUploadFailed: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set_files":
      if (action.closeAction) {
        return {
          ...state,
          files: action.files,
          rejectedFiles: state.rejectedFiles,
        };
      }
      return {
        ...state,
        files: action.files.length ? action.files : state.files,
        rejectedFiles: action.rejectedFiles,
      };
    case "toggle_bulk_processing":
      if (state.isBulkProcessing && state.files.length > 1) {
        return {
          ...state,
          isBulkProcessing: !state.isBulkProcessing,
          files: state.files.slice(0, 1),
        };
      }
      return { ...state, isBulkProcessing: !state.isBulkProcessing };
    case "set_loading":
      return {
        ...state,
        isLoading: action.isLoading,
        hasUploadFailed: false,
        rejectedFiles: [],
      };
    case "set_upload_failed":
      return {
        ...state,
        hasUploadFailed: action.hasUploadFailed,
        isLoading: false,
      };
    default:
      return state;
  }
}

export default function Home() {
  const {
    files,
    rejectedFiles,
    isBulkProcessing,
    isLoading,
    hasUploadFailed,
    uploads,
    images,
    completed,
    allUploadsCompleted,
    isOverallLoading,
    updateProgress,
    setFiles,
    setBulkProcessing,
    setLoading,
    setUploadFailed,
    setUploads,
    setImages,
    updateCompleted,
    setIsOverallLoading,
    setIsAllUploadCompleted,
  } = useUploadStore();
  const confetti = useConfettiStore();

  useEffect(() => {
    console.log("completed", completed);
    if (completed > 0 && completed === uploads.length) {
      setIsOverallLoading(false);
      setIsAllUploadCompleted(true);
      confetti.onOpen();
    }
  }, [completed, setIsAllUploadCompleted, setIsOverallLoading, uploads]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setUploads(
        acceptedFiles.map((file: any) => ({
          uploader: new Uploader({ file })
            .onProgress(({ percentage }: any) => {
              updateProgress(file.name, percentage);
            })
            .onComplete((newImage: any) => {
              updateCompleted();
              setImages([newImage]);
            })
            .onError((error: any) => {
              console.error("upload error", error);
            }),
          progress: 0,
        }))
      );
      console.log(uploads);
    },
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [] },
    maxFiles: isBulkProcessing ? 10 : 1,
    multiple: isBulkProcessing,
    maxSize: 256 * 1024 * 1024 * 1024, // 256GB
    onDrop,
  });

  useEffect(() => {
    const fetchImages = async () => {
      const response = await api.request({
        url: `/images`,
        method: "GET",
      });

      setImages(response.data.images);
    };

    fetchImages();
  }, []);

  const uploadClicked = () => {
    if (!uploads.length) {
      return;
    }
    setIsOverallLoading(true);

    uploads.forEach((upload: any) => upload.uploader.start());
  };

  return (
    <div className="mx-auto max-w-7xl sm:p-6 lg:p-8">
      <VideoGallery videos={images} />
      <motion.div
        key="dropzone"
        layout="position"
        initial="hidden"
        animate="show"
        exit="hidden"
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" },
          },
        }}
        transition={{ duration: 0.3 }}
        className={cn("flex flex-col items-center justify-center w-full")}
      >
        <div className="flex items-center gap-2 mb-4">
          <Switch
            id="bulk-processing"
            onCheckedChange={setBulkProcessing}
            checked={isBulkProcessing}
          />
          <Label htmlFor="bulk-processing">Bulk Processing</Label>
          <HelpPopover contentClassName="max-h-[500px]">
            <article className="prose prose-sm leading-normal">
              <h3 className="text-lg font-semibold">Bulk Processing</h3>
              <p>
                Bulk processing allows to upload multiple files. The current
                limit is to 10 PDF files at once.
              </p>
              <p>
                Upon upload, the bulk processing feature will automatically
                initiate the structuring process for all files. If a structuring
                process encounters an error, it will stop at its current
                pipeline.
              </p>
              <p>
                Please be aware that all structured files are still required to
                pass through the Verification pipeline.
              </p>
            </article>
          </HelpPopover>
        </div>
        <div
          className="border w-full border-dashed	rounded-xl border-slate-300 bg-slate-50 px-24 py-16 2xl:px-32 2xl:py-20 text-slate-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
          {...getRootProps()}
        >
          <input {...getInputProps({ name: "file" })} />
          <div>
            <Icons.upload
              width={40}
              height={40}
              strokeWidth={1.5}
              className="mx-auto text-slate-400"
            />
            <div className="text-center">
              <p>
                Drag & drop or{" "}
                <span className="font-semibold">browse video files</span>
              </p>
              <em className="text-xs text-slate-500">
                {isBulkProcessing ? (
                  <>Video files only (max 10), </>
                ) : (
                  <>One Video file only, </>
                )}
                up to 256GB
              </em>
            </div>
          </div>
        </div>
        {rejectedFiles.length > 0 && (
          <section className="mt-2 w-full flex items-center gap-1">
            <h4 className="font-medium text-red-500 text-sm">Rejected files</h4>
            <HelpPopover
              iconClassName="w-3.5 text-red-500 hover:text-red-700"
              contentClassName="w-full"
            >
              {rejectedFiles.map(({ file, errors }: any) => (
                <div key={file.name}>
                  <div className="flex items-center gap-1 text-slate-600 text-xs w-[402px] 2xl:w-[466px]">
                    <Icons.file className="flex-none" width={12} height={12} />
                    <span className="font-medium truncate overflow-hidden grow">
                      {file.name}
                    </span>
                    <span className="flex-none">
                      ({formatBytes(file.size)})
                    </span>
                  </div>
                  <span className="flex-none flex items-center mb-2 text-red-500">
                    {errors.map((e: any) => (
                      <span key={e.code} className="text-xs">
                        {(e.code === "file-invalid-type" && (
                          <>Invalid file type. Only PDF files are allowed.</>
                        )) ||
                          e.message}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </HelpPopover>
          </section>
        )}
        {uploads.length > 0 && (
          <section className="mt-2 w-full flex flex-col gap-2">
            {uploads.map(
              ({ uploader: { file }, progress }: any, index: any) => (
                <div
                  key={index}
                  className="flex h-16 w-full max-w-[100vw] flex-col justify-center rounded border border-gray-300 px-4 py-2"
                >
                  <div className="flex items-center gap-2 text-gray-500 dark:text-white">
                    <Icons.file size="30" className="shrink-0" />
                    <div className="min-w-0 text-sm">
                      <div className="truncate">{file.name}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                    <div className="grow" />
                    <div className="flex w-12 items-center justify-end text-xs">
                      {!isOverallLoading && !allUploadsCompleted && (
                        <button
                          className="rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setUploads(
                              uploads.filter((_: any, i: number) => i !== index)
                            );
                          }}
                        >
                          <Icons.trash className="shrink-0" />
                        </button>
                      )}

                      {isOverallLoading && <div>{Math.round(progress)}%</div>}
                      {progress === 100 && (
                        <Icons.checkCircle className="shrink-0 text-green-600 dark:text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isOverallLoading && (
                    <div className="relative h-0">
                      <div className="absolute top-1 h-1 w-full text-clip rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full bg-green-700 w-full transition-all duration-300 ease-in-out dark:bg-white"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            )}

            <Button
              disabled={isOverallLoading}
              className={`mt-3 w-full ${
                allUploadsCompleted ? "bg-green-500" : ""
              }`}
              onClick={() => {
                if (allUploadsCompleted) {
                  // Navigate to the gallery
                  // You can use react-router-dom or any other method for navigation
                  // For demonstration purpose, I'm just setting window.location to gallery page
                  window.location.href = "/dashboard/video-gallery";
                } else {
                  // Start the upload process
                  uploadClicked();
                }
              }}
            >
              {isOverallLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : allUploadsCompleted ? (
                // Change the text to indicate navigating to the gallery
                "Go to Gallery"
              ) : (
                "Upload"
              )}
            </Button>

            {hasUploadFailed && (
              <p className="mt-2 text-red-500 text-xs">
                The upload failed. Please try again.
              </p>
            )}
          </section>
        )}
      </motion.div>
    </div>
  );
}

function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "0 Bytes";
  }
  bytes = Number(bytes);
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
