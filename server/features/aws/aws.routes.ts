import { type Context, Hono } from "hono";
import { HonoEnv } from "../../types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { uploadPictureToS3 } from "../../lib/aws";

export const awsRoutes = new Hono<HonoEnv>()
  .use(authMiddleware)
  .post('/upload-avatar', async (c: Context) => {
    const { filename, contentType } = await c.req.json()
    const { uploadUrl, publicUrl } = await uploadPictureToS3("avatars", filename, contentType)
    return c.json({ uploadUrl, publicUrl })
  })
  .post('/upload-bookclub-image', async (c: Context) => {
    const { filename, contentType } = await c.req.json()
    const { uploadUrl, publicUrl } = await uploadPictureToS3("bookclub-images", filename, contentType)
    return c.json({ uploadUrl, publicUrl })
  })

export default awsRoutes