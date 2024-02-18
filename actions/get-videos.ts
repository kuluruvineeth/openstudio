"use server";
import { listBucketFiles } from "@/lib/s3";
import mime from "mime-types";

export const fetchVideos = async () => {
  //   const videos = (await listBucketFiles())
  //     .filter(
  //       (s3File) =>
  //         mime.lookup(s3File?.Key || "") as string
  //     )
  //     .map((s3File) => ({
  //       title: s3File.Key || "some image",
  //       source: `https://${process.env.cloudfront_url}/${s3File.Key}`,
  //       size: s3File.Size || 0,
  //     }));

  //   return videos;
  return [];
};
