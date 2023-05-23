import { state, useStateObservable } from "@react-rxjs/core";
import React from "react";
import { Observable } from "rxjs";

export const Route: React.FC<{
  match: { match$: Observable<null | { exact: boolean }> };
  exact?: boolean;
  children: any;
}> = ({ match, exact, children }) => {
  const state$ = state(match.match$, null);
  const Component = () => {
    const matching = useStateObservable(state$);
    if (matching === null) return null;
    if (exact && !matching.exact) return null;
    return <>{children}</>;
  };
  return <Component />;
};
