// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { InferModel, eq } from 'drizzle-orm';
import type { NextApiRequest, NextApiResponse } from 'next'

export type Data = {
  name: string
}

type User = InferModel<typeof users, "select">;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result: User = db.select().from(users).where(eq(users.id, 1)).get();
  res.status(200).json({ name: result.fullName ?? "No name" })
}
