import HttpError from "@/util/HttpError";
import serverFetch from "@/util/serverFetch";

export interface IVehicle {
  name: string;
  manufacturer: string;
  model: string;
}

export interface IStarship extends IVehicle {}

export interface IFilm {
  title: string;
  releaseDate: string;
  director: string;
}

export interface ICharacter {
  id: string;
  name: string;
  birthYear: string;
  gender: string;
  species: string | null;
  homeworld: string | null;
  starships: IStarship[] | null;
  vehicles: IVehicle[] | null;
  films: IFilm[] | null;
}

export const getCharacters = async (): Promise<Partial<ICharacter>[]> => {
  const characters = await serverFetch(
    `${process.env.SWAPI_BASE_URL}/api/people`
  );

  const formattedCharacters = await Promise.all(
    characters?.results?.map(formatCharacter)
  );

  return formattedCharacters;
};

export const getCharacterById = async (
  characterId: string
): Promise<ICharacter | null> => {
  if (!characterId)
    throw new HttpError("character id is absent in route param", 400);

  const character = await serverFetch(
    `${process.env.SWAPI_BASE_URL}/api/people/${characterId}`
  );

  const [species, homeworld, vehicles, starships, films] = await Promise.all([
    getSpecies(character?.species),
    getHomeworld(character?.homeworld),
    getVehicles(character?.vehicles),
    getVehicles(character?.starships),
    getFilms(character?.films)
  ]);
  const id = character?.url.split("/").at(-2);

  return {
    id,
    name: character?.name,
    birthYear: character?.birth_year,
    gender: character?.gener,
    species,
    homeworld,
    starships,
    vehicles,
    films
  };
};

const getVehicles = async (
  vehicleUrls: string[]
): Promise<IVehicle[] | null> => {
  if (!vehicleUrls?.length) return null;

  const vehicles = await fetchDataFromUrls(vehicleUrls);

  const formattedVehicles = vehicles.map((vehicle) => ({
    name: vehicle?.name,
    manufacturer: vehicle?.manufacturer,
    model: vehicle?.model
  }));

  return formattedVehicles;
};

const getFilms = async (filmUrls: string[]): Promise<IFilm[] | null> => {
  if (!filmUrls?.length) return null;

  const films = await fetchDataFromUrls(filmUrls);

  const formattedFilms = films.map((film) => ({
    title: film?.title,
    releaseDate: film?.release_date,
    director: film?.director
  }));

  return formattedFilms;
};

const formatCharacter = async (character: any) => {
  const species = await getSpecies(character.species);
  const homeworld = await getHomeworld(character.homeworld);
  const id = character?.url.split("/").at(-2);

  return {
    id,
    name: character?.name,
    species: species,
    homeworld: homeworld
  };
};

const getSpecies = async (speciesUrls: string[]): Promise<string | null> => {
  if (!speciesUrls?.length) return null;

  // fetching only one species as mentioned in assignment
  const species = await serverFetch(speciesUrls[0]);
  return species?.name || null;
};

const getHomeworld = async (homeworldUrl: string): Promise<string | null> => {
  if (!homeworldUrl) return null;

  const homeworld = await serverFetch(homeworldUrl);
  return homeworld?.name || null;
};

const fetchDataFromUrls = async (urls: string[]): Promise<any[]> => {
  return Promise.all(urls.map((url) => serverFetch(url)));
};
