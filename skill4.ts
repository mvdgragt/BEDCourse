// ---Skill 34: Generics(<T> means reusable placeholder)

// Wrap It Up
const wrapinarray = <T>(item: T): T[] => {
  return [item];
};

console.log(wrapinarray("cat"));
console.log(wrapinarray(67));

// First in Line
const firstItem = <T>(arr: T[]): T => {
  return arr[0];
};

console.log(firstItem([1, 2, 3]));
console.log(firstItem(["a", "b", "c"]));

// Challenge (optional) Swap Places
const swap = <T>(a: T, b: T): T[] => {
  return [b, a];
};

console.log(swap("hello", "world"));
console.log(swap(2, 1));
