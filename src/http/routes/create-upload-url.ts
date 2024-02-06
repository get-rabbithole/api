import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { r2 } from "../../lib/cloudflare";
import { prisma } from "../../lib/prisma";
import { env } from "../../env";

export async function createUploadURL(app: FastifyInstance) {
  app.post('/uploads', async (request) => {
    const uploadBodySchema = z.object({
      name: z.string().min(1),
      contentType: z.string().regex(/\w+\/[-+.\w]+/),
    })
  
    const { name, contentType } = uploadBodySchema.parse(request.body)
  
    const fileKey = randomUUID().concat('-').concat(name)
  
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: 'rabbithole-dev',
        Key: fileKey,
        ContentType: contentType,
      }),
      { expiresIn: 600 },
    )
  
    const file = await prisma.file.create({
      data: {
        name,
        contentType,
        key: fileKey,
      }
    })

    const downloadUrl = new URL(`/uploads/${file.id}`, env.API_URL).toString()
  
    return { signedUrl, downloadUrl }
  })
}