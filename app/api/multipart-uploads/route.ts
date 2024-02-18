import { NextRequest, NextResponse } from "next/server";
import { createMultipartUpload } from "@/lib/s3";

export async function POST(req: NextRequest) {
  //   if (req.method !== 'POST') {
  //     res.status(405).json({ message: 'Method Not Allowed' });
  //     return;
  //   }

  try {
    console.log(req);
    const file = await req.json();

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // const blob = file as Blob;
    // const buffer = Buffer.from(await blob.arrayBuffer());
    // const fileId = randomUUID();
    // const key = `${user.id}/${fileId}`;

    const { uploadId, fileKey } = await createMultipartUpload({
      filename: file.filename,
    });

    return NextResponse.json({ uploadId, fileKey }, { status: 200 });
  } catch (error) {
    console.error("Error processing multipart upload:", error);
    return NextResponse.json(
      { error: "Could not upload file" },
      { status: 500 }
    );
  }
}
