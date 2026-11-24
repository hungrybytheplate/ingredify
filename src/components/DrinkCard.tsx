import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, Check, Key, Wine, GlassWater, Leaf, Sparkles, Zap, Shield, Dumbbell, HeartPulse, Droplets, Snowflake, Shuffle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Drink, HealthTag } from "@/data/drinks";
import { DrinkDetailDialog } from "./DrinkDetailDialog";
import { ShareRecipeButton } from "./ShareRecipeButton";

interface DrinkCardProps {
  drink: Drink;
  isSaved: boolean;
  onSave: () => void;
  onAddToShopping?: (ingredients: string[]) => void;
}

const drinkTypeConfig = {
  cocktail: {
    bg: "bg-gradient-to-r from-amber-400/20 to-orange-400/20",
    border: "border-amber-400/30",
    text: "text-amber-700 dark:text-amber-400",
    emoji: "🍸",
    label: "Cocktail",
  },
  mocktail: {
    bg: "bg-gradient-to-r from-emerald-400/20 to-teal-400/20",
    border: "border-emerald-400/30",
    text: "text-emerald-700 dark:text-emerald-400",
    emoji: "🍹",
    label: "Mocktail",
  },
  smoothie: {
    bg: "bg-gradient-to-r from-pink-400/20 to-rose-400/20",
    border: "border-pink-400/30",
    text: "text-pink-700 dark:text-pink-400",
    emoji: "🥤",
    label: "Smoothie",
  },
  wellness: {
    bg: "bg-gradient-to-r from-violet-400/20 to-purple-400/20",
    border: "border-violet-400/30",
    text: "text-violet-700 dark:text-violet-400",
    emoji: "✨",
    label: "Wellness",
  },
  hot: {
    bg: "bg-gradient-to-r from-orange-400/20 to-red-400/20",
    border: "border-orange-400/30",
    text: "text-orange-700 dark:text-orange-400",
    emoji: "☕",
    label: "Hot Drink",
  },
};

