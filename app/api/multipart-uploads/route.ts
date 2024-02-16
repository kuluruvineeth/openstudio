import { NextRequest, NextResponse } from "next/server";
import { createMultipartUpload } from "@/lib/s3";

export default async function POST(req: NextRequest) {
  //   if (req.method !== 'POST') {
  //     res.status(405).json({ message: 'Method Not Allowed' });
  //     return;
  //   }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // const blob = file as Blob;
    // const buffer = Buffer.from(await blob.arrayBuffer());
    // const fileId = randomUUID();
    // const key = `${user.id}/${fileId}`;

    const { uploadId, fileKey } = await createMultipartUpload({
      filename: (file as File).name,
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
