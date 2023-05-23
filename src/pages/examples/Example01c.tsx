import { createStore } from "lenrix";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { core } from "../../core";
import { createPokemonService } from "./pokemon/PokemonService";
import { filter, map } from "rxjs";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";

const route = core.router.examples["1"].c;

const pokemonService = createPokemonService();

// Demonstrates "loadFromStream()"

const store = createStore({}).loadFromStream(
  route.match$.pipe(
    filter(Boolean),
    map(({ params }) => params["pokemon-name"])
  ),
  {
    pokemon: (pokemonName) => pokemonService.findByName(pokemonName),
  }
);

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) =>
  !pokemon ? null : <PokemonDisplay pokemon={pokemon} />
);

export const Example01c = () => (
  <Route match={route}>
    <h2>Example 1c</h2>
    <Pokemon />
  </Route>
);
