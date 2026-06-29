// Loads every scarf from src/data/scarves/*.json at build time.
// Adding a new file in that folder (e.g. via the /admin panel) automatically
// adds a new scarf — no code changes needed.

export interface Scarf {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  gallery?: string[];
  color?: string;
  material?: string;
  description?: string;
}

const modules = import.meta.glob<{ default: Omit<Scarf, "id"> }>(
  "../data/scarves/*.json",
  { eager: true },
);

export const scarves: Scarf[] = Object.entries(modules)
  .map(([path, mod]) => {
    const id = path.split("/").pop()!.replace(/\.json$/, "");
    return { id, ...mod.default };
  })
  // Newest-feeling order: in-stock first, then alphabetical
  .sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
