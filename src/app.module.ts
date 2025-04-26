import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { UserModule } from "./user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const mongoUri = process.env.MONGODB_CONNECTION_STRING ?? "";
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      graphiql: true,
      sortSchema: true,
    }),
    MongooseModule.forRoot(mongoUri),
    UserModule,
  ],
})
export class AppModule {}
