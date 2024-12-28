import React from "react";
import createStore, { Initializer, StoreApi } from "../Vanilla/createStore";
type Selector<T> = (state: T) => any;

type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

type ReadonlyStoreApi<T> = Pick<
  StoreApi<T>,
  "getState" | "getInitialState" | "subscribe"
>;

export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  (): ExtractState<S>;
  <U>(selector: (state: ExtractState<S>) => U): U;
} & S;

function useStore<T>(api: ReadonlyStoreApi<T>, selector: Selector<T>): T {
  const [, forceUpdate] = React.useReducer((s) => s + 1, 0);

  React.useEffect(() => {
    const unsubscribe = api.subscribe(forceUpdate);
    return () => unsubscribe();
  }, []);
  return selector(api.getState());
}

function create<T>(createState: Initializer<T>) {
  const api = createStore(createState);
  const useStoreSlice = (selector: Selector<T>) => useStore(api, selector);
  Object.assign(useStoreSlice, api); // assign api methods to useStoreSlice
  return useStoreSlice;
}

export { create };
