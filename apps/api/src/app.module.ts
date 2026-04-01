import { Module } from '@nestjs/common'
import { AppController } from '~/app.controller'
import { AppService } from '~/app.service'
import { DrizzleModule } from '~/drizzle'

@Module({
  imports: [
    DrizzleModule.forRoot({
      connectionString: process.env.DATABASE_URL!,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
