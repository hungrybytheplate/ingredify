import { sampleRecipes, type Recipe } from "../data/recipes";

/** URL-friendly slug from a recipe title, e.g. "Jalapeño Popper Wontons" -> "jalapeno-popper-wontons". */
export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// First recipe wins when two titles produce the same slug.
const bySlug = new Map<string, Recipe>();
for (const r of sampleRecipes) {
  const s = slugify(r.title);
  if (!bySlug.has(s)) bySlug.set(s, r);
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return bySlug.get(slug);
}

export function recipePath(recipe: Pick<Recipe, "title">): string {
  return `/recipe/${slugify(recipe.title)}`;
}

export function allRecipeSlugs(): string[] {
  return [...bySlug.keys()];
}
