import { of } from "rxjs";
import { randomDelay } from "./randomDelay";
import { range } from "ramda";
import { City, CityId, CityName } from "../domain/City";

const cities = range(0, 10).map(
  (id): City => ({
    id: `city_id_${id}` as CityId,
    name: `City ${id}` as CityName,
  })
);

export const createCityService = () => ({
  fetchCities: () => of(cities).pipe(randomDelay()),
});

export type CityService = ReturnType<typeof createCityService>;
