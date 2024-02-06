import fastify from 'fastify'
import cors from '@fastify/cors'
import { createUploadURL } from './routes/create-upload-url'
import { createDownloadURL } from './routes/create-download-url'

const app = fastify()

app.register(cors, {
  origin: '*',
})

app.register(createUploadURL)
app.register(createDownloadURL)

app.listen({
  port: 3333,
  host: '0.0.0.0',
}).then(() => {
  console.log('🔥 HTTP server running!')
})