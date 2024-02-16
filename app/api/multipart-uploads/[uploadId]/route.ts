import { createMultipartUploadPart } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(
  req: NextRequest,
  { params }: { params: { uploadId: string | number } }
) {
  const { fileKey, partNumber } = await req.json();

  const { signedUrl } = await createMultipartUploadPart({
    fileKey,
    uploadId: params.uploadId,
    partNumber,
  });

  return NextResponse.json({ signedUrl }, { status: 201 });
}
