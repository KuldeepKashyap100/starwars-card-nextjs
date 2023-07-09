import type { NextApiRequest, NextApiResponse } from "next";

import { getFavoriteCharacters } from "@/models/favorites";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  try {
    // currently we have only one user but i made it extensible
    const userId = "1";
    const characters = await getFavoriteCharacters(userId);

    res.status(200).json({ status: "success", characters });
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error?.message || "something went wrong."
    });
  }
}
