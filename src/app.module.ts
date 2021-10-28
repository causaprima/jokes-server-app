import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./users/users.module";
import {JokesModule} from "./jokes/jokes.module";
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
      JokesModule,
      UsersModule,
      AuthModule,
      ConfigModule.forRoot( {
        envFilePath: '.env'
      }),
      GraphQLModule.forRoot( {
          installSubscriptionHandlers: true,
          autoSchemaFile: 'schema.gql',
          playground: true,
          introspection: true,
      }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
      })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
