import { expect, test, describe } from "vitest";
import createStore from "../src/Vanilla/createStore";

describe("createStore", () => {
  test("should create a store", () => {
    const store = createStore(() => ({ count: 0 }));
    expect(store.getState()).toEqual({ count: 0 });
  });
  test("should update state", () => {
    const store = createStore(() => ({ count: 0 }));
    store.setState({ count: 1 });
    expect(store.getState()).toEqual({ count: 1 });
  });
  test("should update state with function", () => {
    const store = createStore((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));
    const { increment } = store.getState();
    increment();
    expect(store.getState().count).toEqual(1);
  });
  test("initial state should be memoized", () => {
    const store = createStore((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));
    const storeBeforeChanges = store.getState();
    const increment = store.getState().increment;
    increment();
    increment();
    increment();
    increment();
    increment();
    const storeAfterChanges = store.getState();
    expect(store.getInitialState()).toBe(storeBeforeChanges);
    expect(store.getInitialState()).not.toBe(storeAfterChanges);
    expect(storeAfterChanges.count).toEqual(5);
  });
});
