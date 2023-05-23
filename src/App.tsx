import "./App.css";
import { Route } from "./common/Route";
import { core } from "./core";
import { Example01a } from "./pages/examples/Example01a";
import { Example01b } from "./pages/examples/Example01b";
import { Example01c } from "./pages/examples/Example01c";
import { Example02 } from "./pages/examples/Example02";
import { Example03 } from "./pages/examples/Example03";
import { Example04a } from "./pages/examples/Example04a";
import { Example04b } from "./pages/examples/Example04b";
import { HomePage } from "./pages/home/HomePage";
import { ProductSearchPage } from "./pages/product-search/ProductSearchPage";

const goHome = () => core.router.home.push();

export const App = () => (
  <>
    <Route exact match={core.router.home}>
      <HomePage />
    </Route>
    <Route match={core.router.examples}>
      <button onClick={goHome}>Home</button>
      <Example01a />
      <Example01b />
      <Example01c />
      <Example02 />
      <Example03 />
      <Example04a />
      <Example04b />
    </Route>
    <Route match={core.router.productSearch}>
      <ProductSearchPage />
    </Route>
  </>
);
