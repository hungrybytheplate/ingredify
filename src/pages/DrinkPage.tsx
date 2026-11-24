import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, GlassWater } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { PageSchema } from "@/components/PageSchema";
import { getDrinkBySlug, drinkPath } from "@/lib/drinkSlug";
import { recipePath } from "@/lib/recipeSlug";
import { findPairingByName } from "@/lib/pairingLookup";
import NotFound from "./NotFound";

const typeLabel: Record<string, string> = {
  cocktail: "Cocktail", mocktail: "Mocktail", smoothie: "Smoothie", wellness: "Wellness", hot: "Hot Drink",
};

const toIsoMinutes = (t: string) => {
  const m = t.match(/(\d+)\s*min/);
  return m ? `PT${m[1]}M` : undefined;
};

export default function DrinkPage() {
  const { slug = "" } = useParams();
  const drink = getDrinkBySlug(slug);
  if (!drink) return <NotFound />;

  const path = drinkPath(drink);
  const description = `${drink.description}. Ready in ${drink.prepTime}. Free step-by-step drink recipe on Ingredify.`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: drink.title,
    description: drink.description,
    url: `https://ingredify.org${path}`,
    recipeCategory: "Drink",
    keywords: [typeLabel[drink.drinkType], drink.isAlcoholic ? "cocktail" : "non-alcoholic"].join(", "),
    totalTime: toIsoMinutes(drink.prepTime),
    recipeIngredient: drink.ingredients.map((i) => i.replace(/-/g, " ")),
    recipeInstructions: drink.instructions.map((text) => ({ "@type": "HowToStep", text })),
    ...(drink.nutrition ? { nutrition: { "@type": "NutritionInformation", calories: `${drink.nutrition.calories} calories` } } : {}),
    author: { "@type": "Organization", name: "Ingredify" },
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHead title={`${drink.title} Recipe - Ingredify`} description={description.slice(0, 160)} canonicalPath={path} type="article" />
      <PageSchema id="schema-drink" schema={schema} />
      <Header />

      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> All recipes</Link>
        </Button>

        <header className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{typeLabel[drink.drinkType] ?? drink.drinkType}</Badge>
            <Badge variant="outline">{drink.isAlcoholic ? "Contains alcohol" : "Alcohol-free"}</Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{drink.title}</h1>
          <p className="text-muted-foreground">{drink.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{drink.prepTime}</span>
            <span className="flex items-center gap-1.5"><GlassWater className="h-4 w-4" />{drink.glassType}</span>
          </div>
          <Button asChild className="gap-2">
            <Link to="/?mode=drink">Find more drinks in Ingredify</Link>
          </Button>
        </header>

        <section aria-labelledby="ingredients-heading" className="space-y-3">
          <h2 id="ingredients-heading" className="font-serif text-xl font-semibold">Ingredients</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {drink.ingredients.map((ing) => (
              <li key={ing} className="p-2.5 rounded-lg bg-muted/40 text-sm capitalize">{ing.replace(/-/g, " ")}</li>
            ))}
          </ul>
          {drink.garnish && <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Garnish:</span> {drink.garnish}</p>}
        </section>

        <section aria-labelledby="steps-heading" className="space-y-3">
          <h2 id="steps-heading" className="font-serif text-xl font-semibold">Instructions</h2>
          <ol className="space-y-3">
            {drink.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {drink.nutrition && (
          <section aria-labelledby="nutrition-heading" className="space-y-2">
            <h2 id="nutrition-heading" className="font-serif text-xl font-semibold">Nutrition per drink</h2>
            <p className="text-sm text-muted-foreground">
              {drink.nutrition.calories} calories · {drink.nutrition.sugar}g sugar · {drink.nutrition.carbs}g carbs
            </p>
          </section>
        )}

        {drink.suggestedPairings && drink.suggestedPairings.length > 0 && (
          <section aria-labelledby="pairs-heading" className="space-y-3">
            <h2 id="pairs-heading" className="font-serif text-xl font-semibold">Pairs well with</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {drink.suggestedPairings.map((p) => {
                const match = findPairingByName(p.name);
                const inner = (
                  <>
                    <span className="block text-sm font-medium">{p.name}</span>
                    <span className="block text-xs text-muted-foreground">{p.description}</span>
                  </>
                );
                const to = match?.type === "recipe" ? recipePath(match.data) : match?.type === "drink" ? drinkPath(match.data) : null;
                return (
                  <li key={p.name}>
                    {to ? <Link to={to} className="block p-2.5 rounded-lg border border-border/50 hover:border-primary/50">{inner}</Link>
                        : <div className="p-2.5 rounded-lg border border-border/50">{inner}</div>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
