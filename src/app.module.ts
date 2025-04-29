import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { configDotenv } from "dotenv";
import { HotelModule } from "./hotel/hotel.module";
import { CommonModule } from "./common/common.module";

configDotenv();
const isProduction = process.env.NODE_ENV === "production";

const mongoUri = process.env.MONGODB_CONNECTION_STRING ?? "";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      graphiql: !isProduction,
      introspection: !isProduction,
      sortSchema: true,
      formatError: isProduction
        ? (error) => {
            return {
              message: error.message,
              extensions: {
                code: error.extensions?.code,
                statusCode: error.extensions?.statusCode,
              },
            };
          }
        : undefined,
    }),
    MongooseModule.forRoot(mongoUri),
    HotelModule,
    CommonModule,
  ],
})
export class AppModule {}
