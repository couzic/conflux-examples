import { createStore } from "lenrix";
import Select from "react-select";
import { distinctUntilChanged, filter, first, map, mergeMap } from "rxjs";
import { asSequence } from "sequency";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { core } from "../../core";
import { PokemonName, PokemonUrl } from "./pokemon/Pokemon";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";

const route = core.router.examples["4"].b;

const pokemonService = createPokemonService();

interface PokemonOption {
  label: PokemonName;
  value: PokemonUrl;
}

const store = createStore({})
  .load({
    pokemonOptions: route.match$.pipe(
      filter(Boolean),
      first(),
      mergeMap(() => pokemonService.listAll()),
      map((list) =>
        list.map((_): PokemonOption => ({ label: _.name, value: _.url }))
      )
    ),
    selectedPokemonName: route.match$.pipe(
      filter(Boolean),
      map((match) => match.params["pokemon-name"] as PokemonName),
      distinctUntilChanged()
    ),
  })
  .actionTypes<{ selectPokemon: PokemonOption | null }>()
  .sideEffects({
    selectPokemon: (option) => {
      if (option) {
        route.push({ "pokemon-name": option.label });
      }
    },
  })
  .computeFromFields(["pokemonOptions", "selectedPokemonName"], {
    selectedPokemonOption: ({ pokemonOptions, selectedPokemonName }) =>
      asSequence(pokemonOptions).find((_) => _.label === selectedPokemonName),
  })
  .loadFromFields(["selectedPokemonName"], {
    pokemon: ({ selectedPokemonName }) =>
      pokemonService.loadByName(selectedPokemonName),
  });

const onPokemonSelected = (option: PokemonOption | null) =>
  store.dispatch({ selectPokemon: option });

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) => (
  <PokemonDisplay pokemon={pokemon} />
));

const PokemonSelection = loadableComponent(
  store.pick("pokemonOptions", "selectedPokemonOption"),
  ({ pokemonOptions, selectedPokemonOption }) => (
    <div style={{ width: 300 }}>
      <Select
        placeholder="Select a pokemon"
        options={pokemonOptions}
        value={selectedPokemonOption}
        onChange={onPokemonSelected}
      />
      <Pokemon />
    </div>
  )
);

export const Example04b = () => (
  <Route match={route}>
    <h2>Example 4b</h2>
    <PokemonSelection />
  </Route>
);
