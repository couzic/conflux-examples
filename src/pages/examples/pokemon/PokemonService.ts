import {
  Observable,
  catchError,
  delay,
  forkJoin,
  map,
  of,
  switchMap,
} from "rxjs";
import { ajax } from "rxjs/ajax";
import { asSequence } from "sequency";
import { Pokemon, PokemonId, PokemonName, PokemonUrl } from "./Pokemon";

const loadByName = (name: PokemonName) =>
  ajax
    .getJSON<any>(`https://pokeapi.co/api/v2/pokemon/${name}` as PokemonUrl)
    .pipe(
      map(
        (_): Pokemon => ({
          id: _.id,
          name: _.name,
          imgUrl: _.sprites.other["official-artwork"].front_default,
        })
      ),
      delay(1500)
    );

export const createPokemonService = () => ({
  findByName: (pokemonName: string) =>
    loadByName(pokemonName as PokemonName).pipe(
      catchError((error) => {
        if (error.status === 404) return of(null);
        else throw error;
      })
    ),
  loadByName,
  getEvolvesFrom: (pokemonId: PokemonId) =>
    ajax
      .getJSON<any>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
      .pipe(
        map((species) => species.evolves_from_species),
        switchMap((_) =>
          _ === null
            ? of(null)
            : ajax.getJSON<any>(_.url).pipe(
                map((_) =>
                  asSequence(_.varieties)
                    .filter((_: any) => _.is_default)
                    .map((_: any) => _.pokemon.url as string)
                    .first()
                ),
                switchMap((url) => ajax.getJSON<any>(url)),
                map(
                  (_): Pokemon => ({
                    id: _.id,
                    name: _.name,
                    imgUrl: _.sprites.other["official-artwork"].front_default,
                  })
                )
              )
        ),
        delay(1500)
      ),
  getEvolvesTo: (pokemonId: PokemonId): Observable<Pokemon[]> =>
    ajax
      .getJSON<any>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
      .pipe(
        switchMap((_) => ajax.getJSON<any>(_.evolution_chain.url)),
        map((_) => {
          let { chain } = _;
          let matchedChain = {} as any;
          const checkChain = (chain: any) => {
            if (
              chain.species.url ===
              `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
            ) {
              matchedChain = chain;
            } else {
              chain.evolves_to.forEach((evo: any) => {
                checkChain(evo);
              });
            }
          };
          checkChain(chain);
          return matchedChain.evolves_to.map(
            (evo: any) => evo.species.url
          ) as string[];
        }),
        switchMap((urls) =>
          urls.length === 0
            ? of([])
            : forkJoin(
                urls.map((url) =>
                  ajax.getJSON<any>(url).pipe(
                    map((_) =>
                      asSequence(_.varieties)
                        .filter((_: any) => _.is_default)
                        .first()
                    ),
                    switchMap((_: any) => ajax.getJSON<any>(_.pokemon.url))
                  )
                )
              )
        ),
        map((_) =>
          _.map((_: any) => ({
            id: _.id,
            name: _.name,
            imgUrl: _.sprites.other["official-artwork"].front_default,
          }))
        ),
        delay(1500)
      ),
  listAll: () =>
    ajax
      .getJSON<{ results: Array<{ name: PokemonName; url: PokemonUrl }> }>(
        "https://pokeapi.co/api/v2/pokemon/?limit=300"
      )
      .pipe(
        map((_) => _.results),
        delay(1500)
      ),
});
