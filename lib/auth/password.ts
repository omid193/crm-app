import { hash } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const hashPassword = await hash(password, 12);
  return hashPassword;
}
