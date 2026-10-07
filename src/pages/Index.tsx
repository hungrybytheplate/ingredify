import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { SEOHead, generateRecipeCollectionSchema, generateMealPlanningGuideSchema, injectStructuredData } from "@/components/SEOHead";
import { SEOContent } from "@/components/SEOContent";
import { IngredientSelector } from "@/components/IngredientSelector";
import { formatIngredientLabel, isCustomIngredientId } from "@/components/CustomIngredientInput";

// Lazy load components not needed for initial render
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
const RecipeResults = lazy(() => import("@/components/RecipeResults").then(m => ({ default: m.RecipeResults })));
const RecipeDetailDialog = lazy(() => import("@/components/RecipeDetailDialog").then(m => ({ default: m.RecipeDetailDialog })));
const DrinkDetailDialog = lazy(() => import("@/components/DrinkDetailDialog").then(m => ({ default: m.DrinkDetailDialog })));
const AddToCalendarDialog = lazy(() => import("@/components/AddToCalendarDialog").then(m => ({ default: m.AddToCalendarDialog })));
const AddToShoppingDialog = lazy(() => import("@/components/AddToShoppingDialog").then(m => ({ default: m.AddToShoppingDialog })));
const UndoToast = lazy(() => import("@/components/UndoToast").then(m => ({ default: m.UndoToast })));
const RecipeSearchAutocomplete = lazy(() => import("@/components/RecipeSearchAutocomplete").then(m => ({ default: m.RecipeSearchAutocomplete })));
const BottomNav = lazy(() => import("@/components/BottomNav").then(m => ({ default: m.BottomNav })));

// Lazy load heavy tab components
const DrinkIngredientSelector = lazy(() => import("@/components/DrinkIngredientSelector").then(m => ({ default: m.DrinkIngredientSelector })));
const DrinkResults = lazy(() => import("@/components/DrinkResults").then(m => ({ default: m.DrinkResults })));
const GarnishSuggestions = lazy(() => import("@/components/GarnishSuggestions").then(m => ({ default: m.GarnishSuggestions })));
const GlasswareGuide = lazy(() => import("@/components/GlasswareGuide").then(m => ({ default: m.GlasswareGuide })));
const MealCalendar = lazy(() => import("@/components/MealCalendar").then(m => ({ default: m.MealCalendar })));
const SavedRecipes = lazy(() => import("@/components/SavedRecipes").then(m => ({ default: m.SavedRecipes })));
const ShoppingList = lazy(() => import("@/components/ShoppingList").then(m => ({ default: m.ShoppingList })));
const WeeklyNutritionSummary = lazy(() => import("@/components/WeeklyNutritionSummary").then(m => ({ default: m.WeeklyNutritionSummary })));
const WelcomeTour = lazy(() => import("@/components/WelcomeTour").then(m => ({ default: m.WelcomeTour })));
const KeyboardShortcutsHelp = lazy(() => import("@/components/KeyboardShortcutsHelp").then(m => ({ default: m.KeyboardShortcutsHelp })));
const RecentlyViewed = lazy(() => import("@/components/RecentlyViewed").then(m => ({ default: m.RecentlyViewed })));
const SmartSuggestions = lazy(() => import("@/components/SmartSuggestions").then(m => ({ default: m.SmartSuggestions })));
const RecipePreviewDialog = lazy(() => import("@/components/RecipePreviewDialog").then(m => ({ default: m.RecipePreviewDialog })));

import { QuickTooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/hooks/useAuth";
import { useUserData, type ShoppingItem, type MealPlanEntry, type RecipeNotes } from "@/hooks/useUserData";
import { useIsMobile } from "@/hooks/use-mobile";

import { useUndo } from "@/hooks/useUndo";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useRecipeSaveCounts } from "@/hooks/useRecipeSaveCounts";
import { usePantry } from "@/hooks/usePantry";
import { getRecipesForIngredients, sampleRecipes, type Recipe } from "@/data/recipes";
import { getDrinksForIngredients, sampleDrinks, type Drink } from "@/data/drinks";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { format } from "date-fns";
import { Sparkles, Calendar, Heart, UtensilsCrossed, X, ShoppingCart, Wine, GlassWater, Search, Clock, Snowflake, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";

const InstallBanner = lazy(() => import("@/components/InstallBanner").then(m => ({ default: m.InstallBanner })));

const LazyFallback = () => <div className="animate-pulse p-4 text-center text-muted-foreground text-sm">Loading...</div>;

// Inline Lookup Results Component
interface LookupResultsProps {
  search: string;
  onAddToShopping: (ingredients: string[]) => void;
  onClear: () => void;
  savedRecipes: string[];
  onSave: (recipeId: string) => void;
  onAddToCalendar: (recipe: Recipe) => void;
}

function LookupResults({ search, onAddToShopping, onClear, savedRecipes, onSave, onAddToCalendar }: LookupResultsProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const matchingRecipes = sampleRecipes
    .filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  const mealTypeColors: Record<string, string> = {
    breakfast: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    lunch: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    dinner: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    dessert: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    sides: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  };

  if (matchingRecipes.length === 0) {
    return (
      <div className="absolute z-50 w-full mt-2 p-4 rounded-xl bg-card border border-border shadow-elevated text-center">
        <p className="text-muted-foreground text-sm">No recipes found for "{search}"</p>
      </div>
    );
  }

  return (
    <>
      <div className="absolute z-50 w-full mt-2 rounded-xl bg-card border border-border shadow-elevated overflow-hidden max-h-[400px] overflow-y-auto">
        {matchingRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="p-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", mealTypeColors[recipe.mealType])}>
                  {recipe.mealType}
                </Badge>
                <span className="font-medium text-sm">{recipe.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {recipe.cookTime}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {recipe.ingredients.slice(0, 6).map((ing) => (
                <Badge key={ing} variant="outline" className="text-[10px] capitalize">
                  {ing.replace(/-/g, " ")}
                </Badge>
              ))}
              {recipe.ingredients.length > 6 && (
                <Badge variant="outline" className="text-[10px]">+{recipe.ingredients.length - 6} more</Badge>
              )}
            </div>
            <Button
              size="sm"
              variant="warm"
              className="w-full h-8 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onAddToShopping(recipe.ingredients);
                onClear();
              }}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add {recipe.ingredients.length} ingredients to list
            </Button>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <RecipeDetailDialog
          recipe={{
            ...selectedRecipe,
            matchedIngredients: [],
            matchedKeyIngredients: []
          }}
          open={!!selectedRecipe}
          onOpenChange={(open) => !open && setSelectedRecipe(null)}
          isSaved={savedRecipes.includes(selectedRecipe.id)}
          onSave={() => onSave(selectedRecipe.id)}
          onAddToCalendar={() => onAddToCalendar(selectedRecipe)}
          onAddToShopping={(ing) => onAddToShopping([ing])}
        />
      )}
    </>
  );
}

// Inline Drink Lookup Results Component
interface DrinkLookupResultsProps {
  search: string;
  onAddToShopping: (ingredients: string[]) => void;
  onClear: () => void;
  savedDrinks: string[];
  onSave: (drinkId: string) => void;
}

function DrinkLookupResults({ search, onAddToShopping, onClear, savedDrinks, onSave }: DrinkLookupResultsProps) {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  
  const matchingDrinks = sampleDrinks
    .filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  const drinkTypeColors: Record<string, string> = {
    cocktail: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    mocktail: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    smoothie: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    wellness: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  };

  if (matchingDrinks.length === 0) {
    return (
      <div className="absolute z-50 w-full mt-2 p-4 rounded-xl bg-card border border-border shadow-elevated text-center">
        <p className="text-muted-foreground text-sm">No drinks found for "{search}"</p>
      </div>
    );
  }

  return (
    <>
      <div className="absolute z-50 w-full mt-2 rounded-xl bg-card border border-border shadow-elevated overflow-hidden max-h-[400px] overflow-y-auto">
        {matchingDrinks.map((drink) => (
          <div
            key={drink.id}
            className="p-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 cursor-pointer"
            onClick={() => setSelectedDrink(drink)}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs capitalize", drinkTypeColors[drink.drinkType])}>
                  {drink.drinkType}
                </Badge>
                <span className="font-medium text-sm">{drink.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {drink.prepTime}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {drink.ingredients.slice(0, 6).map((ing) => (
                <Badge key={ing} variant="outline" className="text-[10px] capitalize">
                  {ing.replace(/-/g, " ")}
                </Badge>
              ))}
              {drink.ingredients.length > 6 && (
                <Badge variant="outline" className="text-[10px]">+{drink.ingredients.length - 6} more</Badge>
              )}
            </div>
            <Button
              size="sm"
              variant="warm"
              className="w-full h-8 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onAddToShopping(drink.ingredients);
                onClear();
              }}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add {drink.ingredients.length} ingredients to list
            </Button>
          </div>
        ))}
      </div>

      {selectedDrink && (
        <DrinkDetailDialog
          drink={{
            ...selectedDrink,
            matchedIngredients: [],
            matchedKeyIngredients: []
          }}
          open={!!selectedDrink}
          onOpenChange={(open) => !open && setSelectedDrink(null)}
          isSaved={savedDrinks.includes(selectedDrink.id)}
          onSave={() => onSave(selectedDrink.id)}
          onAddToShopping={onAddToShopping}
        />
      )}
    </>
  );
}

