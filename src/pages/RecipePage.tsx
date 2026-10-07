import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Users, ChefHat, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead, generateRecipeSchema } from "@/components/SEOHead";
import { PageSchema } from "@/components/PageSchema";
import { getRecipeBySlug, recipePath } from "@/lib/recipeSlug";
import { getAltForm } from "@/lib/dipWontonPairs";
import { findPairingByName } from "@/lib/pairingLookup";
import NotFound from "./NotFound";

const formatAmount = (amount: string) => {
  const map: Record<string, string> = { "0.25": "¼", "0.33": "⅓", "0.5": "½", "0.66": "⅔", "0.75": "¾", "1.5": "1½" };
  return map[amount] ?? amount;
};

export default function RecipePage() {
  const { slug = "" } = useParams();
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return <NotFound />;

  const path = recipePath(recipe);
  const alt = getAltForm(recipe);
  const description = `${recipe.description}. ${recipe.cookTime}, serves ${recipe.servings}. Free step-by-step recipe on Ingredify.`;
  const schema = { ...generateRecipeSchema(recipe), url: `https://ingredify.org${path}` };

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHead
        title={`${recipe.title} Recipe - Ingredify`}
        description={description.slice(0, 160)}
        canonicalPath={path}
        type="article"
      />
      <PageSchema id="schema-recipe" schema={schema} />
      <Header />

      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> All recipes</Link>
        </Button>

        <header className="space-y-3">
          <Badge variant="secondary" className="capitalize">{recipe.mealType}</Badge>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{recipe.title}</h1>
          <p className="text-muted-foreground">{recipe.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{recipe.cookTime}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />Serves {recipe.servings}</span>
            {recipe.difficulty && <span className="flex items-center gap-1.5 capitalize"><ChefHat className="h-4 w-4" />{recipe.difficulty}</span>}
          </div>
          {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.dietaryTags.map((t) => <Badge key={t} variant="outline" className="capitalize">{t.replace(/-/g, " ")}</Badge>)}
            </div>
          )}
          <Button asChild className="gap-2">
            <Link to={`/?recipe=${recipe.id}`}>Save, plan, or cook in Ingredify</Link>
          </Button>
        </header>

        <section aria-labelledby="ingredients-heading" className="space-y-3">
          <h2 id="ingredients-heading" className="font-serif text-xl font-semibold">Ingredients</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {recipe.ingredients.map((ing) => {
              const a = recipe.ingredientAmounts?.find((x) => x.id === ing);
              return (
                <li key={ing} className="p-2.5 rounded-lg bg-muted/40 text-sm">
                  {a && <span className="font-medium">{formatAmount(a.amount)} {a.unit} </span>}
                  <span className="capitalize">{ing.replace(/-/g, " ")}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="steps-heading" className="space-y-3">
          <h2 id="steps-heading" className="font-serif text-xl font-semibold">Instructions</h2>
          <ol className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {recipe.nutrition && (
          <section aria-labelledby="nutrition-heading" className="space-y-2">
            <h2 id="nutrition-heading" className="font-serif text-xl font-semibold">Nutrition per serving</h2>
            <p className="text-sm text-muted-foreground">
              {recipe.nutrition.calories} calories · {recipe.nutrition.protein}g protein · {recipe.nutrition.carbs}g carbs · {recipe.nutrition.fat}g fat
            </p>
          </section>
        )}

        {alt && (
          <Link to={recipePath(alt.recipe)} className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
            <span>
              <span className="block text-sm font-semibold text-primary">{alt.label}</span>
              <span className="block text-xs text-muted-foreground">{alt.recipe.title}</span>
            </span>
            <ExternalLink className="h-4 w-4 text-primary" />
          </Link>
        )}

        {recipe.suggestedSides && recipe.suggestedSides.length > 0 && (
          <section aria-labelledby="pairs-heading" className="space-y-3">
            <h2 id="pairs-heading" className="font-serif text-xl font-semibold">Pairs well with</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {recipe.suggestedSides.map((side) => {
                const match = findPairingByName(side.name);
                const inner = (
                  <>
                    <span className="block text-sm font-medium">{side.name}</span>
                    <span className="block text-xs text-muted-foreground">{side.description}</span>
                  </>
                );
                return (
                  <li key={side.name}>
                    {match?.type === "recipe" ? (
                      <Link to={recipePath(match.data)} className="block p-2.5 rounded-lg border border-border/50 hover:border-primary/50">{inner}</Link>
                    ) : (
                      <div className="p-2.5 rounded-lg border border-border/50">{inner}</div>
                    )}
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
