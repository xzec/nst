import { NestFactory } from '@nestjs/core'
import { AppModule } from '~/app.module'
import { ConfigService } from '@nestjs/config'
import type { Env } from '~/config/env.schema'
import { swagger } from '~/config/swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  swagger(app)

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}

void bootstrap()
