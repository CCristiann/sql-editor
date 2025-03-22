"use server";

import { db } from "./db";

export const runQuery = async (query: string) => {
  try {
    const result = await db.$queryRawUnsafe(query);
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw new Error((err as any).message || "Something went wrong.");
  }
};
