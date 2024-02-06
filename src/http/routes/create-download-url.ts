import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { r2 } from "../../lib/cloudflare";
import { prisma } from "../../lib/prisma";

export async function createDownloadURL(app: FastifyInstance) {
  app.get('/uploads/:id', async (request, reply) => {
    const getFileParamsSchema = z.object({
      id: z.string().cuid(),
    })
  
    const { id } = getFileParamsSchema.parse(request.params)
  
    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id,
      }
    })
  
    const signedUrl = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: 'rabbithole-dev',
        Key: file.key,
      }),
      { expiresIn: 600 },
    )
  
    return reply.redirect(301, signedUrl)
  })
}