// server/nest/vercel.ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import serverlessExpress from '@vendia/serverless-express'
import { Handler, Callback, Context } from 'aws-lambda'

let server: Handler

async function bootstrap(): Promise<Handler> {
  if (!server) {
    const app = await NestFactory.create(AppModule)
    await app.init()
    const expressApp = app.getHttpAdapter().getInstance()
    server = serverlessExpress({ app: expressApp })
  }
  return server
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const s = await bootstrap()
  return s(event, context, callback)
}
