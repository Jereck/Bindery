import { type Context, Hono } from "hono";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HonoEnv } from "../../types";
import { authMiddleware } from "../../middlewares/auth.middleware";

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export const uploadAvatarRoute = new Hono<HonoEnv>()
  .use(authMiddleware)
  .post('/', async (c: Context) => {
    try {
      const { filename, contentType } = await c.req.json()
      const bucket = 'bookclub-jr07251989'

      if (!filename || !contentType) {
        return c.json({ error: 'Missing filename or contentType' }, 400)
      }

      const key = `avatars/${Date.now()}-${filename}`

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      })

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

      const publicUrl = `https://${bucket}.s3.amazonaws.com/${key}`
      return c.json({ uploadUrl, publicUrl })
    } catch (error) {
      console.error('Error generating upload url: ', error)
      return c.json({ error: 'Filed to create upload url' }, 500)
    }
  })

export default uploadAvatarRoute