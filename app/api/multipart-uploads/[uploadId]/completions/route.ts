import { finishMultipartUpload, getS3ObjectMetadata } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { uploadId: string | number } }
) {
  const { fileKey, parts } = await req.json();

  const finishResponse = await finishMultipartUpload({
    fileKey,
    uploadId: params.uploadId, // Add a comma here
    parts,
  });

  const objectMetadata = await getS3ObjectMetadata({ filename: fileKey });

  return NextResponse.json(
    {
      title: finishResponse.Key || "",
      source: `https://${process.env.cloudfront_url}/${finishResponse.Key}`,
      size: objectMetadata.ContentLength || 0,
    },
    { status: 200 }
  );
}
