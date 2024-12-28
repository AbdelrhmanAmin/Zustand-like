const isIterable = (obj: object): obj is Iterable<unknown> =>
  Symbol.iterator in obj;

const hasEntriesMethod = (
  value: Iterable<unknown>
): value is Iterable<unknown> & {
  entries(): Iterable<[unknown, unknown]>;
} =>
  // HACK: avoid checking entries type
  "entries" in value;

const compareEntries = (
  a: { entries(): Iterable<[unknown, unknown]> },
  b: { entries(): Iterable<[unknown, unknown]> }
) => {
  const mapA = a instanceof Map ? a : new Map(a.entries());
  const mapB = b instanceof Map ? b : new Map(b.entries());
  if (mapA.size !== mapB.size) {
    return false;
  }
  for (const [key, value] of mapA) {
    if (!Object.is(value, mapB.get(key))) {
      return false;
    }
  }
  return true;
};

const compareIterables = (
  valueA: Iterable<unknown>,
  valueB: Iterable<unknown>
) => {
  const iteratorA = valueA[Symbol.iterator]();
  const iteratorB = valueB[Symbol.iterator]();
  let nextA = iteratorA.next();
  let nextB = iteratorB.next();
  while (!nextA.done && !nextB.done) {
    if (!Object.is(nextA.value, nextB.value)) {
      return false;
    }
    nextA = iteratorA.next();
    nextB = iteratorB.next();
  }
  return !!nextA.done && !!nextB.done;
};

export function shallowComparison<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true; // if a and b are strictly equal, return true
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  )
    return false; // if a or b are not objects, return false

  // if not iterable, assign Object.entries to a and b then compare entries
  if (!isIterable(a) || !isIterable(b)) {
    return compareEntries(
      { entries: () => Object.entries(a) },
      { entries: () => Object.entries(b) }
    );
  } // not iterable, but has entries method.
  if (hasEntriesMethod(a) && hasEntriesMethod(b)) {
    return compareEntries(a, b);
  }
  // has iterable...
  return compareIterables(a, b);
}
