import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLOUDFLARE_ENDPOINT: z.string().url(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  API_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)

