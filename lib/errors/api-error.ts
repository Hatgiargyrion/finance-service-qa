import { NextResponse } from "next/server";

type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

interface ApiErrorOptions {
  code: ErrorCode;
  message: string;
  details?: unknown;
  status: number;
}

export function apiError({
  code,
  message,
  details,
  status,
}: ApiErrorOptions) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details: details ?? null,
      },
    },
    { status }
  );
}