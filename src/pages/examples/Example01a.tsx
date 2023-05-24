import { createStore } from "lenrix";
import { filter, first, mergeMap } from "rxjs";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { router } from "../../router";
import { ExampleDescription } from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";

const route = router.examples["1"].a;

const pokemonService = createPokemonService();

const store = createStore({}).load({
  pokemon: route.match$.pipe(
    filter(Boolean), // Positive matches only => route is entered
    first(),
    mergeMap(() => pokemonService.findByName("pikachu"))
  ),
});

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) => (
  <PokemonDisplay pokemon={pokemon!} />
));

export const Example01a = () => (
  <Route match={route}>
    <h2>Example 1a</h2>
    <Description />
    <Pokemon />
  </Route>
);

const Description = () => (
  <ExampleDescription>
    <p>
      When route is first entered, we fetch the data for the pokemon named
      "pikachu" and store that data in the "pokemon" field.
    </p>
    <p>While pokemon data is being loaded, a spinner is displayed.</p>
    <ExampleLink filename="Example01a.tsx" />
  </ExampleDescription>
);
