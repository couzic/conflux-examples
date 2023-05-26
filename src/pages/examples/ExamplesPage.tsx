import { Route } from "../../common/Route";
import { router } from "../../router/Router";
import { Example01a } from "./Example01a";
import { Example01b } from "./Example01b";
import { Example02a } from "./Example02a";
import { Example02b } from "./Example02b";
import { Example03a } from "./Example03a";
import { Example03b } from "./Example03b";
import { Example03c } from "./Example03c";
import { OptimisticUpdatesPage } from "./OptimisticUpdates";

const goHome = () => router.home.push();

export const ExamplesPage = () => (
  <Route match={router.examples}>
    <button onClick={goHome}>Home</button>
    <Example01a />
    <Example01b />
    <Example02a />
    <Example02b />
    <Example03a />
    <Example03b />
    <Example03c />
    <OptimisticUpdatesPage />
  </Route>
);
