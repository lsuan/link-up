import { compare, hash } from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  const hashed = await hash(password, SALT_ROUNDS);
  return hashed;
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const result = await compare(password, hash);
  return result;
};
