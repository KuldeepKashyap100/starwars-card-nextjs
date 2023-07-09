import type { NextApiRequest, NextApiResponse } from "next";

import { getCharacters } from "@/models/character";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  try {
    const characters = await getCharacters();

    res.status(200).json({ status: "success", characters });
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error?.message || "something went wrong."
    });
  }
}
