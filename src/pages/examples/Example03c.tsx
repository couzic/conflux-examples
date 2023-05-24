import { createStore } from "lenrix";
import Select from "react-select";
import { filter, first, map, mergeMap } from "rxjs";
import { asSequence } from "sequency";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { router } from "../../router/Router";
import { ExampleDescription } from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";
import { PokemonName, PokemonUrl } from "./pokemon/Pokemon";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";

const route = router.examples["3"].c;

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
      map((match) => match.params["pokemon-name"] as PokemonName)
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

export const Example03c = () => (
  <Route match={route}>
    <h2>Example 3c</h2>
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Description />
      <PokemonSelection />
    </div>
  </Route>
);

const Description = () => (
  <ExampleDescription>
    <p>
      Again we build from the previous example. This time, we add the selected
      pokemon name as an URL param.
    </p>
    <p>Have fun playing with the browser Back and Forward buttons !</p>
    <ExampleLink filename="Example03b.tsx" />
  </ExampleDescription>
);
