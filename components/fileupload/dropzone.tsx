"use client";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// import { useStepStore } from "@/lib/store";
import { cn, formatBytes } from "@/lib/utils";
import { useCallback, useReducer } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { UploadInfo } from "@/types";
import { HelpPopover } from "@/components/ui/help-popover";
import { motion } from "framer-motion";

interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  updateUploadInfos: (uploadInfos: UploadInfo) => void;
}

interface State {
  files: File[];
  rejectedFiles: FileRejection[];
  isBulkProcessing: boolean;
  isLoading: boolean;
  hasUploadFailed: boolean;
}

type Action =
  | {
      type: "set_files";
      closeAction: boolean;
      files: File[];
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

type SettledResult = {
  status: "fulfilled" | "rejected";
  value?: {
    message: {
      filename: string;
      id: string;
    };
    reason?: any;
  };
};

export function Dropzone({ className, updateUploadInfos }: DropzoneProps) {
  const [state, dispatch] = useReducer(reducer, {
    files: [],
    rejectedFiles: [],
    isBulkProcessing: false,
    isLoading: false,
    hasUploadFailed: false,
  });

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/pipelines/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.status !== 201) {
      throw new Error(data.message);
    }

    return data;
  }

  async function uploadFiles(files: File[]) {
    dispatch({ type: "set_loading", isLoading: true });

    const results = await Promise.allSettled([
      ...files.map(uploadFile),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);

    const success = results.filter(
      (result) => result.status === "fulfilled"
    ) as SettledResult[];

    const failed = results.filter(
      (result) => result.status === "rejected"
    ) as SettledResult[];

    updateUploadInfos({
      isBulkProcess: state.isBulkProcessing,
      successIds: success
        .filter((result) => result.value)
        .map((result) => result.value!.message.id),
    });

    if (failed.length) {
      dispatch({ type: "set_upload_failed", hasUploadFailed: true });
    } else {
      if (state.isBulkProcessing) {
        const successIds = success
          .filter((result) => result.value)
          .map((result) => result.value!.message.id);

        fetch("/api/pipelines/bulk-processing", {
          method: "POST",
          body: JSON.stringify({ ids: successIds }),
        }).catch((err) => console.error(err));
      }
      dispatch({ type: "set_loading", isLoading: false });
      //   useStepStore.setState({ status: "complete" });
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      dispatch({
        type: "set_files",
        closeAction: false,
        files: acceptedFiles,
        rejectedFiles,
      });
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/octet-stream": [".pdf"],
    },
    maxFiles: state.isBulkProcessing ? 10 : 1,
    multiple: state.isBulkProcessing,
    maxSize: 256 * 1024 * 1024 * 1024, // 256GB
    onDrop,
  });

  const progress: any = 10;
  return (
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
      className={cn(className, "flex flex-col items-center justify-center")}
    >
      <div className="flex items-center gap-2 mb-4">
        <Switch
          id="bulk-processing"
          onCheckedChange={() => dispatch({ type: "toggle_bulk_processing" })}
          checked={state.isBulkProcessing}
        />
        <Label htmlFor="bulk-processing">Bulk Processing</Label>
        <HelpPopover contentClassName="max-h-[500px]">
          <article className="prose prose-sm leading-normal">
            <h3 className="text-lg font-semibold">Bulk Processing</h3>
            <p>
              Bulk processing allows to upload multiple files. The current limit
              is to 10 PDF files at once.
            </p>
            <p>
              Upon upload, the bulk processing feature will automatically
              initiate the structuring process for all files. If a structuring
              process encounters an error, it will stop at its current pipeline.
            </p>
            <p>
              Please be aware that all structured files are still required to
              pass through the Verification pipeline.
            </p>
          </article>
        </HelpPopover>
      </div>
      <div
        className="border border-dashed	rounded-xl border-slate-300 bg-slate-50 px-24 py-16 2xl:px-32 2xl:py-20 text-slate-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
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
              Drag & drop or <span className="font-semibold">browse files</span>
            </p>
            <em className="text-xs text-slate-500">
              {state.isBulkProcessing ? (
                <>PDF files only (max 10), </>
              ) : (
                <>One PDF file only, </>
              )}
              up to 5MB
            </em>
          </div>
        </div>
      </div>
      {state.rejectedFiles.length > 0 && (
        <section className="mt-2 w-full flex items-center gap-1">
          <h4 className="font-medium text-red-500 text-sm">Rejected files</h4>
          <HelpPopover
            iconClassName="w-3.5 text-red-500 hover:text-red-700"
            contentClassName="w-full"
          >
            {state.rejectedFiles.map(({ file, errors }) => (
              <div key={file.name}>
                <div className="flex items-center gap-1 text-slate-600 text-xs w-[402px] 2xl:w-[466px]">
                  <Icons.file className="flex-none" width={12} height={12} />
                  <span className="font-medium truncate overflow-hidden grow">
                    {file.name}
                  </span>
                  <span className="flex-none">({formatBytes(file.size)})</span>
                </div>
                <span className="flex-none flex items-center mb-2 text-red-500">
                  {errors.map((e) => (
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
      {state.files.length > 0 && (
        <section className="mt-2 w-full">
          {state.files.map((file, index) => (
            // <div
            //   title={file.name}
            //   key={file.name}
            //   className="flex items-center gap-1 text-slate-600 text-xs mb-0.5 w-[402px] 2xl:w-[466px]"
            // >
            //   <Icons.file className="flex-none" width={12} height={12} />
            //   <span className="font-medium truncate overflow-hidden grow">
            //     {file.name}
            //   </span>
            //   <span className="flex-none flex items-center gap-0.5">
            //     ({formatBytes(file.size)})
            //     <Icons.close
            //       onClick={() => {
            //         dispatch({
            //           type: "set_files",
            //           closeAction: true,
            //           files: state.files.filter((_, i) => i !== index),
            //           rejectedFiles: [],
            //         });
            //       }}
            //       width={12}
            //       height={12}
            //       className="cursor-pointer hover:text-red-500"
            //     />
            //   </span>
            // </div>
            <div
              key={index}
              className="flex h-16 w-96 max-w-[100vw] flex-col justify-center rounded border border-gray-300 px-4 py-2"
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
                <div className="flex w-12 justify-end text-xs">
                  {progress === "PENDING" ? (
                    <button
                      className="rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      //   onClick={() => {
                      //     void onChange?.(
                      //       value.filter((_, index) => index !== i)
                      //     );
                      //   }}
                      onClick={() => {
                        dispatch({
                          type: "set_files",
                          closeAction: true,
                          files: state.files.filter((_, i) => i !== index),
                          rejectedFiles: [],
                        });
                      }}
                    >
                      <Icons.trash className="shrink-0" />
                    </button>
                  ) : progress === "ERROR" ? (
                    <Icons.warning className="shrink-0 text-red-600 dark:text-red-400" />
                  ) : progress !== "COMPLETE" ? (
                    <div>{Math.round(progress)}%</div>
                  ) : (
                    <Icons.checkCircle className="shrink-0 text-green-600 dark:text-gray-400" />
                  )}
                </div>
              </div>
              {/* Progress Bar */}
              {typeof progress === "number" && (
                <div className="relative h-0">
                  <div className="absolute top-1 h-1 w-full text-clip rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-gray-400 w-full transition-all duration-300 ease-in-out dark:bg-white"
                      style={{
                        width: progress ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            disabled={state.isLoading}
            className="mt-3 w-full"
            onClick={() => uploadFiles(state.files)}
          >
            {state.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload
          </Button>
          {state.hasUploadFailed && (
            <p className="mt-2 text-red-500 text-xs">
              The upload failed. Please try again.
            </p>
          )}
        </section>
      )}
    </motion.div>
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
