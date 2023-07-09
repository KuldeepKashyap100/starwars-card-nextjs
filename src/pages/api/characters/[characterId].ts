import type { NextApiRequest, NextApiResponse } from "next";

import { getCharacterById } from "@/models/character";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  try {
    const { characterId } = req.query;
    const character = await getCharacterById(characterId as string);

    res.status(200).json({ status: "success", character });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error?.message || "something went wrong."
    });
    console.log(error);
  }
}
