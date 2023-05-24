import { createStore } from "lenrix";
import Select from "react-select";
import { filter, first, map, mergeMap, of } from "rxjs";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { router } from "../../router";
import { PokemonName, PokemonUrl } from "./pokemon/Pokemon";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";
import { ExampleDescription } from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";

const route = router.examples["3"].b;

const pokemonService = createPokemonService();

interface PokemonOption {
  label: PokemonName;
  value: PokemonUrl;
}

const initialState: {
  selectedOption?: PokemonOption | null;
} = {};

const store = createStore(initialState)
  .load({
    pokemonOptions: route.match$.pipe(
      filter(Boolean),
      first(),
      mergeMap(() => pokemonService.listAll()),
      map((list) =>
        list.map((_): PokemonOption => ({ label: _.name, value: _.url }))
      )
    ),
  })
  .actionTypes<{ selectPokemon: PokemonOption | null }>()
  .updates((_) => ({
    selectPokemon: _.focusPath("selectedOption").setValue(),
  }))
  .loadFromFields(["selectedOption"], {
    pokemon: ({ selectedOption }) =>
      !selectedOption
        ? of(null)
        : pokemonService.loadByName(selectedOption.label),
  });

const onPokemonSelected = (option: PokemonOption | null) =>
  store.dispatch({ selectPokemon: option });

const PokemonSelect = loadableComponent(
  store.pick("pokemonOptions", "selectedOption"),
  ({ pokemonOptions, selectedOption }) => (
    <div style={{ width: 300 }}>
      <Select
        placeholder="Select a pokemon"
        options={pokemonOptions}
        value={selectedOption}
        onChange={onPokemonSelected}
      />
    </div>
  )
);

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) =>
  !pokemon ? null : <PokemonDisplay pokemon={pokemon} />
);

export const Example03b = () => (
  <Route match={route}>
    <h2>Example 3b</h2>
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Description />
      <PokemonSelect />
      <Pokemon />
    </div>
  </Route>
);

const Description = () => (
  <ExampleDescription>
    <p>
      Much like the previous example, the only difference is that the select
      options are loaded from the API.
    </p>
    <ExampleLink filename="Example03b.tsx" />
  </ExampleDescription>
);
