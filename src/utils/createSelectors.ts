import { UseBoundStore } from "../React/create";
import { StoreApi } from "../Vanilla/createStore";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};


export default createSelectors;

// instead of
/**
 * const useItemsStore = create((set) => ({
 *  items: [],
 * add: (item) => set((state) => ({items: [...state.items, item]})),
 * remove: (item) => set((state) => ({items: state.items.filter((i) => i !== item)}))
 * }));
 * 
 * BEFORE:
 * const {items, add, remove} = useItemsStore(state => ({
 * items: state.items,
 * add: state.add,
 * remove: state.remove
 * }));
 * 
 * you could do instead
 * const items = useItemsStore.use.items(); 
 * 
 */