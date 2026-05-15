import { ApiResponse } from "@/lib/api-responses";
import { verifyToken } from "@/lib/auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return ApiResponse.unauthorized("you are not logged in");
  }
  const okToken = await verifyToken(token);

  if (!okToken) {
    return ApiResponse.unauthorized("your token is not write ");
  }

  return NextResponse.json({ user: okToken });
}
