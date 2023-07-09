import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";

import { ICharacter } from "@/models/character";
import styles from "./CharacterList.module.css";
import Loader from "../loader/Loader";
import { clientFetch } from "@/util/clientFetch";

interface ICharacterListState {
  filteredCharacterList: Partial<ICharacter[]>;
  isLoading: boolean;
  errorMessage: string;
  isFavoriteRoute: boolean;
}

interface IAction {
  type: string;
  payload?: Partial<ICharacterListState>;
}

const characterListReducer = (state: ICharacterListState, action: IAction) => {
  switch (action?.type) {
    case "startLoading":
      return { ...state, isLoading: true };
    case "stopLoading":
      return { ...state, isLoading: false };
    case "updateState":
      return { ...state, ...action.payload };
    case "error":
      return {
        ...state,
        isLoading: false,
        errorMessage: action?.payload?.errorMessage || ""
      };
    default:
      throw new Error("Not a valid action");
  }
};

export default function CharacterList({
  charcters
}: {
  charcters: ICharacter[];
}) {
  const [{ filteredCharacterList, isLoading, isFavoriteRoute }, dispatch] =
    useReducer(characterListReducer, {
      filteredCharacterList: [],
      isLoading: false,
      errorMessage: "",
      isFavoriteRoute: false
    });

  const router = useRouter();

  const startLoader = () => dispatch({ type: "stopLoading" });
  const stopLoader = () => () => dispatch({ type: "stopLoading" });
  const updateErrorMessage = (errorMessage: string) =>
    dispatch({ type: "error", payload: { errorMessage } });

  const moreDetailsBtnHandler = (characterId: string) =>
    router.push(`/characters/${characterId}`);

  const removeCharFromFavoritesBtnHandler = async (characterId: string) => {
    if (!characterId)
      updateErrorMessage(
        "Failed to remove character from favorites, characterId is missing."
      );

    const response = await clientFetch(
      `/api/favorites/${characterId}`,
      startLoader,
      stopLoader,
      updateErrorMessage,
      {
        method: "DELETE"
      }
    );

    if (response.status !== "success") return;
    dispatch({
      type: "updateState",
      payload: {
        filteredCharacterList: filteredCharacterList.filter(
          (character) => character?.id !== characterId
        )
      }
    });
  };

  const fetchCharacters = async (isFavoriteRoute: boolean) => {
    const response = await clientFetch(
      `/api/${isFavoriteRoute ? "favorites" : "characters"}`,
      startLoader,
      stopLoader,
      updateErrorMessage,
      {
        method: "GET"
      }
    );

    if (response.status !== "success") return;
    dispatch({
      type: "updateState",
      payload: {
        filteredCharacterList: response?.characters
      }
    });
  };

  useEffect(() => {
    const isFavoriteRoute = router.pathname.includes("favorites");

    dispatch({
      type: "updateState",
      payload: { isFavoriteRoute }
    });
    fetchCharacters(isFavoriteRoute);
  }, []);

  if (!charcters.length) return <Loader />;

  return (
    <div className={styles.characterContainer}>
      {charcters.map((character, characterIdx) => (
        <div key={characterIdx} className={styles.characterCard}>
          <div className={styles.detailsSection}>
            <div className={styles.divider}></div>

            <div className={styles.characterTitle}>{character?.name}</div>
            <div className={styles.divider}></div>

            {character?.species && (
              <div>
                <span className={styles.label}>Species: </span>
                <span className={styles.value}>{character?.species}</span>
              </div>
            )}
            {character?.homeworld && (
              <div>
                <span className={styles.label}>Homeworld: </span>
                <span className={styles.value}>{character?.homeworld}</span>
              </div>
            )}
          </div>

          <button
            className="mt-2 animate-fade rounded-lg bg-[#00238C]  py-2 px-4 text-st1 font-semibold text-white"
            onClick={() => moreDetailsBtnHandler(character?.id || "")}
          >
            More Details
          </button>

          {isFavoriteRoute && (
            <button
              className="mt-2 animate-fade rounded-lg bg-[#00238C]  py-2 px-4 text-st1 font-semibold text-white"
              onClick={() =>
                removeCharFromFavoritesBtnHandler(character?.id || "")
              }
            >
              Remove from Favorites
            </button>
          )}
        </div>
      ))}

      {isLoading && <Loader />}
    </div>
  );
}
