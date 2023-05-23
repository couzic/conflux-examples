import { Pokemon } from "./Pokemon";

export const PokemonDisplay: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => (
  <div>
    <img src={pokemon.imgUrl} style={{ width: 300 }} />
    <h3>{pokemon.name}</h3>
  </div>
);
