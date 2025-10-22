import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export const uploadPictureToS3 = async (bucketLoc: string, filename: string, contentType: string) => {
  try {
    const bucket = 'bookclub-jr07251989'

    if (!filename || !contentType) {
      return { error: 'Missing filename or contentType' }
    }

    const key = `${bucketLoc}/${Date.now()}-${filename}`

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

    const publicUrl = `https://${bucket}.s3.amazonaws.com/${key}`
    return { uploadUrl, publicUrl }
  } catch (error) {
    console.error('Error generating upload url: ', error)
    return { error: 'Failed to create upload url' }
  }
}