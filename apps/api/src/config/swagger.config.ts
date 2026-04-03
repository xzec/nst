import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { INestApplication } from '@nestjs/common'
import { apiReference } from '@scalar/nestjs-api-reference'

export function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Nest 🤝 Drizzle')
    .setDescription('The users and orders API')
    .setVersion('1.0')
    .build()

  const document = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('swagger', app, document)

  app.use(
    '/docs',
    apiReference({
      content: document,
    })
  )
}
