import React, { useMemo } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
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
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getInitialState,
    selector
  );

  React.useDebugValue(slice);
  return slice;
}

function create<T>(createState: Initializer<T>) {
  const api = createStore(createState);
  const useStoreSlice = (selector: Selector<T>) => useStore(api, selector);
  Object.assign(useStoreSlice, api); // assign api methods to useStoreSlice
  return useStoreSlice;
}

export { create };

/*

export function useStore<TState, StateSlice>(
  api: StoreApi<TState>,
  selector: (state: TState) => StateSlice = identity as any,
) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState()),
  )
  React.useDebugValue(slice)
  return slice
}

const createImpl = <T>(createState: Initializer<T>) => {
  const api = createStore(createState);

  const useBoundStore: any = (selector?: any) => useStore(api, selector);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};


*/
