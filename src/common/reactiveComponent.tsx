import { state as componentState, useStateObservable } from "@react-rxjs/core";
import React from "react";
import { Observable } from "rxjs";

export function reactiveComponent<Props>(
  props$: Observable<Props>,
  Component: React.FC<Props>
): React.FC<{}> {
  const componentState$ = componentState(props$, null);
  return () => {
    const props = useStateObservable(componentState$);
    if (props === null) return null;
    return <Component {...(props as any)} />;
  };
}
