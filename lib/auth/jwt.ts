// lib/auth/jws.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key",
);

export type TokenPayload = {
  userId: number;
  email: string;
  role: string;
};

// ساختن Token
export async function createToken(payload: TokenPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function createSession(payload: TokenPayload) {
  const token = await createToken(payload);

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true, // فقط سرور می‌تونه بخوندش
    secure: true, // فقط روی HTTPS (امن‌تر)
    sameSite: "lax", // محافظت از CSRF
    maxAge: 60 * 60 * 24 * 7, // ۷ روز به ثانیه
    path: "/", // توی همه آدرس‌ها
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  return await verifyToken(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
