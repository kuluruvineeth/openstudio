"use client";

import { useState } from "react";
import { Uploader } from "@/lib/uploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FileUploadPage() {
  const [inputValue, setInputValue] = useState("");
  const [uploads, setUploads] = useState<Uploader[]>([]);

  const onFileChanged = (e: any) => {
    const files = [...e.target.files];
    const newUploads = files.map((file) => {
      const uploader = new Uploader({ file })
        .onProgress(({ percentage }: any) => {
          console.log("upload progress for file", file.name, percentage);
        })
        .onComplete((uploadResponse: any) => {
          console.log("upload complete for file", file.name, uploadResponse);
        })
        .onError((error: any) => {
          console.error("upload error for file", file.name, error);
        });

      uploader.start();

      return uploader;
    });

    setUploads((prevUploads) => [...prevUploads, ...newUploads]);
  };

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-red-500">File Upload</h1>
        <Button>File</Button>
        <Input type="file"></Input>
        {/* <Input
          type="file"
          className="sr-only"
          // onChange={onFileChanged}
          // value={inputValue}
          multiple
        >
          File Upload
        </Input> */}
      </div>
    </>
  );
}
