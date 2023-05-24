import { createStore } from "lenrix";
import { distinctUntilChanged, filter, map } from "rxjs";
import { Route } from "../../common/Route";
import { loadableComponent } from "../../common/loadableComponent";
import { router } from "../../router";
import {
  ExampleDescription,
  descriptionButtonStyle,
} from "./ExampleDescription";
import { ExampleLink } from "./ExampleLink";
import { PokemonDisplay } from "./pokemon/PokemonDisplay";
import { createPokemonService } from "./pokemon/PokemonService";

const route = router.examples["2"].a;

const pokemonService = createPokemonService();

const store = createStore({}).loadFromStream(
  route.match$.pipe(
    filter(Boolean),
    map(({ params }) => params["pokemon-name"]),
    distinctUntilChanged()
  ),
  {
    pokemon: (pokemonName) => pokemonService.findByName(pokemonName),
  }
);

const Pokemon = loadableComponent(store.pick("pokemon"), ({ pokemon }) =>
  !pokemon ? <h3>Pokemon not found</h3> : <PokemonDisplay pokemon={pokemon} />
);

export const Example02a = () => (
  <Route match={route}>
    <h2>Example 2a</h2>
    <Description />
    <Pokemon />
  </Route>
);

const Description = () => (
  <ExampleDescription>
    <p>
      We are listening to an observable stream of the URL param holding a
      pokemon name. Every time the route is entered or the params change, we
      extract the pokemon name from that param and start loading data for that
      pokemon.
    </p>
    <p>While the pokemon data is being loaded, a spinner is displayed</p>
    <p>
      Have fun and change the URL param manually, or click on one of those
      buttons:{" "}
      <span
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <button
          onClick={() => route.push({ "pokemon-name": "pichu" })}
          style={descriptionButtonStyle}
        >
          Pichu
        </button>
        <button
          onClick={() => route.push({ "pokemon-name": "pikachu" })}
          style={descriptionButtonStyle}
        >
          Pikachu
        </button>
        <button
          onClick={() => route.push({ "pokemon-name": "raichu" })}
          style={descriptionButtonStyle}
        >
          Raichu
        </button>
      </span>
    </p>
    <ExampleLink filename="Example02a.tsx" />
  </ExampleDescription>
);
