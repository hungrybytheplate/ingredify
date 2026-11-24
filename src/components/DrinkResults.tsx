import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wine, GlassWater, BlendIcon, Sparkles, Snowflake, X, Zap, Shield, Beef, Heart, Leaf, Flame, Fish, Citrus, Droplets, Apple, Coffee, Sun, CloudSun, Snowflake as Winter, Flower2, PartyPopper, Moon, Users, Utensils } from "lucide-react";
import { DrinkCard } from "./DrinkCard";
import { DrinkCardSkeletonGrid } from "./DrinkCardSkeleton";
import type { Drink, HealthTag, DrinkOccasion, DrinkSeason } from "@/data/drinks";
import { cn } from "@/lib/utils";

interface DrinkResultsProps {
  drinks: Drink[];
  savedDrinks: string[];
  onSave: (drinkId: string) => void;
  onAddToShopping?: (ingredients: string[]) => void;
  loading?: boolean;
}

const healthTagConfig: Record<HealthTag, { icon: React.ElementType; color: string }> = {
  "Energy Boost": { icon: Zap, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800" },
  "Immune Support": { icon: Shield, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  "Protein Rich": { icon: Beef, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800" },
  "Antioxidant": { icon: Sparkles, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  "Digestive": { icon: Apple, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800" },
  "Detox": { icon: Leaf, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  "Anti-Inflammatory": { icon: Flame, color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
  "Omega-3": { icon: Fish, color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800" },
  "Vitamin C": { icon: Citrus, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  "Heart Healthy": { icon: Heart, color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800" },
  "Kidney Healthy": { icon: Droplets, color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" },
  "Low Calorie": { icon: Droplets, color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800" },
  "Hydrating": { icon: Droplets, color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800" },
  "High Fiber": { icon: Leaf, color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300 border-lime-200 dark:border-lime-800" },
  "Diabetes Friendly": { icon: Shield, color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800" },
};

const occasionConfig: Record<DrinkOccasion, { icon: React.ElementType; label: string; color: string }> = {
  brunch: { icon: Utensils, label: "Brunch", color: "bg-amber-500 hover:bg-amber-600" },
  party: { icon: PartyPopper, label: "Party", color: "bg-pink-500 hover:bg-pink-600" },
  "date-night": { icon: Heart, label: "Date Night", color: "bg-rose-500 hover:bg-rose-600" },
  nightcap: { icon: Moon, label: "Nightcap", color: "bg-indigo-500 hover:bg-indigo-600" },
  everyday: { icon: Users, label: "Everyday", color: "bg-slate-500 hover:bg-slate-600" },
};

const seasonConfig: Record<DrinkSeason, { icon: React.ElementType; label: string; color: string }> = {
  summer: { icon: Sun, label: "Summer", color: "bg-yellow-500 hover:bg-yellow-600" },
  fall: { icon: CloudSun, label: "Fall", color: "bg-orange-500 hover:bg-orange-600" },
  winter: { icon: Winter, label: "Winter", color: "bg-blue-500 hover:bg-blue-600" },
  spring: { icon: Flower2, label: "Spring", color: "bg-green-500 hover:bg-green-600" },
  "all-season": { icon: Sparkles, label: "All Season", color: "bg-gray-500 hover:bg-gray-600" },
};

export function DrinkResults({ drinks, savedDrinks, onSave, onAddToShopping, loading }: DrinkResultsProps) {
  const [showHolidayOnly, setShowHolidayOnly] = useState(false);
  const [selectedHealthTags, setSelectedHealthTags] = useState<HealthTag[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<DrinkOccasion | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<DrinkSeason | null>(null);
  const [showVirginOnly, setShowVirginOnly] = useState(false);

  // Get all available health tags from the drinks
  const availableHealthTags = Array.from(
    new Set(drinks.flatMap(d => d.healthTags || []))
  ).sort() as HealthTag[];

  // Get available occasions and seasons
  const availableOccasions = Array.from(
    new Set(drinks.filter(d => d.occasion).map(d => d.occasion!))
  ) as DrinkOccasion[];

  const availableSeasons = Array.from(
    new Set(drinks.filter(d => d.season).map(d => d.season!))
  ) as DrinkSeason[];

  const toggleHealthTag = (tag: HealthTag) => {
    setSelectedHealthTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedHealthTags([]);
    setShowHolidayOnly(false);
    setSelectedOccasion(null);
    setSelectedSeason(null);
    setShowVirginOnly(false);
  };

  const hasActiveFilters = selectedHealthTags.length > 0 || showHolidayOnly || selectedOccasion || selectedSeason || showVirginOnly;

  // Apply filters
  let filteredDrinks = drinks;

  if (showHolidayOnly) {
    filteredDrinks = filteredDrinks.filter(d => d.isHoliday);
  }

  if (selectedHealthTags.length > 0) {
    filteredDrinks = filteredDrinks.filter(d => 
      d.healthTags && selectedHealthTags.some(tag => d.healthTags?.includes(tag))
    );
  }

  if (selectedOccasion) {
    filteredDrinks = filteredDrinks.filter(d => d.occasion === selectedOccasion);
  }

  if (selectedSeason) {
    filteredDrinks = filteredDrinks.filter(d => d.season === selectedSeason || d.season === "all-season");
  }

  if (showVirginOnly) {
    filteredDrinks = filteredDrinks.filter(d => !d.isAlcoholic || d.virginVersion);
  }

  const cocktails = filteredDrinks.filter((d) => d.drinkType === "cocktail");
  const mocktails = filteredDrinks.filter((d) => d.drinkType === "mocktail");
  const smoothies = filteredDrinks.filter((d) => d.drinkType === "smoothie");
  const wellness = filteredDrinks.filter((d) => d.drinkType === "wellness");
  const hotDrinks = filteredDrinks.filter((d) => d.drinkType === "hot");
  // Open on smoothies, unless empty — then the first type that has drinks
  const defaultTab = smoothies.length > 0 ? "smoothie"
    : ([["hot", hotDrinks], ["wellness", wellness], ["mocktail", mocktails], ["cocktail", cocktails]] as const).find(([, list]) => list.length > 0)?.[0] ?? "smoothie";

  const holidayCount = drinks.filter(d => d.isHoliday).length;
  const virginAvailable = drinks.some(d => !d.isAlcoholic || d.virginVersion);

  if (loading) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <DrinkCardSkeletonGrid count={6} />
      </div>
    );
  }

  if (drinks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select all ingredients needed for a drink recipe to see it here!</p>
      </div>
    );
  }

  const renderDrinkGrid = (drinkList: Drink[], emptyMessage: string) => (
    <div className="grid gap-3 md:grid-cols-2">
      {drinkList.length > 0 ? (
        drinkList.map((drink) => (
          <DrinkCard
            key={drink.id}
            drink={drink}
            isSaved={savedDrinks.includes(drink.id)}
            onSave={() => onSave(drink.id)}
            onAddToShopping={onAddToShopping}
          />
        ))
      ) : (
        <p className="text-muted-foreground col-span-2 text-center py-8">
          {hasActiveFilters
            ? "No drinks match your filters. Try adjusting them!"
            : emptyMessage}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Quick Filters Section */}
      <div className="p-3 bg-card rounded-xl border border-border/50 shadow-sm space-y-3">
        {/* Row 1: Quick category filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Holiday Filter */}
          {holidayCount > 0 && (
            <Badge
              variant={showHolidayOnly ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105 px-3 py-1.5",
                showHolidayOnly 
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                  : "bg-background hover:bg-muted border-border"
              )}
              onClick={() => setShowHolidayOnly(!showHolidayOnly)}
            >
              <Snowflake className="h-3.5 w-3.5 mr-1.5" />
              Holiday
            </Badge>
          )}

          {/* Virgin Toggle */}
          {virginAvailable && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
              <Switch
                id="virgin-mode"
                checked={showVirginOnly}
                onCheckedChange={setShowVirginOnly}
                className="scale-75"
              />
              <Label htmlFor="virgin-mode" className="text-xs font-medium cursor-pointer">
                Non-Alcoholic Only
              </Label>
            </div>
          )}

          {/* Clear All */}
          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors ml-auto"
              aria-label="Clear all filters"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>

        {/* Row 2: Occasion filters */}
        {availableOccasions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground mr-1">Occasion:</span>
            {availableOccasions.map((occasion) => {
              const config = occasionConfig[occasion];
              const Icon = config.icon;
              const isSelected = selectedOccasion === occasion;
              return (
                <Badge
                  key={occasion}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105 px-2.5 py-1",
                    isSelected 
                      ? cn(config.color, "text-white shadow-md") 
                      : "bg-background hover:bg-muted border-border"
                  )}
                  onClick={() => setSelectedOccasion(isSelected ? null : occasion)}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Row 3: Season filters */}
        {availableSeasons.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground mr-1">Season:</span>
            {availableSeasons.filter(s => s !== "all-season").map((season) => {
              const config = seasonConfig[season];
              const Icon = config.icon;
              const isSelected = selectedSeason === season;
              return (
                <Badge
                  key={season}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105 px-2.5 py-1",
                    isSelected 
                      ? cn(config.color, "text-white shadow-md") 
                      : "bg-background hover:bg-muted border-border"
                  )}
                  onClick={() => setSelectedSeason(isSelected ? null : season)}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Row 4: Health Tag Filters */}
        {availableHealthTags.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Health benefits:</span>
            <div className="flex flex-wrap gap-1.5">
              {availableHealthTags.slice(0, 8).map((tag) => {
                const config = healthTagConfig[tag];
                const Icon = config?.icon || Sparkles;
                const isSelected = selectedHealthTags.includes(tag);
                
                return (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105 px-2 py-0.5 text-[10px]",
                      isSelected 
                        ? cn(config?.color, "shadow-sm ring-1 ring-offset-1 ring-primary/20") 
                        : "bg-background hover:bg-muted border-border"
                    )}
                    onClick={() => toggleHealthTag(tag)}
                  >
                    <Icon className="h-2.5 w-2.5 mr-0.5" />
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Drink Type Tabs */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5 h-12 bg-muted/50 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="hot"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-1 sm:gap-2"
            aria-label={`Hot drinks tab, ${hotDrinks.length} drinks`}
          >
            <Coffee className="h-4 w-4" />
            <span className="hidden sm:inline">Hot</span>
            <span className="text-xs text-muted-foreground">({hotDrinks.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="smoothie"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-1 sm:gap-2"
            aria-label={`Smoothies tab, ${smoothies.length} drinks`}
          >
            <BlendIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Smoothies</span>
            <span className="text-xs text-muted-foreground">({smoothies.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="wellness"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-1 sm:gap-2"
            aria-label={`Wellness tab, ${wellness.length} drinks`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Wellness</span>
            <span className="text-xs text-muted-foreground">({wellness.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="mocktail"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-1 sm:gap-2"
            aria-label={`Mocktails tab, ${mocktails.length} drinks`}
          >
            <GlassWater className="h-4 w-4" />
            <span className="hidden sm:inline">Mocktails</span>
            <span className="text-xs text-muted-foreground">({mocktails.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="cocktail"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-1 sm:gap-2"
            aria-label={`Cocktails tab, ${cocktails.length} drinks`}
          >
            <Wine className="h-4 w-4" />
            <span className="hidden sm:inline">Cocktails</span>
            <span className="text-xs text-muted-foreground">({cocktails.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hot" className="mt-0">
          {renderDrinkGrid(hotDrinks, "No hot drinks match. Select espresso, milk, or other hot beverage ingredients!")}
        </TabsContent>

        <TabsContent value="smoothie" className="mt-0">
          {renderDrinkGrid(smoothies, "No smoothies match. Select all ingredients for a smoothie recipe!")}
        </TabsContent>

        <TabsContent value="wellness" className="mt-0">
          {renderDrinkGrid(wellness, "No wellness drinks match. Select all ingredients for a wellness recipe!")}
        </TabsContent>

        <TabsContent value="mocktail" className="mt-0">
          {renderDrinkGrid(mocktails, "No mocktails match. Select all ingredients for a mocktail recipe!")}
        </TabsContent>

        <TabsContent value="cocktail" className="mt-0">
          {renderDrinkGrid(cocktails, "No cocktails match. Select all ingredients for a cocktail recipe!")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
