import { useRef } from "react";
import { shallowComparison } from "../utils/shallowComparison";

export function useShallow<State, Slice>(
  selector?: (state: State) => Slice
): (state: State) => Slice {
  const prevSlice = useRef<Slice>({} as Slice);
  const select = selector ?? ((x: State) => x as any);
  return (state) => {
    const nextSlice = select(state);
    if (!shallowComparison(prevSlice.current, nextSlice)) {
      prevSlice.current = nextSlice;
    }
    return prevSlice.current;
  };
}
