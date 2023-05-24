import { createStore } from "lenrix";
import { debounceTime, filter, map, of, pipe } from "rxjs";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { router } from "../../router";
import { ExampleDescription } from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";

const route = router.examples["1"].b;

const pokemonService = createPokemonService();

interface State {
  searchedPokemonName?: string;
}

const store = createStore({} as State)
  .actionTypes<{ inputValueChanged: string; setSearchedPokemonName: string }>()
  .pureEpics({
    inputValueChanged: pipe(
      map((inputValue) => inputValue.trim().toLowerCase()),
      filter((inputValue) => inputValue.length > 0),
      debounceTime(500),
      map((inputValue) => ({ setSearchedPokemonName: inputValue }))
    ),
  })
  .updates({
    setSearchedPokemonName: (searchedPokemonName) => (state) => ({
      ...state,
      searchedPokemonName,
    }),
  })
  .loadFromFields(["searchedPokemonName"], {
    pokemon: ({ searchedPokemonName }) =>
      searchedPokemonName === undefined
        ? of(null)
        : pokemonService.findByName(searchedPokemonName),
  });

const onNameInputValueChange = (e: any) =>
  store.dispatch({ inputValueChanged: e.target.value });

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) =>
  !pokemon ? null : <PokemonDisplay pokemon={pokemon} />
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
        color: "#333",
      }}
      placeholder="Enter pokemon name"
    />
    <Pokemon />
  </Route>
);

const Description = () => (
  <ExampleDescription>
    <p>
      Using epics as inspired by{" "}
      <a
        target="__blank"
        href="https://redux-observable.js.org/docs/basics/Epics.html"
      >
        redux-observables
      </a>
      , we debounce input value change events and store the value in the
      "searchedPokemonName" field.
    </p>
    <p>
      Once this field is set, data for that named pokemon is fetched, and a
      loader is displayed in the meantime.
    </p>
    <ExampleLink filename="Example01b.tsx" />
  </ExampleDescription>
);
