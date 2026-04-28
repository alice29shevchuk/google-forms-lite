import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';

const sharedSchemaPath = join(
  process.cwd(),
  '..',
  'packages',
  'shared',
  'graphql',
  'schema.graphql',
);

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: sharedSchemaPath,
      sortSchema: true,
      playground: true,
    }),
    FormsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}