import { NextResponse } from "next/server"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api"

export function apiSuccess<T>(
  data: T,
  message?: string,
  status = 200
) {
  const body: ApiSuccessResponse<T> = {
    status: "success",
    data,
    ...(message ? { message } : {}),
  }

  return NextResponse.json(body, { status })
}

export function apiError(
  code: string,
  message: string,
  status = 400
) {
  const body: ApiErrorResponse = {
    status: "error",
    code,
    message,
  }

  return NextResponse.json(body, { status })
}
