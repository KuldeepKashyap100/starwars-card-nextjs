import { ICharacter, IFilm, IVehicle } from "@/models/character";
import styles from "./CharacterCard.module.css";
import { useEffect, useReducer } from "react";
import Loader from "../loader/Loader";
import { useRouter } from "next/router";
import { clientFetch } from "@/util/clientFetch";
import Modal from "../modal/Modal";
import RedCross from "../icons/RedCross";

interface ICharacterCardState {
  character: ICharacter | null;
  isLoading: boolean;
  errorMessage: string;
  isFavorite: boolean;
}

interface IAction {
  type: string;
  payload?: Partial<ICharacterCardState>;
}

const characterCardReducer = (state: ICharacterCardState, action: IAction) => {
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

export default function CharacterCard() {
  const [{ isLoading, isFavorite, character, errorMessage }, dispatch] =
    useReducer(characterCardReducer, {
      character: null,
      isLoading: false,
      errorMessage: "",
      isFavorite: false
    });
  const router = useRouter();

  const startLoader = () => dispatch({ type: "stopLoading" });
  const stopLoader = () => () => dispatch({ type: "stopLoading" });
  const updateErrorMessage = (errorMessage: string) =>
    dispatch({ type: "error", payload: { errorMessage } });

  const addCharacterToFavorites = async (characterId: string) => {
    const response = await clientFetch(
      "/api/favorites/new",
      startLoader,
      stopLoader,
      updateErrorMessage,
      {
        method: "POST",
        body: JSON.stringify({
          characterId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status !== "success") return;
    dispatch({ type: "updateState", payload: { isFavorite: true } });
  };

  const removeCharcterFromFavorites = async (characterId: string) => {
    const response = await clientFetch(
      `/api/favorites/${characterId}`,
      startLoader,
      stopLoader,
      updateErrorMessage,
      {
        method: "DELETE"
      }
    );

    if (response?.status !== "success") return;
    dispatch({ type: "updateState", payload: { isFavorite: false } });
  };

  const favoriteBtnHandler = (characterId: string) => {
    if (!characterId)
      updateErrorMessage(
        `Failed to ${
          isFavorite ? "remove" : "add"
        } character from favorites, characterId is missing.`
      );

    if (!isFavorite) return addCharacterToFavorites(characterId);
    removeCharcterFromFavorites(characterId);
  };

  const isCharacterPresentInFavorites = async (characterId: string) => {
    const response = await clientFetch(
      `/api/favorites`,
      startLoader,
      stopLoader,
      updateErrorMessage
    );

    if (response?.status !== "success") return;

    return response.characters.find(
      (favoriteCharacter: Partial<ICharacter>) =>
        favoriteCharacter?.id === characterId
    )
      ? true
      : false;
  };

  const updateFavoriteStatus = async (characterId: string) => {
    const isFavorite = await isCharacterPresentInFavorites(characterId);
    dispatch({
      type: "updateState",
      payload: { isFavorite }
    });
  };

  const fetchCharacter = async (characterId: string) => {
    const response = await clientFetch(
      `/api/characters/${characterId}`,
      startLoader,
      stopLoader,
      updateErrorMessage
    );

    if (response?.status !== "success") return;
    dispatch({
      type: "updateState",
      payload: { character: response?.character }
    });
  };

  useEffect(() => {
    const { characterId } = router.query;
    if (!characterId) return;

    fetchCharacter(characterId as string);
    updateFavoriteStatus(characterId as string);
  }, [router?.isReady]);

  if (!character) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.characterCard}>
        <div className={styles.divider}></div>

        <div className={styles.characterTitle}>{character?.name}</div>
        <div className={styles.divider}></div>

        {character?.species && (
          <div>
            <div className={styles.label}>Species </div>
            <div className={styles.value}>{character?.species}</div>
          </div>
        )}

        {character?.homeworld && (
          <div>
            <div className={styles.label}>Homeworld </div>
            <div className={styles.value}>{character?.homeworld}</div>
          </div>
        )}

        {character?.birthYear && (
          <div>
            <div className={styles.label}>Birth Year </div>
            <div className={styles.value}>{character?.birthYear}</div>
          </div>
        )}

        {character?.vehicles && (
          <VehicleSection title="Vehicles" vehicles={character?.vehicles} />
        )}

        {character?.starships && (
          <VehicleSection title="Starships" vehicles={character?.starships} />
        )}

        {character?.films && <FilmSection films={character?.films} />}

        <button
          className="mt-2 animate-fade rounded-lg bg-[#00238C]  py-2 px-4 text-st1 font-semibold text-white"
          onClick={() => favoriteBtnHandler(character?.id || "")}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      </div>

      {isLoading && <Loader />}
      {errorMessage.length > 0 && (
        <Modal
          onClose={() =>
            dispatch({ type: "updateState", payload: { errorMessage: "" } })
          }
        >
          <RedCross className="h-8 w-8 mr-4" />
          <div className={styles.errorMessage}>{errorMessage}</div>
        </Modal>
      )}
    </div>
  );
}

function FilmSection({ films }: { films: IFilm[] }) {
  return (
    <div>
      <div className={styles.label}>Films </div>
      <div className={styles.value}>
        {films.map((film: IFilm, filmIdx: number) => (
          <div key={filmIdx} className={styles.section}>
            <div>
              <span className={styles.subLabel}>Title: </span>
              <span>{film?.title}</span>
            </div>
            <div>
              <span className={styles.subLabel}>ReleaseDate:</span>
              <span>{film?.releaseDate}</span>
            </div>
            <div>
              <span className={styles.subLabel}>Director: </span>
              <span>{film?.director}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VehicleSection({
  vehicles,
  title
}: {
  vehicles: IVehicle[];
  title: string;
}) {
  return (
    <div>
      <div className={styles.label}>{title} </div>
      <div className={styles.value}>
        {vehicles.map((vehicle: IVehicle, vehicleIdx: number) => (
          <div key={vehicleIdx} className={styles.section}>
            <div>
              <span className={styles.subLabel}>Name: </span>
              <span>{vehicle?.name}</span>
            </div>
            <div>
              <span className={styles.subLabel}>Manufacturer:</span>
              <span>{vehicle?.manufacturer}</span>
            </div>
            <div>
              <span className={styles.subLabel}>Model: </span>
              <span>{vehicle?.model}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
