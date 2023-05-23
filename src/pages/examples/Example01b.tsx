import { createStore } from "lenrix";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { core } from "../../core";
import { createPokemonService } from "./pokemon/PokemonService";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { PokemonName } from "./pokemon/Pokemon";
import { filter, first, of } from "rxjs";

const route = core.router.examples["1"].b;

const pokemonService = createPokemonService();

// Demonstrates "loadFromFields()"

const initialState: { pokemonName?: PokemonName } = {};

const store = createStore(initialState)
  .actionTypes<{ setPokemonName: PokemonName }>()
  .updates({
    setPokemonName: (pokemonName) => (state) => ({ ...state, pokemonName }),
  })
  .loadFromFields(["pokemonName"], {
    pokemon: ({ pokemonName }) =>
      pokemonName === undefined
        ? of(null)
        : pokemonService.findByName(pokemonName),
  });

route.match$
  .pipe(filter(Boolean))
  .subscribe(() =>
    store.dispatch({ setPokemonName: "pikachu" as PokemonName })
  );

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) =>
  !pokemon ? null : <PokemonDisplay pokemon={pokemon} />
);

export const Example01b = () => (
  <Route match={route}>
    <h2>Example 1b</h2>
    <Pokemon />
  </Route>
);
