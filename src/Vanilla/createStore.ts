type PartialSetState<T> = T | Partial<T> | { _(state: T): T | Partial<T> }["_"];

export type StoreApi<T> = {
  setState: (partial: PartialSetState<T>, replace?: boolean) => void;
  getState: () => T;
  getInitialState: () => T;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
};

export type Initializer<T> = (
  setState: StoreApi<T>["setState"],
  getState: StoreApi<T>["getState"],
  api: StoreApi<T>
) => T | T;
type Listener<T> = (state: T, prevState: T) => void;

const createStore = <T = any>(createState: Initializer<T>) => {
  let state: T;
  const listeners: Set<Listener<T>> = new Set();

  const setState = (partial: any, replace?: boolean) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;

      if (replace || typeof nextState !== "object" || nextState === null) {
        state = nextState;
      } else {
        state = Object.assign({}, state, nextState);
      }
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  const getState = () => state;
  const getInitialState = () => initialState;

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe, getInitialState };

  const initialState = (state = createState(setState, getState, api));

  return api;
};


export default createStore;