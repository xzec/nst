import supertest from 'supertest'
import { Test } from '@nestjs/testing'
import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { DrizzleModule } from '~/drizzle'
import { DRIZZLE_TOKEN, type DrizzleDb } from '~/drizzle/drizzle.config'
import { UserModule } from '~/user/user.module'
import { seedDatabase, migrateDatabase } from '@workspace/database/utils'
import { users } from '@workspace/database'
import type TestAgent from 'supertest/lib/agent'

describe('User', () => {
  let container: StartedPostgreSqlContainer
  let app: INestApplication
  let request: TestAgent
  let seededUserId: string

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

    const db = app.get<DrizzleDb>(DRIZZLE_TOKEN)
    const [seededUser] = await db.select().from(users).limit(1)
    seededUserId = seededUser!.id
  })

  it(`GET /users/{id}`, async () => {
    const res = await request.get(`/users/${seededUserId}`).expect(200)
    expect(res.body).toEqual({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.objectContaining({ id: seededUserId }),
    })
  })

  afterAll(async () => {
    await app.close()
    await container.stop({ remove: false })
  })
})
