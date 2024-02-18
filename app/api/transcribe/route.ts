import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  GetTranscriptionJobCommand,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";
import { NextRequest } from "next/server";

function getClient() {
  return new TranscribeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.access_key_id!,
      secretAccessKey: process.env.access_key_secret!,
    },
  });
}
function createTranscriptionCommand(filename: string) {
  return new StartTranscriptionJobCommand({
    TranscriptionJobName: filename,
    OutputBucketName: process.env.upload_bucket,
    OutputKey: filename + ".transcription",
    IdentifyLanguage: true,
    Media: {
      MediaFileUri: "s3://" + process.env.upload_bucket + "/" + filename,
    },
  });
}
async function createTranscriptionJob(filename: string) {
  const transcribeClient = getClient();
  const transcriptionCommand = createTranscriptionCommand(filename);
  return transcribeClient.send(transcriptionCommand);
}

async function getJob(filename: string) {
  const transcribeClient = getClient();
  let jobStatusResult = null;
  try {
    const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
      TranscriptionJobName: filename,
    });
    jobStatusResult = await transcribeClient.send(
      transcriptionJobStatusCommand
    );
  } catch (e) {}
  return jobStatusResult;
}

async function streamToString(stream: any) {
  const chunks: any = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stream.on("error", reject);
  });
}

async function getTranscriptionFile(filename: string) {
  const transcriptionFile = filename + ".transcription";
  console.log(process.env.bucket_region);
  const s3client = new S3Client({
    region: process.env.bucket_region,
    credentials: {
      accessKeyId: process.env.access_key_id!,
      secretAccessKey: process.env.access_key_secret!,
    },
  });
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.upload_bucket,
    Key: transcriptionFile,
  });
  let transcriptionFileResponse = null;
  try {
    transcriptionFileResponse = await s3client.send(getObjectCommand);
  } catch (e) {}
  if (transcriptionFileResponse) {
    return JSON.parse(
      (await streamToString(
        transcriptionFileResponse.Body
      )) as unknown as string
    );
  }
  return null;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get("filename")!;

  // find ready transcription
  const transcription = await getTranscriptionFile(filename);
  if (transcription) {
    return Response.json({
      status: "COMPLETED",
      transcription,
    });
  }

  // check if already transcribing
  const existingJob = await getJob(filename);

  if (existingJob) {
    return Response.json({
      status: existingJob.TranscriptionJob!.TranscriptionJobStatus,
    });
  }

  // creating new transcription job
  if (!existingJob) {
    const newJob = await createTranscriptionJob(filename);
    return Response.json({
      status: newJob.TranscriptionJob!.TranscriptionJobStatus,
    });
  }

  return Response.json(null);
}
