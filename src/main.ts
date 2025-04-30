import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GraphqlExceptionFilter } from "./common/filters/graphql-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configureService = app.get(ConfigService);
  const port = configureService.get<number>("PORT") ?? 3000;
  const isProduction =
    configureService.get<string>("NODE_ENV") === "production";

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new GraphqlExceptionFilter());

  if (isProduction) {
    const origins = configureService.get<string[]>("CORS_ORIGIN");

    app.enableCors({
      origin: origins,
      credentials: true,
    });
  }

  await app.listen(port);
}

bootstrap();
