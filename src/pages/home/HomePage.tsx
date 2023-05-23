import { reactiveComponent } from "../../common/reactiveComponent";
import { Spinner } from "../../common/Spinner";
import { core } from "../../core";

const examples = core.router.examples;

const goToExample01a = () => examples["1"].a.push();
const goToExample01b = () => examples["1"].b.push();
const goToExample01c = () =>
  examples["1"].c.push({ "pokemon-name": "pikachu" });
const goToExample02 = () => examples["2"].push({ "pokemon-name": "eevee" });
const goToExample03 = () => examples[3].push();
const goToExample04a = () => examples["4"].a.push();
const goToExample04b = () =>
  examples["4"].b.push({ "pokemon-name": "charizard" });

export const HomePage = () => (
  <>
    <h1>Welcome !</h1>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button onClick={goToExample01a}>Example 1a</button>
      <button onClick={goToExample01b}>Example 1b</button>
      <button onClick={goToExample01c}>Example 1c</button>
      <button onClick={goToExample02}>Example 2</button>
      <button onClick={goToExample03}>Example 3</button>
      <button onClick={goToExample04a}>Example 4a</button>
      <button onClick={goToExample04b}>Example 4b</button>
    </div>
    {/* <button onClick={onClick} style={{ display: "flex", alignItems: "center" }}>
      Go to interesting page...
      <img
        style={{ marginLeft: 20 }}
        src="https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-large/1f608.png"
      />
    </button> */}
  </>
);
