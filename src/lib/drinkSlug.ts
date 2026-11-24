import { sampleDrinks, type Drink } from "../data/drinks";
import { slugify } from "./recipeSlug";

// First drink wins when two titles produce the same slug.
const bySlug = new Map<string, Drink>();
for (const d of sampleDrinks) {
  const s = slugify(d.title);
  if (!bySlug.has(s)) bySlug.set(s, d);
}

export function getDrinkBySlug(slug: string): Drink | undefined {
  return bySlug.get(slug);
}

export function drinkPath(drink: Pick<Drink, "title">): string {
  return `/drink/${slugify(drink.title)}`;
}

export function allDrinkSlugs(): string[] {
  return [...bySlug.keys()];
}
