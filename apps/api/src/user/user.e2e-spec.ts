import supertest from 'supertest'
import { Test } from '@nestjs/testing'
import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { DrizzleModule } from '~/drizzle'
import { UserModule } from '~/user/user.module'
import { seedDatabase, migrateDatabase } from '@workspace/database/utils'
import type TestAgent from 'supertest/lib/agent'

describe('User', () => {
  let container: StartedPostgreSqlContainer
  let app: INestApplication
  let request: TestAgent

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:18').start()
    const containerUri = container.getConnectionUri()
    await migrateDatabase(containerUri)
    await seedDatabase(containerUri)

    const moduleRef = await Test.createTestingModule({
      imports: [DrizzleModule.forRoot({ connectionString: containerUri }), UserModule],
    }).compile()

    app = moduleRef.createNestApplication()

    request = supertest(app.getHttpServer())
    await app.init()
  })

  it(`GET /users/{id}`, async () => {
    const res = await request.get('/users/1').expect(200)
    expect(res.body).toEqual({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.objectContaining({ id: 1 }),
    })
  })

  afterAll(async () => {
    await app.close()
    await container.stop({ remove: false })
  })
})
