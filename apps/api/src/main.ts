import { NestFactory } from '@nestjs/core'
import { AppModule } from '~/app.module'
import { ConfigService } from '@nestjs/config'
import type { Env } from '~/common/config/env.schema'
import { swagger, SCALAR_PATH } from '~/common/config/swagger.config'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  swagger(app)

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })
  const logger = new Logger('App')

  await app.listen(port)

  logger.log(`Running on port :${port}`)
  logger.log(`Live here 👉 http://localhost:${port}${SCALAR_PATH}`)
}

void bootstrap()
