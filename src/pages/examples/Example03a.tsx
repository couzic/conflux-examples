import { createStore } from "lenrix";
import { of } from "rxjs";
import { Route } from "../../common/Route";
import { router } from "../../router";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";
import { PokemonId, PokemonName } from "./pokemon/Pokemon";
import Select from "react-select";
import { loadableComponent } from "../../common/loadableComponent";
import { ExampleDescription } from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";

const route = router.examples["3"].a;

const pokemonService = createPokemonService();

interface PokemonOption {
  label: PokemonName;
  value: PokemonId;
}

const pokemonOptions: PokemonOption[] = [
  {
    label: "bulbasaur",
    value: "1",
  },
  {
    label: "ivysaur",
    value: "2",
  },
  {
    label: "venusaur",
    value: "3",
  },
  {
    label: "charmander",
    value: "4",
  },
  {
    label: "charmeleon",
    value: "5",
  },
  {
    label: "charizard",
    value: "6",
  },
  {
    label: "squirtle",
    value: "7",
  },
  {
    label: "wartortle",
    value: "8",
  },
  {
    label: "blastoise",
    value: "9",
  },
  {
    label: "caterpie",
    value: "10",
  },
  {
    label: "metapod",
    value: "11",
  },
  {
    label: "kakuna",
    value: "12",
  },
  {
    label: "weedle",
    value: "13",
  },
  {
    label: "kakuna",
    value: "14",
  },
  {
    label: "beedrill",
    value: "15",
  },
  {
    label: "pidgey",
    value: "16",
  },
  {
    label: "pidgeotto",
    value: "17",
  },
  {
    label: "pidgeot",
    value: "18",
  },
  {
    label: "rattata",
    value: "19",
  },
  {
    label: "raticate",
    value: "20",
  },
] as any;

const initialState: {
  selectedOption?: PokemonOption | null;
} = {};

const store = createStore(initialState)
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
  store.pick("selectedOption"),
  ({ selectedOption }) => (
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

export const Example03a = () => (
  <Route match={route}>
    <h2>Example 3a</h2>
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
      We start from a select with a static list of options. Once an option is
      selected, the data for the selected pokemon is loaded.
    </p>
    <ExampleLink filename="Example03a.tsx" />
  </ExampleDescription>
);
