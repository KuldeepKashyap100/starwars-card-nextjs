import { addCharacterToFavorites } from "@/models/favorites";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res
      .status(405)
      .send({ status: "error", message: "Only POST requests allowed" });
    return;
  }

  try {
    // currently we have only one user but i made it extensible
    const { userId = "1", characterId } = req.body;
    await addCharacterToFavorites(userId, characterId);
    res
      .status(201)
      .json({ status: "success", message: "added character to favorites" });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error?.message || "something went wrong."
    });
    console.log(error);
  }
}
