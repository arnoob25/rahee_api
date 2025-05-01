import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { HotelModule } from "./hotel/hotel.module";
import { CommonModule } from "./common/common.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { envSchema } from "./common/config.validation";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>("NODE_ENV") === "production";

        return {
          autoSchemaFile: join(process.cwd(), "src/schema.gql"),
          graphiql: !isProduction,
          introspection: !isProduction,
          sortSchema: true,
          formatError: isProduction
            ? (error) => ({
                message: error.message,
                extensions: {
                  code: error.extensions?.code,
                  statusCode: error.extensions?.statusCode,
                },
              })
            : undefined,
        };
      },
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_CONNECTION_STRING") ?? "",
      }),
    }),

    HotelModule,
    CommonModule,
  ],
})
export class AppModule {}
