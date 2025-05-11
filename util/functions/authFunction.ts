import bcrypt from "bcrypt";

// hashing the password that was passed using bcrypt
export function HashPassword(password: string): string {
  const salt = 10;
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}
