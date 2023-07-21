import S3 from "aws-sdk/clients/s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3({
  apiVersion: "2006-03-01",
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  signatureVersion: "v4",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: NextRequest) {

  console.log(process.env.BUCKET_NAME)
  const post = await s3.createPresignedPost({
      Bucket: process.env.BUCKET_NAME,
      Fields: {
          key: 'files/' + req.nextUrl.searchParams.get("file"),
          'Content-Type': req.nextUrl.searchParams.get("fileType"),
      },
      Expires: 60,
      Conditions: [
          ['content-length-range', 0, 1048576], // up to 1 MB
      ],
  })

  return NextResponse.json(post)
};
