import { compare, hash } from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  const hashed = await hash(password, SALT_ROUNDS);
  return hashed;
};

export const comparePassword = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  const result = await compare(password, passwordHash);
  return result;
};
