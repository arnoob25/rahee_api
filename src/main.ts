import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GraphqlExceptionFilter } from "./common/filters/graphql-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configureService = app.get(ConfigService);
  const port = configureService.get<number>("PORT") ?? 3000;
  const allowedOrigins = configureService.get<string[]>("CORS_ORIGIN");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new GraphqlExceptionFilter());

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      const isAllowed =
        !origin ||
        allowedOrigins?.includes(origin) ||
        /^https:\/\/rahee-web.*\.vercel\.app$/.test(origin); // TODO remove it in production

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });

  await app.listen(port);
}

bootstrap();
