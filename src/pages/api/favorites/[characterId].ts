import type { NextApiRequest, NextApiResponse } from "next";

import { deleteCharacterToFavorites } from "@/models/favorites";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res
      .status(405)
      .send({ status: "error", message: "Only DELETE requests allowed" });
    return;
  }

  try {
    // currently we have only one user but i made it extensible
    const { userId = "1", characterId } = req.query;
    await deleteCharacterToFavorites(userId as string, characterId as string);

    res
      .status(200)
      .json({ status: "success", message: "deleted character from favorites" });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error?.message || "something went wrong."
    });
    console.log(error);
  }
}
