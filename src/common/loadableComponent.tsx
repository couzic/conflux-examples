import { state as componentState, useStateObservable } from "@react-rxjs/core";
import React from "react";
import { Observable } from "rxjs";
import { Spinner } from "./Spinner";

export function loadableComponent<Props>(
  state$: Observable<
    | {
        status: "loading";
        data: { [K in keyof Props]: Props[K] | undefined };
        errors: [];
      }
    | { status: "loaded"; data: Props; errors: [] }
    | {
        status: "error";
        data: { [K in keyof Props]: Props[K] | undefined };
        errors: Error[];
      }
  >,
  Component: React.FC<Props>
): React.FC<{}> {
  const componentState$ = componentState(state$, null);
  return () => {
    const state = useStateObservable(componentState$);
    if (state === null) return null;
    if (state.status === "loading") return <Spinner />;
    if (state.status === "error")
      return (
        <h3>
          Errors: {JSON.stringify(state.errors.map((error) => error.message))}
        </h3>
      );
    return <Component {...(state.data as any)} />;
  };
}
