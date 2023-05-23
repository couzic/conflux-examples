import { createStore } from "lenrix";
import { filter, map, of } from "rxjs";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { core } from "../../core";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";

const route = core.router.examples["2"];

const pokemonService = createPokemonService();

const store = createStore({})
  .loadFromStream(
    route.match$.pipe(
      filter(Boolean),
      map((match) => match.params["pokemon-name"])
    ),
    {
      pokemon: (pokemonName) => pokemonService.findByName(pokemonName),
    }
  )
  .loadFromFields(["pokemon"], {
    evolvesFrom: ({ pokemon }) =>
      !pokemon ? of(null) : pokemonService.getEvolvesFrom(pokemon.id),
    evolvesTo: ({ pokemon }) =>
      !pokemon ? of([]) : pokemonService.getEvolvesTo(pokemon.id),
  });

const EvolvesFrom = loadableComponent(
  store.pick("evolvesFrom"),
  ({ evolvesFrom }) =>
    !evolvesFrom ? null : <PokemonDisplay pokemon={evolvesFrom} />
);

const EvolvesTo = loadableComponent(
  store.pick("evolvesTo"),
  ({ evolvesTo }) => (
    <>
      {evolvesTo.map((evo) => (
        <PokemonDisplay pokemon={evo} key={evo.id} />
      ))}
    </>
  )
);

const PokemonAsap = loadableComponent(store.pick("pokemon"), ({ pokemon }) =>
  !pokemon ? null : (
    <div style={{ display: "flex" }}>
      <EvolvesFrom />
      <PokemonDisplay pokemon={pokemon} />
      <EvolvesTo />
    </div>
  )
);

const PokemonFullyLoaded = loadableComponent(
  store.pick("pokemon", "evolvesFrom", "evolvesTo"),
  ({ evolvesFrom, pokemon, evolvesTo }) => (
    <div style={{ display: "flex" }}>
      {!evolvesFrom ? null : <PokemonDisplay pokemon={evolvesFrom} />}
      {!pokemon ? null : <PokemonDisplay pokemon={pokemon} />}
      {evolvesTo.map((evo) => (
        <PokemonDisplay pokemon={evo} key={evo.id} />
      ))}
    </div>
  )
);

export const Example02 = () => (
  <Route match={route}>
    <h2>Example 2</h2>
    <PokemonAsap />
    <h1>OR</h1>
    <PokemonFullyLoaded />
  </Route>
);
