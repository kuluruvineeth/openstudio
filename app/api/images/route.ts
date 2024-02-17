import { listBucketFiles } from "@/lib/s3";
import mime from "mime-types";
import { NextRequest, NextResponse } from "next/server";

export interface UploadedImage {
  title: string;
  source: string;
  size: number;
}

// the S3 Object field types are defined as string | null so we have to be a little defensive when using
// those objects in our TypeScript code

export async function GET(
  req: NextRequest,
  res: NextResponse<UploadedImage[]>
) {
  const images = (await listBucketFiles())
    .filter(
      (s3File) =>
        //   (mime.lookup(s3File?.Key || "") as string).match(/image\//)
        mime.lookup(s3File?.Key || "") as string
    )
    .map((s3File) => ({
      title: s3File.Key || "some image",
      source: `https://dyp4dcgszy8lu.cloudfront.net/${s3File.Key}`,
      size: s3File.Size || 0,
    }));

  return NextResponse.json({ images }, { status: 200 });
}
