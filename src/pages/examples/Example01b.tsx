import { createStore } from "lenrix";
import { debounceTime, filter, map, of, pipe, switchMap } from "rxjs";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { ExampleDescription } from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";
import { router } from "../../router/Router";

const route = router.examples["1"].b;

const pokemonService = createPokemonService();

interface State {
  searchedPokemonName: string;
}

const store = createStore({ searchedPokemonName: "" } as State)
  .actionTypes<{ inputValueChanged: string }>()
  .updates({
    inputValueChanged: (value) => (state) => ({
      ...state,
      searchedPokemonName: value,
    }),
  })
  .loadFromFields$(["searchedPokemonName"], {
    pokemon: pipe(
      map((_) => _.searchedPokemonName),
      map((_) => _.trim().toLowerCase()),
      debounceTime(500),
      switchMap((_) =>
        _.length === 0
          ? of("empty input" as const)
          : pokemonService.findByName(_)
      )
    ),
  });

const onNameInputValueChange = (e: any) =>
  store.dispatch({ inputValueChanged: e.target.value });

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) =>
  pokemon === "empty input" ? null : pokemon === null ? (
    <h4>Pokemon not found</h4>
  ) : (
    <PokemonDisplay pokemon={pokemon} />
  )
);

export const Example01b = () => (
  <Route match={route}>
    <h2>Example 1b</h2>
    <Description />
    <input
      type="text"
      onChange={onNameInputValueChange}
      style={{
        width: "300px",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
      }}
      placeholder="Enter pokemon name"
    />
    <Pokemon />
  </Route>
);

const Description = () => (
  <ExampleDescription>
    <p>
      When input value changes, the value is stored in a field. We then treat
      changes of this field's value as a stream, debouncing and mapping to a
      stream of API results.
    </p>
    <ExampleLink filename="Example01b.tsx" />
  </ExampleDescription>
);
