import { delay } from "rxjs";

export const randomDelay = <T>() => delay<T>(1000);
