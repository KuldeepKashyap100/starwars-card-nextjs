import { db } from "@/db/drizzle";
import { InferModel, and, eq } from "drizzle-orm";

import { favorites } from "@/db/schema";
import { getCharacterById } from "./character";
import HttpError from "@/util/HttpError";

type Favorite = InferModel<typeof favorites, "select">;

const isPresentInFavorite = (userId: string, characterId: string) => {
  try {
    const isAlreadyFavorite: Favorite = db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, parseInt(userId)),
          eq(favorites.characterId, parseInt(characterId))
        )
      )
      .get();

    if (isAlreadyFavorite) return true;
    return false;
  } catch (error) {
    console.log(error);
    throw new HttpError(
      "something went wrong while checking favorite. please try again.",
      500
    );
  }
};

export const addCharacterToFavorites = async (
  userId: string,
  characterId: string
) => {
  if (!userId) throw new HttpError("not a valid userId", 400);
  if (!characterId) throw new HttpError("not a valid characterId", 400);
  if (isPresentInFavorite(userId, characterId))
    throw new HttpError("character is already in favorites", 400);

  try {
    const insertedRowId = db
      .insert(favorites)
      .values({ userId: parseInt(userId), characterId: parseInt(characterId) })
      .run().lastInsertRowid;

    console.log("[Favorite Inserted]:::", insertedRowId);

    return insertedRowId;
  } catch (error) {
    console.error(error);
    throw new HttpError("not able to add to favorites", 500);
  }
};

export const deleteCharacterToFavorites = async (
  userId: string,
  characterId: string
) => {
  if (!userId) throw new HttpError("not a valid userId", 400);
  if (!characterId) throw new HttpError("not a valid characterId", 400);
  if (!isPresentInFavorite(userId, characterId))
    throw new HttpError("character not present in favorites", 400);

  try {
    const deletedRowId = db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, parseInt(userId)),
          eq(favorites.characterId, parseInt(characterId))
        )
      )
      .run().lastInsertRowid;

    console.log("[Favorite deleted]:::", deletedRowId);

    return deletedRowId;
  } catch (error) {
    console.error(error);
    throw new HttpError("not able to delete from favorites", 500);
  }
};

export const getFavoriteCharacters = async (userId: string) => {
  try {
    const favoritesOfUser = db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, parseInt(userId)))
      .all();

    const characterIds = favoritesOfUser.map(
      (favorite) => favorite.characterId
    );

    const favoriteCharacters = await Promise.all(
      characterIds.map((characterId) => getCharacterById(String(characterId)))
    );

    const formattedCharacters = favoriteCharacters.map((character) => ({
      id: character?.id,
      name: character?.name,
      species: character?.species,
      homeworld: character?.homeworld
    }));

    return formattedCharacters;
  } catch (error) {
    console.error(error);
    throw new HttpError("not able to fetch from favorites", 500);
  }
};
