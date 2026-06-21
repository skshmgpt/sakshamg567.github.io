import { getRedisClient } from "@/lib/redis";

const KEY = "scratchpad:current";

export async function getScratchpad(): Promise<{
  text: string;
  updatedAt: number;
} | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function setScratchpad(
  text: string
): Promise<{ text: string; updatedAt: number }> {
  const client = await getRedisClient();
  const entry = { text, updatedAt: Date.now() };
  await client.set(KEY, JSON.stringify(entry));
  return entry;
}
