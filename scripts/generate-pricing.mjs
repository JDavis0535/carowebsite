// Generates netlify/functions/pricing.json from the scarf data files.
// Runs automatically before every build (see "prebuild" in package.json) so the
// checkout always uses authoritative, server-side prices — never client input.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src", "data", "scarves");

const out = {};
for (const file of readdirSync(dir)) {
  if (!file.endsWith(".json")) continue;
  const id = file.replace(/\.json$/, "");
  const data = JSON.parse(readFileSync(join(dir, file), "utf8"));
  out[id] = { name: data.name, price: data.price, image: data.image };
}

const target = join(root, "netlify", "functions", "pricing.json");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
console.log(`generate-pricing: wrote ${Object.keys(out).length} products`);
