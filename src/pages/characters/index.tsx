import CharacterList from "@/components/characterList/CharacterList";
import { ICharacter } from "@/models/character";
import { GetStaticPropsContext } from "next";

export default function CharactersPage({
  characters
}: {
  characters: ICharacter[];
}) {
  return <CharacterList charcters={characters} />;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const response = await fetch(`http://localhost:3000/api/characters`);
  const data = await response.json();

  return {
    props: {
      characters: data?.characters
    }
  };
}