const healthTagConfig: Record<HealthTag, { icon: typeof Zap; color: string }> = {
  "Energy Boost": { icon: Zap, color: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700" },
  "Immune Support": { icon: Shield, color: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700" },
  "Protein Rich": { icon: Dumbbell, color: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700" },
  "Antioxidant": { icon: Sparkles, color: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700" },
  "Digestive": { icon: HeartPulse, color: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700" },
  "Detox": { icon: Leaf, color: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700" },
  "Anti-Inflammatory": { icon: Shield, color: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700" },
  "Omega-3": { icon: HeartPulse, color: "bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-700" },
  "Vitamin C": { icon: Zap, color: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700" },
  "Heart Healthy": { icon: HeartPulse, color: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700" },
  "Kidney Healthy": { icon: Droplets, color: "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-700" },
  "Low Calorie": { icon: Leaf, color: "bg-lime-100 text-lime-700 border-lime-300 dark:bg-lime-900/30 dark:text-lime-400 dark:border-lime-700" },
  "Hydrating": { icon: Droplets, color: "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-700" },
  "High Fiber": { icon: Leaf, color: "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-700" },
  "Diabetes Friendly": { icon: Shield, color: "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-700" },
};

export function DrinkCard({ drink, isSaved, onSave, onAddToShopping }: DrinkCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const config = drinkTypeConfig[drink.drinkType];
  const matchPercentage = Math.round(
    (drink.matchedIngredients.length / drink.ingredients.length) * 100
  );
  
  const hasSubstitutions = !!(drink.alcoholSubstitutions?.length || drink.virginVersion);

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-500 hover-lift border-border/50",
          "bg-card/80 backdrop-blur-sm",
          "animate-scale-in cursor-pointer"
        )}
        onClick={() => setShowDetail(true)}
      >
        <CardHeader className="p-3 sm:pb-3 sm:p-6 relative">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 opacity-30 pointer-events-none">
            <div className={cn("w-full h-full rounded-full blur-3xl", config.bg)} />
          </div>

          <div className="flex items-start justify-between gap-2 sm:gap-3 relative">
            <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Badge
                  className={cn(
                    "text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border",
                    config.bg,
                    config.border,
                    config.text
                  )}
                >
                  <span className="mr-0.5 sm:mr-1">{config.emoji}</span>
                  {config.label}
                </Badge>
                {drink.isHoliday && (
                  <Badge className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400">
                    <Snowflake className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">Holiday</span>
                  </Badge>
                )}
                {drink.isAlcoholic ? (
                  <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                    <Wine className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Alcoholic</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs text-emerald-600 border-emerald-300 px-1.5 sm:px-2 py-0.5"
                  >
                    <Leaf className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Non-Alcoholic</span>
                  </Badge>
                )}
                {matchPercentage >= 80 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 bg-secondary/10 border-secondary/30 text-secondary"
                  >
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Great Match</span>
                    <span className="sm:hidden">Match</span>
                  </Badge>
                )}
                {hasSubstitutions && (
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400"
                  >
                    <Shuffle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Substitutions</span>
                    <span className="sm:hidden">Subs</span>
                  </Badge>
                )}
              </div>
              <h3 className="font-serif text-base sm:text-xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {drink.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {drink.description}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-0.5">
                <ShareRecipeButton recipe={drink} variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); onSave(); }}
                  className={cn(
                    "shrink-0 rounded-full transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10",
                    isSaved
                      ? "text-primary bg-primary/10 hover:bg-primary/20"
                      : "hover:bg-accent/60"
                  )}
                  aria-label={isSaved ? `Remove ${drink.title} from saved drinks` : `Save ${drink.title}`}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300",
                      isSaved && "fill-current scale-110"
                    )}
                  />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 mt-2.5 sm:mt-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-muted/50">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="font-medium">{drink.prepTime}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-muted/50">
              <GlassWater className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="font-medium truncate max-w-[80px] sm:max-w-none">{drink.glassType}</span>
            </div>
          </div>

          {/* Health benefit tags */}
          {drink.healthTags && drink.healthTags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
              {drink.healthTags.slice(0, 2).map((tag) => {
                const tagConfig = healthTagConfig[tag];
                const TagIcon = tagConfig.icon;
                return (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={cn("text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 border", tagConfig.color)}
                  >
                    <TagIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    {tag}
                  </Badge>
                );
              })}
              {drink.healthTags.length > 2 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs bg-muted/50">
                  +{drink.healthTags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Key ingredients matched */}
          {drink.matchedKeyIngredients && drink.matchedKeyIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2.5 sm:mt-4">
              {drink.matchedKeyIngredients.slice(0, 3).map((ing) => (
                <Badge
                  key={ing}
                  className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-primary/15 border border-primary/30 text-primary"
                >
                  <Key className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  {ing.replace("-", " ")}
                </Badge>
              ))}
              {drink.matchedKeyIngredients.length > 3 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs bg-muted/50">
                  +{drink.matchedKeyIngredients.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Matched ingredients */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
            {drink.matchedIngredients
              .filter((ing) => !drink.matchedKeyIngredients?.includes(ing))
              .slice(0, 3)
              .map((ing) => (
                <Badge
                  key={ing}
                  variant="outline"
                  className="text-[10px] sm:text-xs font-medium bg-secondary/5 border-secondary/20 text-secondary px-1.5 sm:px-2 py-0.5"
                >
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  {ing.replace("-", " ")}
                </Badge>
              ))}
            {drink.matchedIngredients.filter(
              (ing) => !drink.matchedKeyIngredients?.includes(ing)
            ).length > 3 && (
              <Badge variant="outline" className="text-[10px] sm:text-xs bg-muted/50">
                +
                {drink.matchedIngredients.filter(
                  (ing) => !drink.matchedKeyIngredients?.includes(ing)
                ).length - 3}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-3 pb-3 sm:px-6 sm:pb-6 space-y-2 sm:space-y-3">
          <Button
            variant="warm"
            size="sm"
            className="w-full h-9 sm:h-10 text-xs sm:text-sm"
            onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
          >
            <GlassWater className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            View Recipe
          </Button>
        </CardContent>
      </Card>

      <DrinkDetailDialog
        drink={drink}
        open={showDetail}
        onOpenChange={setShowDetail}
        isSaved={isSaved}
        onSave={onSave}
        onAddToShopping={onAddToShopping}
      />
    </>
  );
}
