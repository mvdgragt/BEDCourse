// --- Skill 4: Chaining Array Mathods on Interface Data ---

// Filter Only

interface Product {
  id: number;
  name: string;
  price: number;
  tags: string[];
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 12000, tags: ["work", "power"] },
  { id: 2, name: "Mouse", price: 750, tags: ["accessory"] },
  { id: 1, name: "Keyboard", price: 1000, tags: ["accessory", "work"] },
];

const cheaperProducts = products
  .filter((p) => p.price < 1000)
  .map((p) => p.name)
  .join(", ");

console.log("cheaper Products:", cheaperProducts);

// Filter + Map

const productsWithSameTag = products
  .filter((p) => p.tags.includes("work"))
  .map((p) => p.name)
  .join(", ");

console.log("Products with same tag: work =>", productsWithSameTag);

// Challenge Filter + Map + Join

const multiTagProducts = products
  .filter((p) => p.tags.length > 1)
  .map((p) => `${p.name} ($${p.price})`)
  .join(", ");

console.log("Multi-tag products:", multiTagProducts);
