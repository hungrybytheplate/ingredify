import { sampleRecipes, type Recipe } from "@/data/recipes";

/** Recipe titles that share a filling: [wonton version, dip version]. */
const PAIRS: [string, string][] = [
  ["Jalapeño Popper Wontons", "Jalapeño Popper Dip"],
  ["Homemade Crab Rangoon", "Crab Rangoon Dip"],
  ["Crispy Crab Rangoon", "Crab Rangoon Dip"],
  ["Buffalo Chicken Wontons", "Buffalo Chicken Dip"],
  ["Spinach Artichoke Wontons", "Spinach Artichoke Dip"],
];

const byTitle = new Map(sampleRecipes.map((r) => [r.title, r]));

/** Returns the alternate form of a recipe (dip <-> wontons), if one exists. */
export function getAltForm(recipe: Recipe): { label: string; recipe: Recipe } | null {
  for (const [wonton, dip] of PAIRS) {
    if (recipe.title === wonton && byTitle.has(dip)) {
      return { label: "Make it as a dip", recipe: byTitle.get(dip)! };
    }
    if (recipe.title === dip && byTitle.has(wonton)) {
      return { label: "Make it as wontons", recipe: byTitle.get(wonton)! };
    }
  }
  return null;
}
