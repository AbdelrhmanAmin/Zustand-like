import React, { useMemo } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import createStore, { Initializer, StoreApi } from "../Vanilla/createStore";

type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

type ReadonlyStoreApi<T> = Pick<
  StoreApi<T>,
  "getState" | "getInitialState" | "subscribe"
>;

const identity = <T,>(x: T) => x;

export function useStore<T, StateSlice>(
  api: ReadonlyStoreApi<T>,
  selector: (state: T) => StateSlice = identity as any
) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getInitialState,
    selector
  );

  React.useDebugValue(slice);
  return slice;
}

export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  (): ExtractState<S>;
  <U>(selector: (state: ExtractState<S>) => U): U;
} & S;

function create<T>(
  createState: Initializer<T>
): UseBoundStore<ReadonlyStoreApi<T>> {
  const api = createStore(createState);
  const useStoreSlice: any = (selector?: any) => useStore(api, selector);
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
