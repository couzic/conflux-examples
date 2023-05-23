import { createStore } from "lenrix";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { core } from "../../core";
import { createPokemonService } from "./pokemon/PokemonService";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { filter, first, mergeMap, switchMap } from "rxjs";
import { ExampleDescription } from "./ExampleDescription";

const route = core.router.examples["1"].a;

const pokemonService = createPokemonService();

const store = createStore({}).load({
  pokemon: route.match$.pipe(
    filter(Boolean),
    mergeMap(() => pokemonService.findByName("pikachu"))
  ),
});

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) =>
  pokemon === null ? null : <PokemonDisplay pokemon={pokemon} />
);

export const Example01a = () => (
  <Route match={route}>
    <h2>Example 1a</h2>
    <ExampleDescription>This example</ExampleDescription>
    <Pokemon />
  </Route>
);
