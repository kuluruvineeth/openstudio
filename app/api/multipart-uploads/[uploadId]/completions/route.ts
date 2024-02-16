import {  finishMultipartUpload } from '@/lib/s3';
import { NextRequest,NextResponse } from 'next/server';

export default async function POST(req:NextRequest,{params}:{params: { uploadId: string | number }}) {
    const { fileKey, parts } = await req.json();

    const response = await finishMultipartUpload({
        fileKey,
        uploadId: params.uploadId, // Add a comma here
        parts
    });

    return NextResponse.json({  }, { status: 200 });
    
}
