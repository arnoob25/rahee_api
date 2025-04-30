import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string().transform(Number).default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  MONGODB_CONNECTION_STRING: z.string().url(),
  CORS_ORIGIN: z
    .string()
    .transform((val) => val.split(",").map((origin) => origin.trim()))
    .refine((arr) => arr.every((url) => url.startsWith("http")), {
      message: "All CORS origins must be valid URLs",
    }),
});
