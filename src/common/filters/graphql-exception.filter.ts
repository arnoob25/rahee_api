import { Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ApolloError } from "apollo-server-errors";

type ErrorCodeMapping = {
  [statusCode: number]: string;
};

interface ErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  [key: string]: any;
}

@Catch()
export class GraphqlExceptionFilter implements ExceptionFilter {
  private readonly errorCodeMapping: ErrorCodeMapping = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    429: "TOO_MANY_REQUESTS",
    500: "INTERNAL_SERVER_ERROR",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
  };

  catch(exception: unknown): void {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse() as ErrorResponse;
      const code = this.errorCodeMapping[status] || "INTERNAL_SERVER_ERROR";

      let message: string;
      if (typeof response === "string") {
        message = response;
      } else if (Array.isArray(response.message)) {
        message = response.message.join("; ");
      } else if (typeof response.message === "string") {
        message = response.message;
      } else {
        message = `An error occurred with status ${status}`;
      }

      const extensions = {
        statusCode: status,
        code,
        timestamp: new Date().toISOString(),
      };

      throw new ApolloError(message, code, extensions);
    } else if (exception instanceof Error) {
      // Handle non-HTTP errors but with proper error information
      const message = exception.message || "An unexpected error occurred";

      const extensions = {
        statusCode: 500,
        code: "INTERNAL_SERVER_ERROR",
        timestamp: new Date().toISOString(),
      };

      throw new ApolloError(message, "INTERNAL_SERVER_ERROR", extensions);
    } else {
      // Handle completely unknown errors
      throw new ApolloError(
        "An unexpected error occurred",
        "INTERNAL_SERVER_ERROR",
        {
          statusCode: 500,
          timestamp: new Date().toISOString(),
        }
      );
    }
  }
}
