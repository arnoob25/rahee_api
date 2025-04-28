import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GraphqlExceptionFilter } from "./common/filters/graphql-exception.filter";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new GraphqlExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
