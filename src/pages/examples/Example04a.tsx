import { createStore } from "lenrix";
import Select from "react-select";
import { filter, first, map, mergeMap, of, switchMap } from "rxjs";
import { Route } from "../../common/Route";
import { Spinner } from "../../common/Spinner";
import { loadableComponent } from "../../common/loadableComponent";
import { reactiveComponent } from "../../common/reactiveComponent";
import { core } from "../../core";
import { PokemonName, PokemonUrl } from "./pokemon/Pokemon";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";

const route = core.router.examples["4"].a;

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

export const Example04a = () => (
  <Route match={route}>
    <h2>Example 4a</h2>
    <PokemonSelect />
    <Pokemon />
  </Route>
);
