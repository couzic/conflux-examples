import { Route } from "../../common/Route";
import { router } from "../../router";

const { examples } = router;

const goToExample01a = () => examples["1"].a.push();
const goToExample01b = () => examples["1"].b.push();
const goToExample02a = () =>
  examples["2"].a.push({ "pokemon-name": "pikachu" });
const goToExample02b = () =>
  examples["2"].b.push({ "pokemon-name": "pikachu" });
const goToExample03a = () => examples["3"].a.push();
const goToExample03b = () => examples["3"].b.push();
const goToExample03c = () =>
  examples["3"].c.push({ "pokemon-name": "charizard" });

export const HomePage = () => (
  <Route exact match={router.home}>
    <h1>Welcome !</h1>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button onClick={goToExample01a}>Example 1a</button>
      <button onClick={goToExample01b}>Example 1b</button>
      <button onClick={goToExample02a}>Example 2a</button>
      <button onClick={goToExample02b}>Example 2b</button>
      <button onClick={goToExample03a}>Example 3a</button>
      <button onClick={goToExample03b}>Example 3b</button>
      <button onClick={goToExample03c}>Example 3c</button>
    </div>
  </Route>
);
