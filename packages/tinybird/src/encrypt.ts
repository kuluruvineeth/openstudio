import { createCipheriv, createDecipheriv, scryptSync } from "crypto";

const ALGORITHM = "aes-256-cbc";

const password = process.env.ENCRYPT_SECRET;
const salt = process.env.ENCRYPT_SALT;

if (password && !salt) throw new Error("Missing TINYBIRD_ENCRYPT_SALT");

const key = password && salt ? scryptSync(password, salt, 32) : undefined; //32 bytes for AES-256
const iv = Buffer.alloc(16, 0); // A fixed IV (all zeros)

export function encrypt(commentedText: string): string {
  if (!key) return commentedText;
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(commentedText, "utf-8"),
    cipher.final(),
  ]);
  return encrypted.toString("hex");
}

export function decrypt(encryptedText: string | null): string {
  if (encryptedText === null) return "";
  if (!key) return encryptedText;
  const encrypted = Buffer.from(encryptedText, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
