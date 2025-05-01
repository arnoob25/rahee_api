import * as Joi from "joi";

export const envSchema = Joi.object({
  PORT: Joi.number().default(3000).required(),

  NODE_ENV: Joi.string().valid("development", "production", "test").required(),

  MONGODB_CONNECTION_STRING: Joi.string().uri().required(),

  CORS_ORIGIN: Joi.string() // validates the list of urls
    .custom((value: string, helpers) => {
      const origins: string[] = value
        .split(",")
        .map((origin: string): string => origin.trim());
      const allValid = origins.every((url: string): boolean =>
        url.startsWith("http")
      );
      if (!allValid) {
        return helpers.error("any.invalid");
      }
      return origins;
    }, "CORS origin validation")
    .required(),
});
