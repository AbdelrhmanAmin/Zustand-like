import { render, screen } from "@testing-library/react";
import React, { useEffect } from "react";
import { describe, it } from "vitest";
import { create } from "../src/React/create";

type Store = {
  count: number;
  increment: () => void;
};

describe("createUseStore", () => {
  it("should create a store and uses the store with no args", async () => {
    const useStore = create<Store>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));
    const Counter = () => {
      const { count, increment } = useStore();
      useEffect(increment, [increment]);
      return <div>Count: {count}</div>;
    };
    render(
      <>
        <Counter />
      </>
    );
    await screen.findByText("Count: 1");
  });

  it("should create a store and uses the store with a selector", async () => {
    const useStore = create<Store>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));
    const Counter = () => {
      const count = useStore((state) => state.count);
      const increment = useStore((state) => state.increment);
      useEffect(increment, [increment]);
      return <div>Count: {count}</div>;
    };
    render(
      <>
        <Counter />
      </>
    );
    await screen.findByText("Count: 1");
  });
});