const Index = () => {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    savedRecipes,
    savedDrinks,
    mealPlan,
    shoppingList,
    recipeNotes,
    loading: dataLoading,
    saveRecipe,
    saveDrink,
    addToMealPlan,
    removeFromMealPlan,
    moveMeal,
    addToShoppingList,
    toggleShoppingItem,
    removeFromShoppingList,
    clearShoppingList,
    updateRecipeNotes,
    ratings,
    setItemRating,
    recipeOverrides,
    updateRecipeOverride,
  } = useUserData();
  
  const { pendingAction, addUndoAction, executeUndo, dismissUndo, hasUndo } = useUndo();
  const { recentlyViewed, addRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { saveCounts } = useRecipeSaveCounts();
  const { pantryItems: userPantryItems, togglePantryItem } = usePantry();
  const [recentViewedRecipe, setRecentViewedRecipe] = useState<Recipe | null>(null);
  const [recentViewedDrink, setRecentViewedDrink] = useState<Drink | null>(null);
  const [sharedRecipeDialog, setSharedRecipeDialog] = useState<Recipe | null>(null);
  const [pantryAutoApplied, setPantryAutoApplied] = useState(false);

  // Inject structured data on mount
  useEffect(() => {
    injectStructuredData(generateRecipeCollectionSchema(), "recipe-collection-schema");
    injectStructuredData(generateMealPlanningGuideSchema(), "meal-planning-guide-schema");
    
    return () => {
      // Cleanup on unmount
      document.getElementById("recipe-collection-schema")?.remove();
      document.getElementById("meal-planning-guide-schema")?.remove();
    };
  }, []);

  // Handle shared recipe URL
  useEffect(() => {
    const recipeId = searchParams.get('recipe');
    if (recipeId) {
      const recipe = sampleRecipes.find(r => r.id === recipeId);
      if (recipe) {
        setSharedRecipeDialog(recipe);
        addRecentlyViewed(recipeId);
        // Clear the URL param without refreshing
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams, addRecentlyViewed]);

  // Listen for clicks on the "Popular Recipe Searches" tags in <SEOContent />.
  // Switch to Plate mode + ingredients tab, scroll up, and re-dispatch the
  // event after the autocomplete remounts in "cook" mode so its own listener
  // (which early-returns when mode !== "cook") receives it. We tag the
  // re-dispatched event with `__forwarded` so this handler ignores it and we
  // don't loop.
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ term?: string; mode?: "cook" | "drink"; __forwarded?: boolean }>).detail;
      if (detail?.__forwarded) return;
      const term = detail?.term?.trim();
      if (!term) return;
      const targetMode = detail?.mode === "drink" ? "drink" : "cook";
      setAppMode(targetMode);
      setActiveTab("ingredients");
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Wait one tick for the autocomplete to register its listener with the
      // updated mode-dependent deps, then re-fire the event so the search
      // box prefills and the suggestions dropdown opens.
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("popular-search", {
            detail: { term, mode: targetMode, __forwarded: true },
          }),
        );
      }, 50);
    };
    window.addEventListener("popular-search", handler as EventListener);
    return () => window.removeEventListener("popular-search", handler as EventListener);
  }, []);

  // Auto-select pantry items when user is logged in and pantry loads
  useEffect(() => {
    if (userPantryItems.length > 0 && !pantryAutoApplied && user) {
      setSelectedIngredients(prev => {
        const newSelection = [...prev];
        userPantryItems.forEach(item => {
          if (!newSelection.includes(item)) {
            newSelection.push(item);
          }
        });
        return newSelection;
      });
      setPantryAutoApplied(true);
    }
  }, [userPantryItems, pantryAutoApplied, user]);

  // Mode switching (Cook vs Drink)
  const [appMode, setAppMode] = useState<"cook" | "drink">("cook");
  
  // Cook mode state
  // Persisted in localStorage so selections (including custom "Other"
  // ingredients) survive page reloads and return visits.
  const [selectedIngredients, setSelectedIngredients] = useLocalStorage<string[]>(
    "kitchen.selectedIngredients",
    [],
  );
  const [showRecipes, setShowRecipes] = useState(false);
  const [showRecipePreview, setShowRecipePreview] = useState(false);
  const recipeResultsRef = useRef<HTMLDivElement>(null);
  const [recipeSearch, setRecipeSearch] = useState("");
  
  // Drink mode state
  const [selectedDrinkIngredients, setSelectedDrinkIngredients] = useLocalStorage<string[]>(
    "kitchen.selectedDrinkIngredients",
    [],
  );
  const [showDrinks, setShowDrinks] = useState(false);
  const [drinkSearch, setDrinkSearch] = useState("");
  
  // Shared state
  const [calendarDialogRecipe, setCalendarDialogRecipe] = useState<Recipe | null>(null);
  const [shoppingDialogIngredient, setShoppingDialogIngredient] = useState<string | null>(null);
  const [hasSeenTour, setHasSeenTour] = useLocalStorage<boolean>("hasSeenTour", false);
  const [showTour, setShowTour] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get("tab");
    return tab && ["ingredients", "saved", "calendar", "shopping"].includes(tab) ? tab : "ingredients";
  });
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  useEffect(() => {
    if (!hasSeenTour && !isMobile) {
      setShowTour(true);
    }
  }, [hasSeenTour, isMobile]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 's', action: () => setActiveTab('shopping'), description: 'Shopping list' },
    { key: 'm', action: () => setActiveTab('calendar'), description: 'Meal plan' },
    { key: 'r', action: () => setActiveTab('saved'), description: 'Saved recipes' },
    { key: 'i', action: () => setActiveTab('ingredients'), description: 'Ingredients' },
    { key: '?', action: () => setShowShortcutsHelp(true), description: 'Show help' },
    { key: 'Escape', action: () => {
      setCalendarDialogRecipe(null);
      setShoppingDialogIngredient(null);
      setShowShortcutsHelp(false);
    }, description: 'Close dialogs' },
  ]);

  const allRecipes = getRecipesForIngredients(selectedIngredients);
  const allDrinks = getDrinksForIngredients(selectedDrinkIngredients);
  
  // Filter by search
  const recipes = allRecipes.filter(r => 
    r.title.toLowerCase().includes(recipeSearch.toLowerCase())
  );
  const drinks = allDrinks.filter(d => 
    d.title.toLowerCase().includes(drinkSearch.toLowerCase())
  );

  // Cook mode handlers
  const handleToggleIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
    setShowRecipes(false);
  };

  const handleGenerateRecipes = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to generate recipes.",
        variant: "destructive",
      });
      return;
    }
    // Show confirmation summary first
    setShowRecipePreview(true);
  };

  const handleConfirmGenerateRecipes = () => {
    setShowRecipePreview(false);
    setShowRecipes(true);
    toast({
      title: "Recipes found!",
      description: `Found ${recipes.length} recipes matching your ingredients.`,
    });
    requestAnimationFrame(() => {
      setTimeout(() => {
        recipeResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
  };

  // Drink mode handlers
  const handleToggleDrinkIngredient = (id: string) => {
    setSelectedDrinkIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClearAllDrinks = () => {
    setSelectedDrinkIngredients([]);
    setShowDrinks(false);
  };

  const handleGenerateDrinks = () => {
    if (selectedDrinkIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to find drinks.",
        variant: "destructive",
      });
      return;
    }
    setShowDrinks(true);
    toast({
      title: "Drinks found!",
      description: `Found ${drinks.length} drinks matching your ingredients.`,
    });
  };

  const handleSaveDrink = async (drinkId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save drinks.",
        variant: "destructive",
      });
      return;
    }
    const isSaving = !savedDrinks.includes(drinkId);
    await saveDrink(drinkId);
    toast({
      title: isSaving ? "Drink saved! 🥂" : "Drink removed",
      description: isSaving
        ? "Find it anytime in your Saved tab."
        : "Drink removed from your saved list.",
      action: (
        <ToastAction
          altText="View saved drinks"
          onClick={() => {
            setActiveTab("saved");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          View saved
        </ToastAction>
      ),
    });
  };

  // Shared handlers
  const handleSaveRecipe = async (recipeId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save recipes.",
        variant: "destructive",
      });
      return;
    }
    const isSaving = !savedRecipes.includes(recipeId);
    await saveRecipe(recipeId);
    toast({
      title: isSaving ? "Recipe saved! ❤️" : "Recipe removed",
      description: isSaving
        ? "Find it anytime in your Saved tab."
        : "Recipe removed from your saved list.",
      action: (
        <ToastAction
          altText="View saved recipes"
          onClick={() => {
            setActiveTab("saved");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          View saved
        </ToastAction>
      ),
    });
  };

  const handleAddToCalendar = (recipe: Recipe) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the meal planner.",
        variant: "destructive",
      });
      return;
    }
    setCalendarDialogRecipe(recipe);
  };

  const handleConfirmCalendarAdd = async (date: Date) => {
    if (!calendarDialogRecipe) return;
    
    await addToMealPlan(format(date, "yyyy-MM-dd"), calendarDialogRecipe);
    toast({
      title: "Added to meal plan!",
      description: `${calendarDialogRecipe.title} added for ${format(date, "EEEE, MMM d")}.`,
    });
    setCalendarDialogRecipe(null);
  };

  const handleRemoveFromCalendar = useCallback(async (date: string, recipeId: string) => {
    // Find the meal entry for undo
    const mealEntry = mealPlan.find(m => m.date === date && m.recipe.id === recipeId);
    
    await removeFromMealPlan(date, recipeId);
    
    if (mealEntry) {
      addUndoAction({
        id: `meal-${date}-${recipeId}`,
        description: `Restored "${mealEntry.recipe.title}" to meal plan`,
        data: mealEntry,
        undo: async () => {
          await addToMealPlan(date, mealEntry.recipe);
        }
      });
    }
    
    toast({
      title: "Removed from meal plan",
      description: "The recipe has been removed. Undo available for 5 seconds.",
    });
  }, [mealPlan, removeFromMealPlan, addToMealPlan, addUndoAction]);

  const handleAddToShopping = (ingredientId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the shopping list.",
        variant: "destructive",
      });
      return;
    }
    setShoppingDialogIngredient(ingredientId);
  };

  const handleConfirmShoppingAdd = async (ingredientId: string, variant: string) => {
    const exists = shoppingList.some(item => item.variant === variant);
    if (exists) {
      toast({
        title: "Already in list",
        description: `${variant} is already in your shopping list.`,
      });
      return;
    }
    
    await addToShoppingList(ingredientId, variant);
    toast({
      title: "Added to shopping list",
      description: `${variant} has been added to your list.`,
    });
  };

  const handleToggleShoppingItem = async (id: string) => {
    await toggleShoppingItem(id);
  };

  const handleRemoveShoppingItem = useCallback(async (id: string) => {
    // Find the item for undo
    const item = shoppingList.find(i => i.id === id);
    
    await removeFromShoppingList(id);
    
    if (item) {
      addUndoAction({
        id: `shopping-${id}`,
        description: `Restored "${item.variant}" to shopping list`,
        data: item,
        undo: async () => {
          await addToShoppingList(item.ingredientId, item.variant);
        }
      });
    }
  }, [shoppingList, removeFromShoppingList, addToShoppingList, addUndoAction]);

  const handleClearCompletedShopping = async () => {
    // Remove checked items one by one
    const checkedItems = shoppingList.filter(item => item.checked);
    for (const item of checkedItems) {
      await removeFromShoppingList(item.id);
    }
    toast({
      title: "Cleared completed items",
      description: "All checked items have been removed.",
    });
  };

  const handleClearAllShopping = async () => {
    await clearShoppingList();
    toast({
      title: "Shopping list cleared",
      description: "All items have been removed.",
    });
  };

  const handleBulkAddToShopping = async (ingredients: string[]) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the shopping list.",
        variant: "destructive",
      });
      return;
    }
    
    let addedCount = 0;
    
    for (const ing of ingredients) {
      const label = formatIngredientLabel(ing);
      // Preserve user-entered casing for custom ingredients; title-case built-ins.
      const formattedVariant = isCustomIngredientId(ing)
        ? label
        : label.charAt(0).toUpperCase() + label.slice(1);
      const variant = formattedVariant;
      const exists = shoppingList.some(item => item.variant.toLowerCase() === variant.toLowerCase());
      if (!exists) {
        await addToShoppingList(ing, formattedVariant);
        addedCount++;
      }
    }
    
    if (addedCount > 0) {
      toast({
        title: "Added to shopping list!",
        description: `${addedCount} ingredient${addedCount > 1 ? 's' : ''} added to your list.`,
      });
    } else {
      toast({
        title: "Already in list",
        description: "All these ingredients are already in your shopping list.",
      });
    }
  };

  const handleCompleteTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
    toast({
      title: "Welcome aboard! 🎉",
      description: "Start by selecting ingredients from your kitchen.",
    });
  };

  const handleSkipTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
  };

  return (
    <div className="min-h-screen gradient-glow pb-24 sm:pb-0 relative z-0">
      <SEOHead />
      
      {showTour && (
        <Suspense fallback={null}><WelcomeTour onComplete={handleCompleteTour} onSkip={handleSkipTour} /></Suspense>
      )}
      
      <Suspense fallback={null}><InstallBanner /></Suspense>
      
      <Header onShowTour={() => setShowTour(true)} />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8" role="main" id="main-content">
        {/* Top-level Cook/Drink toggle */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="inline-flex p-1 sm:p-1.5 rounded-xl sm:rounded-2xl glass shadow-soft" data-tour="mode-switch">
            <button
              onClick={() => setAppMode("cook")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base",
                appMode === "cook"
                  ? "bg-card shadow-md text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Plate</span>
            </button>
            <button
              onClick={() => setAppMode("drink")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base",
                appMode === "drink"
                  ? "bg-card shadow-md text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Wine className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Glass</span>
            </button>
          </div>
          
          {/* Recipe/Drink Search with Autocomplete */}
          <div className="w-full max-w-lg">
            <RecipeSearchAutocomplete
              mode={appMode}
              onSelectRecipe={(recipe) => {
                setRecentViewedRecipe(recipe);
                addRecentlyViewed(recipe.id);
              }}
              onSelectDrink={(drink) => {
                // For drinks, we can show a detail dialog or handle similarly
                // For now, we'll set up state for viewing drink details
                const drinkWithMatched = {
                  ...drink,
                  matchedIngredients: [],
                  matchedKeyIngredients: [],
                };
                setRecentViewedDrink(drinkWithMatched);
              }}
              savedRecipes={savedRecipes}
              savedDrinks={savedDrinks}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <TabsList className="hidden sm:grid w-full max-w-2xl mx-auto grid-cols-4 h-12 sm:h-14 glass p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-soft">
            <QuickTooltip content={appMode === "cook" ? "Select ingredients & find recipes" : "Select ingredients & find drinks"} side="bottom">
              <TabsTrigger value="ingredients" aria-label={appMode === "cook" ? "Cook - Select ingredients and find recipes" : "Mix - Select ingredients and find drinks"} className="rounded-lg sm:rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-primary flex items-center justify-center gap-1 sm:gap-2 font-semibold transition-all duration-300 text-xs sm:text-sm px-1 sm:px-3">
                {appMode === "cook" ? <UtensilsCrossed className="h-4 w-4 shrink-0" /> : <GlassWater className="h-4 w-4 shrink-0" />}
                <span className="hidden sm:inline">{appMode === "cook" ? "Cook" : "Mix"}</span>
              </TabsTrigger>
            </QuickTooltip>
            <QuickTooltip content="Plan your weekly meals" side="bottom">
              <TabsTrigger data-tour="calendar-tab" value="calendar" aria-label="Plan - Plan your weekly meals" className="rounded-lg sm:rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-primary flex items-center justify-center gap-1 sm:gap-2 font-semibold transition-all duration-300 text-xs sm:text-sm px-1 sm:px-3 relative">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Plan</span>
                {mealPlan.length > 0 && (
                  <Badge className="h-4 sm:h-5 min-w-4 sm:min-w-5 p-0 text-[9px] sm:text-[10px] flex items-center justify-center bg-secondary text-secondary-foreground ml-0.5 sm:ml-1">
                    {mealPlan.length}
                  </Badge>
                )}
              </TabsTrigger>
            </QuickTooltip>
            <QuickTooltip content="Your favorite recipes" side="bottom">
              <TabsTrigger data-tour="saved-tab" value="saved" aria-label="Saved - Your favorite recipes" className="rounded-lg sm:rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-primary flex items-center justify-center gap-1 sm:gap-2 font-semibold transition-all duration-300 text-xs sm:text-sm px-1 sm:px-3 relative">
                <Heart className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Saved</span>
                {(savedRecipes.length + savedDrinks.length) > 0 && (
                  <Badge className="h-4 sm:h-5 min-w-4 sm:min-w-5 p-0 text-[9px] sm:text-[10px] flex items-center justify-center bg-primary/20 text-primary ml-0.5 sm:ml-1">
                    {savedRecipes.length + savedDrinks.length}
                  </Badge>
                )}
              </TabsTrigger>
            </QuickTooltip>
            <QuickTooltip content="Your shopping list" side="bottom">
              <TabsTrigger data-tour="shopping-tab" value="shopping" aria-label="Shop - Your shopping list" className="rounded-lg sm:rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-primary flex items-center justify-center gap-1 sm:gap-2 font-semibold transition-all duration-300 text-xs sm:text-sm px-1 sm:px-3 relative">
                <ShoppingCart className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Shop</span>
                {shoppingList.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 h-4 sm:h-5 min-w-4 sm:min-w-5 p-0 text-[9px] sm:text-[10px] flex items-center justify-center gradient-warm border-2 border-background">
                    {shoppingList.length}
                  </Badge>
                )}
              </TabsTrigger>
            </QuickTooltip>
          </TabsList>

          <TabsContent value="ingredients" className="space-y-8 mt-8 animate-fade-in">
            {/* Recently Viewed Section */}
            {appMode === "cook" && recentlyViewed.length > 0 && (
              <Suspense fallback={null}>
                <RecentlyViewed
                  recentIds={recentlyViewed}
                  onClear={clearRecentlyViewed}
                  onViewRecipe={(recipe) => {
                    setRecentViewedRecipe(recipe);
                    addRecentlyViewed(recipe.id);
                  }}
                  savedRecipes={savedRecipes}
                  onSaveRecipe={handleSaveRecipe}
                  onAddToCalendar={handleAddToCalendar}
                />
              </Suspense>
            )}

            {appMode === "cook" ? (
              // COOK MODE
            <div className="grid gap-4 lg:grid-cols-2">
                {isMobile && selectedIngredients.length === 0 && !showRecipes && (
                  <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-soft lg:col-span-2">
                    <p className="font-serif text-xl font-semibold text-foreground">Tap what's in your fridge</p>
                    <p className="text-sm text-muted-foreground mt-1">Pick a few, then tap Find Recipes. We'll show what you can make.</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { id: "eggs", label: "🥚 Eggs" },
                        { id: "chicken-breast", label: "🍗 Chicken" },
                        { id: "ground-beef", label: "🥩 Ground beef" },
                        { id: "rice-white", label: "🍚 Rice" },
                        { id: "pasta-spaghetti", label: "🍝 Pasta" },
                        { id: "russet-potato", label: "🥔 Potatoes" },
                      ].map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => handleToggleIngredient(q.id)}
                          className="min-h-10 px-4 rounded-full border border-border bg-background text-sm font-medium text-foreground active:scale-95 transition-transform"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Card className="shadow-elevated border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden" data-tour="ingredients">
                  <div className="absolute top-0 left-0 w-full h-1 gradient-warm" />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-serif text-xl sm:text-2xl">What's in your kitchen?</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Select ingredients to find matching recipes</p>
                      </div>
                      {selectedIngredients.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-muted-foreground hover:text-destructive">
                          Clear all
                        </Button>
                      )}
                    </div>
                    {selectedIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                        {selectedIngredients.slice(0, 8).map((id, index) => (
                          <Badge
                            key={id}
                            variant="secondary"
                            className={cn(
                              "capitalize cursor-pointer transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground group px-3 py-1",
                              `stagger-${Math.min(index + 1, 5)}`
                            )}
                            onClick={() => handleToggleIngredient(id)}
                          >
                            {formatIngredientLabel(id)}
                            <X className="h-3 w-3 ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </Badge>
                        ))}
                        {selectedIngredients.length > 8 && (
                          <Badge variant="outline" className="px-3">+{selectedIngredients.length - 8} more</Badge>
                        )}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <IngredientSelector
                      selectedIngredients={selectedIngredients}
                      onToggle={handleToggleIngredient}
                      userPantryItems={userPantryItems}
                      onTogglePantry={togglePantryItem}
                      onAddCustomIngredient={handleToggleIngredient}
                    />
                  </CardContent>
                </Card>

                <div className="sticky bottom-20 sm:relative sm:bottom-auto z-50 py-2 sm:py-0 -mt-2" data-tour="find-recipes">
                  <Button
                    variant="warm"
                    size="xl"
                    className="w-full shadow-lg"
                    onClick={handleGenerateRecipes}
                    disabled={selectedIngredients.length === 0}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Find Recipes ({selectedIngredients.length} ingredients)
                  </Button>
                </div>

                <div className="space-y-4" ref={recipeResultsRef}>
                  {showRecipes ? (
                    <RecipeResults
                      recipes={recipes}
                      savedRecipes={savedRecipes}
                      onSave={handleSaveRecipe}
                      onAddToCalendar={handleAddToCalendar}
                      onAddToShopping={handleAddToShopping}
                      onViewRecipe={(recipe) => addRecentlyViewed(recipe.id)}
                      loading={dataLoading}
                      saveCounts={saveCounts}
                      ratings={ratings}
                    />
                  ) : (
                    <Card className="shadow-elevated border-border/50 bg-card/90 backdrop-blur-sm">
                      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 gradient-warm blur-2xl opacity-30 animate-pulse-soft" />
                          <div className="relative p-5 rounded-3xl gradient-warm shadow-warm">
                            <Sparkles className="h-10 w-10 text-primary-foreground" />
                          </div>
                        </div>
                        <h3 className="font-serif text-2xl font-semibold mb-3">
                          Ready to cook?
                        </h3>
                        <p className="text-muted-foreground max-w-sm leading-relaxed">
                          Select ingredients or use the search above to look up any recipe and build your shopping list!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              // DRINK MODE
              <Suspense fallback={<LazyFallback />}>
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="shadow-elevated border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 gradient-warm" />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-serif text-xl sm:text-2xl">What's in your bar?</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Select spirits, mixers & garnishes</p>
                      </div>
                      {selectedDrinkIngredients.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleClearAllDrinks} className="text-muted-foreground hover:text-destructive">
                          Clear all
                        </Button>
                      )}
                    </div>
                    {selectedDrinkIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                        {selectedDrinkIngredients.slice(0, 8).map((id, index) => (
                          <Badge
                            key={id}
                            variant="secondary"
                            className={cn(
                              "capitalize cursor-pointer transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground group px-3 py-1",
                              `stagger-${Math.min(index + 1, 5)}`
                            )}
                            onClick={() => handleToggleDrinkIngredient(id)}
                          >
                            {formatIngredientLabel(id)}
                            <X className="h-3 w-3 ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </Badge>
                        ))}
                        {selectedDrinkIngredients.length > 8 && (
                          <Badge variant="outline" className="px-3">+{selectedDrinkIngredients.length - 8} more</Badge>
                        )}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <DrinkIngredientSelector
                      selectedIngredients={selectedDrinkIngredients}
                      onToggle={handleToggleDrinkIngredient}
                      onAddCustomIngredient={handleToggleDrinkIngredient}
                    />

                    {/* Garnish Suggestions */}
                    {selectedDrinkIngredients.length > 0 && (
                      <div className="mt-4">
                        <GarnishSuggestions selectedIngredients={selectedDrinkIngredients} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="sticky bottom-20 sm:relative sm:bottom-auto z-50 py-2 sm:py-0 -mt-2">
                  <Button
                    variant="warm"
                    size="xl"
                    className="w-full shadow-lg"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleGenerateDrinks();
                    }}
                    disabled={selectedDrinkIngredients.length === 0}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Find Drinks ({selectedDrinkIngredients.length} ingredients)
                  </Button>
                </div>

                {/* Glassware Guide */}
                <GlasswareGuide />

                <div className="space-y-4">
                  {showDrinks ? (
                    <DrinkResults
                      drinks={drinks}
                      savedDrinks={savedDrinks}
                      onSave={handleSaveDrink}
                      onAddToShopping={handleBulkAddToShopping}
                      loading={dataLoading}
                    />
                  ) : (
                    <Card className="shadow-elevated border-border/50 bg-card/90 backdrop-blur-sm">
                      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 gradient-warm blur-2xl opacity-30 animate-pulse-soft" />
                          <div className="relative p-5 rounded-3xl gradient-warm shadow-warm">
                            <Wine className="h-10 w-10 text-primary-foreground" />
                          </div>
                        </div>
                        <h3 className="font-serif text-2xl font-semibold mb-3">
                          Ready to mix?
                        </h3>
                        <p className="text-muted-foreground max-w-sm leading-relaxed">
                          Select ingredients or use the search above to look up any drink and build your shopping list!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              </Suspense>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6 space-y-8">
            <Suspense fallback={<LazyFallback />}>
              {/* Weekly Nutrition Summary — surfaced above the calendar so totals are visible at a glance */}
              <WeeklyNutritionSummary mealPlan={mealPlan} />

              {/* Regular Meal Calendar */}
              <MealCalendar 
                mealPlan={mealPlan} 
                onRemove={handleRemoveFromCalendar}
                onMoveMeal={moveMeal}
                onAddToShopping={handleAddToShopping}
                savedRecipes={savedRecipes}
                onSaveRecipe={handleSaveRecipe}
                onAddToCalendar={handleAddToCalendar}
                shoppingList={shoppingList.map(i => ({ variant: i.variant, checked: i.checked }))}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="saved" className="mt-6 space-y-6">
            <Suspense fallback={<LazyFallback />}>
              {/* Smart Suggestions */}
              <SmartSuggestions
                savedRecipeIds={savedRecipes}
                onSaveRecipe={handleSaveRecipe}
                onAddToCalendar={handleAddToCalendar}
                onAddToShopping={handleAddToShopping}
              />
              
              <SavedRecipes 
                savedRecipeIds={savedRecipes} 
                savedDrinkIds={savedDrinks}
                onRemoveRecipe={handleSaveRecipe} 
                onRemoveDrink={handleSaveDrink}
                recipeNotes={recipeNotes}
                onSaveNote={async (recipeId, note) => {
                  await updateRecipeNotes(recipeId, note);
                }}
                onAddToCalendar={handleAddToCalendar}
                ratings={ratings}
                onRate={async (itemId, itemType, rating) => {
                  await setItemRating(itemId, itemType, rating);
                }}
                recipeOverrides={recipeOverrides}
                onUpdateOverride={async (recipeId, override) => {
                  await updateRecipeOverride(recipeId, override);
                }}
              />
            </Suspense>
          </TabsContent>


          <TabsContent value="shopping" className="mt-6">
            <Suspense fallback={<LazyFallback />}>
              <ShoppingList
                items={shoppingList}
                onToggleItem={handleToggleShoppingItem}
                onRemoveItem={handleRemoveShoppingItem}
                onClearCompleted={handleClearCompletedShopping}
                onClearAll={handleClearAllShopping}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
        
        {/* SEO Content Section - crawlable content for search engines */}
        {activeTab === "ingredients" && <SEOContent mode={appMode} />}
      </main>

      <AddToCalendarDialog
        recipe={calendarDialogRecipe}
        open={!!calendarDialogRecipe}
        onOpenChange={(open) => !open && setCalendarDialogRecipe(null)}
        onConfirm={handleConfirmCalendarAdd}
      />

      <AddToShoppingDialog
        open={!!shoppingDialogIngredient}
        onOpenChange={(open) => !open && setShoppingDialogIngredient(null)}
        ingredientId={shoppingDialogIngredient || ""}
        onConfirm={handleConfirmShoppingAdd}
      />

      <Suspense fallback={null}>
        <RecipePreviewDialog
          open={showRecipePreview}
          onOpenChange={setShowRecipePreview}
          recipes={recipes}
          selectedIngredients={selectedIngredients}
          onConfirm={handleConfirmGenerateRecipes}
          onRemoveIngredient={handleToggleIngredient}
        />
      </Suspense>

      <Suspense fallback={null}>
        <KeyboardShortcutsHelp 
          open={showShortcutsHelp} 
          onOpenChange={setShowShortcutsHelp} 
        />
      </Suspense>

      {hasUndo && pendingAction && (
        <UndoToast
          message={`Item removed`}
          onUndo={executeUndo}
          onDismiss={dismissUndo}
        />
      )}

      {/* Dialog for viewing recently viewed recipes */}
      {recentViewedRecipe && (
        <RecipeDetailDialog
          recipe={{
            ...recentViewedRecipe,
            matchedIngredients: [],
            matchedKeyIngredients: []
          }}
          open={!!recentViewedRecipe}
          onOpenChange={(open) => !open && setRecentViewedRecipe(null)}
          isSaved={savedRecipes.includes(recentViewedRecipe.id)}
          onSave={() => handleSaveRecipe(recentViewedRecipe.id)}
          onAddToCalendar={() => handleAddToCalendar(recentViewedRecipe)}
          onAddToShopping={handleAddToShopping}
        />
      )}

      {/* Dialog for viewing drinks from search */}
      {recentViewedDrink && (
        <DrinkDetailDialog
          drink={{
            ...recentViewedDrink,
            matchedIngredients: [],
            matchedKeyIngredients: []
          }}
          open={!!recentViewedDrink}
          onOpenChange={(open) => !open && setRecentViewedDrink(null)}
          isSaved={savedDrinks.includes(recentViewedDrink.id)}
          onSave={() => handleSaveDrink(recentViewedDrink.id)}
          onAddToShopping={(ingredients) => handleBulkAddToShopping(ingredients)}
        />
      )}

      {/* Dialog for shared recipe links */}
      {sharedRecipeDialog && (
        <RecipeDetailDialog
          recipe={{
            ...sharedRecipeDialog,
            matchedIngredients: [],
            matchedKeyIngredients: []
          }}
          open={!!sharedRecipeDialog}
          onOpenChange={(open) => !open && setSharedRecipeDialog(null)}
          isSaved={savedRecipes.includes(sharedRecipeDialog.id)}
          onSave={() => handleSaveRecipe(sharedRecipeDialog.id)}
          onAddToCalendar={() => handleAddToCalendar(sharedRecipeDialog)}
          onAddToShopping={handleAddToShopping}
        />
      )}


      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        appMode={appMode}
        mealPlanCount={mealPlan.length}
        savedCount={savedRecipes.length + savedDrinks.length}
        shoppingCount={shoppingList.length}
      />

      <Footer />
    </div>
  );
};

export default Index;
