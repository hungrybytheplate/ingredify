import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Users, 
  Heart, 
  ChefHat, 
  CheckCircle2, 
  Circle,
  ArrowLeft,
  ArrowRight,
  Utensils,
  ShoppingCart,
  Calendar as CalendarIcon,
  Check,
  Plus,
  Minus,
  Flame,
  Leaf,
  Gauge,
  Wheat,
  Repeat,
  Dumbbell,
  Lightbulb,
  Sun,
  CloudSun,
  Smartphone,
  ExternalLink,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recipe, DietaryTag, DifficultyLevel } from "@/data/recipes";
import { sampleRecipes } from "@/data/recipes";
import { ShareRecipeButton } from "./ShareRecipeButton";
import { CookingMode } from "./CookingMode";
import { findPairingByName } from "@/lib/pairingLookup";
import { getAltForm } from "@/lib/dipWontonPairs";
import { DrinkDetailDialog } from "./DrinkDetailDialog";
import { SourdoughTimerDialog } from "./SourdoughTimerDialog";
import type { Drink } from "@/data/drinks";

interface SideDish {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const availableSideDishes: SideDish[] = [
  { id: "pasta", name: "Pasta", emoji: "🍝", description: "Buttered pasta with herbs" },
  { id: "rice", name: "Rice", emoji: "🍚", description: "Fluffy steamed rice" },
  { id: "mashed-potatoes", name: "Mashed Potatoes", emoji: "🥔", description: "Creamy mashed potatoes" },
  { id: "roasted-vegetables", name: "Roasted Vegetables", emoji: "🥦", description: "Seasonal roasted veggies" },
  { id: "garlic-bread", name: "Garlic Bread", emoji: "🥖", description: "Toasted garlic bread" },
  { id: "salad", name: "Side Salad", emoji: "🥗", description: "Fresh garden salad" },
];

interface RecipeDetailDialogProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaved: boolean;
  onSave: () => void;
  onAddToCalendar: (selectedSides?: string[]) => void;
  onAddToShopping?: (ingredientId: string) => void;
}

const mealTypeConfig = {
  breakfast: {
    bg: "bg-gradient-to-r from-amber-400/20 to-orange-400/20",
    border: "border-amber-400/30",
    text: "text-amber-700 dark:text-amber-400",
    emoji: "🌅",
    label: "Breakfast"
  },
  lunch: {
    bg: "bg-gradient-to-r from-emerald-400/20 to-teal-400/20",
    border: "border-emerald-400/30",
    text: "text-emerald-700 dark:text-emerald-400",
    emoji: "☀️",
    label: "Lunch"
  },
  dinner: {
    bg: "bg-gradient-to-r from-violet-400/20 to-purple-400/20",
    border: "border-violet-400/30",
    text: "text-violet-700 dark:text-violet-400",
    emoji: "🌙",
    label: "Dinner"
  },
  dessert: {
    bg: "bg-gradient-to-r from-pink-400/20 to-rose-400/20",
    border: "border-pink-400/30",
    text: "text-pink-700 dark:text-pink-400",
    emoji: "🍰",
    label: "Dessert"
  },
  sides: {
    bg: "bg-gradient-to-r from-stone-400/20 to-amber-400/20",
    border: "border-stone-400/30",
    text: "text-stone-700 dark:text-stone-400",
    emoji: "🍞",
    label: "Sides"
  },
};

const dietaryTagConfig: Record<DietaryTag, { bg: string; text: string; icon: string }> = {
  vegetarian: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", icon: "🥬" },
  vegan: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", icon: "🌱" },
  "gluten-free": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", icon: "🌾" },
  "dairy-free": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", icon: "🥛" },
  keto: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", icon: "🥑" },
  paleo: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", icon: "🍖" },
  "nut-free": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", icon: "🥜" },
  "high-protein": { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", icon: "💪" },
  "low-carb": { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-400", icon: "🥗" },
  "high-fiber": { bg: "bg-lime-100 dark:bg-lime-900/30", text: "text-lime-700 dark:text-lime-400", icon: "🌾" },
  "no-sodium": { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-700 dark:text-gray-400", icon: "🚫" },
  "low-sodium": { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-400", icon: "🧂" },
};

const difficultyConfig: Record<DifficultyLevel, { bg: string; text: string; label: string }> = {
  easy: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Easy" },
  medium: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "Medium" },
  hard: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Hard" },
};

export function RecipeDetailDialog({ 
  recipe, 
  open, 
  onOpenChange, 
  isSaved, 
  onSave,
  onAddToCalendar,
  onAddToShopping
}: RecipeDetailDialogProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCooking, setIsCooking] = useState(false);
  const [isFullCookingMode, setIsFullCookingMode] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState<string[]>([]);
  const [linkedRecipeStack, setLinkedRecipeStack] = useState<Recipe[]>([]);
  const [selectedLinkedDrink, setSelectedLinkedDrink] = useState<Drink | null>(null);
  const [showSourdoughTimer, setShowSourdoughTimer] = useState(false);

  // The currently displayed recipe: either a linked recipe from the stack, or the original
  const displayedRecipe = linkedRecipeStack.length > 0 ? linkedRecipeStack[linkedRecipeStack.length - 1] : recipe;

  const handleNavigateToRecipe = useCallback((linkedRecipe: Recipe) => {
    setLinkedRecipeStack(prev => [...prev, linkedRecipe]);
    setCompletedSteps([]);
    setCurrentStep(0);
    setServingMultiplier(1);
    setIsCooking(false);
  }, []);

  const handleNavigateBack = useCallback(() => {
    setLinkedRecipeStack(prev => prev.slice(0, -1));
    setCompletedSteps([]);
    setCurrentStep(0);
    setServingMultiplier(1);
    setIsCooking(false);
  }, []);

  // Reset linked recipe stack when dialog closes or recipe changes
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setLinkedRecipeStack([]);
    }
    onOpenChange(isOpen);
  }, [onOpenChange]);

  if (!recipe) return null;

  const config = mealTypeConfig[displayedRecipe.mealType];
  const missingIngredients = displayedRecipe.ingredients.filter(
    ing => !displayedRecipe.matchedIngredients.includes(ing)
  );
  const scaledServings = displayedRecipe.servings * servingMultiplier;

  const scaleAmount = (amount: string): string => {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    const scaled = num * servingMultiplier;
    // Format nicely - remove unnecessary decimals
    if (scaled === Math.floor(scaled)) return scaled.toString();
    return scaled.toFixed(2).replace(/\.?0+$/, '');
  };

  const scaledNutrition = displayedRecipe.nutrition ? {
    calories: Math.round(displayedRecipe.nutrition.calories * servingMultiplier),
    protein: Math.round(displayedRecipe.nutrition.protein * servingMultiplier),
    carbs: Math.round(displayedRecipe.nutrition.carbs * servingMultiplier),
    fat: Math.round(displayedRecipe.nutrition.fat * servingMultiplier),
  } : null;

  const toggleStepComplete = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleStartCooking = () => {
    setIsCooking(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const handleNextStep = () => {
    if (currentStep < displayedRecipe.instructions.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsCooking(false);
    setCompletedSteps([]);
    setCurrentStep(0);
    setLinkedRecipeStack([]);
    onOpenChange(false);
  };

  const allStepsComplete = completedSteps.length === displayedRecipe.instructions.length;
  const cookingModePortal = typeof document !== "undefined" ? document.body : null;

  return (
    <>
      {/* Full-screen Cooking Mode - rendered outside Dialog for proper z-index */}
      {cookingModePortal && createPortal(
        <AnimatePresence>
          {isFullCookingMode && (
            <CookingMode
              recipe={displayedRecipe}
              open={isFullCookingMode}
              onClose={() => setIsFullCookingMode(false)}
              servingMultiplier={servingMultiplier}
            />
          )}
        </AnimatePresence>,
        cookingModePortal
      )}
      
      <Dialog open={open && !isFullCookingMode} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden w-[calc(100vw-1rem)] sm:w-full rounded-xl">
          {/* Header with gradient */}
          <div className={cn("relative px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4", config.bg)}>
            {/* Back button for linked recipe navigation */}
            {linkedRecipeStack.length > 0 && (
              <button
                onClick={handleNavigateBack}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground mb-2 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to {linkedRecipeStack.length > 1 ? linkedRecipeStack[linkedRecipeStack.length - 2].title : recipe?.title}
              </button>
            )}
            <DialogHeader>
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                <Badge className={cn(
                  "text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border mb-1.5 sm:mb-2",
                  config.bg, config.border, config.text
                )}>
                  <span className="mr-0.5 sm:mr-1">{config.emoji}</span>
                  {config.label}
                </Badge>
                <DialogTitle className="font-serif text-lg sm:text-2xl font-semibold leading-tight">
                  {displayedRecipe.title}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 line-clamp-2">{displayedRecipe.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ShareRecipeButton recipe={displayedRecipe} size="icon" className="rounded-full" showDropdown />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSave}
                  className={cn(
                    "shrink-0 rounded-full",
                    isSaved ? "text-primary bg-primary/10" : ""
                  )}
                >
                  <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
                </Button>
              </div>
            </div>

            {/* Dietary Tags */}
            {displayedRecipe.dietaryTags && displayedRecipe.dietaryTags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                {displayedRecipe.dietaryTags.map(tag => {
                  const tagConfig = dietaryTagConfig[tag];
                  return (
                    <Badge key={tag} className={cn("text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5", tagConfig.bg, tagConfig.text)}>
                      <span className="mr-0.5 sm:mr-1">{tagConfig.icon}</span>
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-background/60">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span className="font-medium">{displayedRecipe.cookTime}</span>
              </div>
              
              {/* Serving Scaler */}
              <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-background/60">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  onClick={() => setServingMultiplier(m => Math.max(0.5, m - 0.5))}
                  disabled={servingMultiplier <= 0.5}
                >
                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
                <span className="font-medium min-w-[50px] sm:min-w-[60px] text-center text-xs sm:text-sm">{scaledServings}<span className="hidden sm:inline"> servings</span></span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  onClick={() => setServingMultiplier(m => m + 0.5)}
                >
                  <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </div>

              {/* Difficulty */}
              {displayedRecipe.difficulty && (
                <div className={cn(
                  "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full",
                  difficultyConfig[displayedRecipe.difficulty].bg
                )}>
                  <Gauge className={cn("h-3 w-3 sm:h-4 sm:w-4", difficultyConfig[displayedRecipe.difficulty].text)} />
                  <span className={cn("font-medium text-xs sm:text-sm", difficultyConfig[displayedRecipe.difficulty].text)}>
                    {difficultyConfig[displayedRecipe.difficulty].label}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 max-h-[55vh] sm:max-h-[50vh]">
          <div className="px-4 py-3 sm:px-6 sm:py-4 space-y-4 sm:space-y-6">
            {!isCooking ? (
              <>
                {/* Nutrition Info */}
                {scaledNutrition && (
                  <Card className="p-3 sm:p-4 bg-muted/30 border-border/50">
                    <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      Nutrition ({scaledServings} servings)
                    </h3>
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                      <div className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60">
                        <div className="text-sm sm:text-lg font-bold text-primary">{scaledNutrition.calories}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Cal</div>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60">
                        <div className="text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400">{scaledNutrition.protein}g</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Protein</div>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60">
                        <div className="text-sm sm:text-lg font-bold text-amber-600 dark:text-amber-400">{scaledNutrition.carbs}g</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Carbs</div>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60">
                        <div className="text-sm sm:text-lg font-bold text-rose-600 dark:text-rose-400">{scaledNutrition.fat}g</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Fat</div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Ingredients Section */}
                <Card className="p-3 sm:p-4 bg-muted/30 border-border/50">
                  <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4 flex items-center gap-2">
                    <Utensils className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    Ingredients ({displayedRecipe.ingredients.length})
                    {servingMultiplier !== 1 && (
                      <Badge variant="outline" className="text-[10px] sm:text-xs ml-auto">
                        ×{servingMultiplier}
                      </Badge>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {displayedRecipe.ingredients.map((ing, i) => {
                      const isMatched = displayedRecipe.matchedIngredients.includes(ing);
                      const ingredientAmount = displayedRecipe.ingredientAmounts?.find(a => a.id === ing);
                      return (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg transition-all duration-300",
                            isMatched ? "bg-secondary/10" : addedToCart.includes(ing) ? "bg-primary/15 border border-primary/30" : "bg-accent/20 cursor-pointer hover:bg-primary/10"
                          )}
                          onClick={() => {
                            if (!isMatched && !addedToCart.includes(ing) && onAddToShopping) {
                              onAddToShopping(ing);
                              setAddedToCart(prev => [...prev, ing]);
                            }
                          }}
                        >
                          <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-300",
                            isMatched 
                              ? "bg-secondary/20 text-secondary" 
                              : addedToCart.includes(ing)
                                ? "bg-primary/20 text-primary animate-scale-in"
                                : "bg-accent/50 text-accent-foreground"
                          )}>
                            {isMatched ? <Check className="h-3 w-3" /> : addedToCart.includes(ing) ? <ShoppingCart className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          </span>
                          <span className={cn(
                            "capitalize text-xs sm:text-sm font-medium flex-1 transition-colors duration-300",
                            isMatched ? "" : addedToCart.includes(ing) ? "text-primary" : "text-muted-foreground"
                          )}>
                            {ing.replace("-", " ")}
                            {addedToCart.includes(ing) && <span className="text-[10px] ml-1 opacity-70">Added ✓</span>}
                          </span>
                          {ingredientAmount && (
                            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                              {scaleAmount(ingredientAmount.amount)} {ingredientAmount.unit}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {missingIngredients.length > 0 && onAddToShopping && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => missingIngredients.forEach(ing => onAddToShopping(ing))}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add {missingIngredients.length} missing to shopping list
                    </Button>
                  )}
                </Card>

                {/* Side Dish Selector - Only show for dinner and lunch */}
                {(displayedRecipe.mealType === "dinner" || displayedRecipe.mealType === "lunch") && (
                  <Card className="p-4 bg-muted/30 border-border/50">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Wheat className="h-4 w-4 text-primary" />
                      Add a Side Dish
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableSideDishes.map((side) => {
                        const isSelected = selectedSides.includes(side.id);
                        return (
                          <button
                            key={side.id}
                            onClick={() => {
                              setSelectedSides(prev => 
                                isSelected 
                                  ? prev.filter(s => s !== side.id)
                                  : [...prev, side.id]
                              );
                            }}
                            className={cn(
                              "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-center",
                              isSelected 
                                ? "border-primary bg-primary/10" 
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            )}
                          >
                            <span className="text-2xl">{side.emoji}</span>
                            <span className="text-xs font-medium">{side.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedSides.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Selected: {selectedSides.map(id => availableSideDishes.find(s => s.id === id)?.name).join(", ")}
                      </p>
                    )}
                  </Card>
                )}

                {/* Protein Substitutions */}
                {displayedRecipe.proteinSubstitutions && displayedRecipe.proteinSubstitutions.length > 0 && (
                  <Card className="p-4 bg-muted/30 border-border/50">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-primary" />
                      Protein Substitutions
                    </h3>
                    <div className="space-y-2">
                      {displayedRecipe.proteinSubstitutions.map((sub, index) => (
                        <div key={index} className="p-3 rounded-lg bg-background/60 border border-border/50">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium capitalize bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {sub.original.replace(/-/g, " ")}
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <div className="flex flex-wrap gap-1">
                              {sub.alternatives.map((alt, i) => (
                                <span key={i} className="text-sm bg-secondary/10 text-secondary-foreground px-2 py-0.5 rounded capitalize">
                                  {alt.replace(/-/g, " ")}
                                </span>
                              ))}
                            </div>
                          </div>
                          {sub.notes && (
                            <p className="text-xs text-muted-foreground mt-1.5">{sub.notes}</p>
                      )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Protein Tips */}
                {displayedRecipe.proteinTips && displayedRecipe.proteinTips.length > 0 && (
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/50">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-700 dark:text-blue-300">Boost Your Protein</span>
                    </h3>
                    <ul className="space-y-2">
                      {displayedRecipe.proteinTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Dip <-> Wonton alternate form */}
                {(() => {
                  const alt = getAltForm(displayedRecipe);
                  if (!alt) return null;
                  return (
                    <button
                      onClick={() => handleNavigateToRecipe(alt.recipe)}
                      className="w-full p-3 rounded-lg bg-primary/5 border border-primary/30 text-left hover:bg-primary/10 transition-all flex items-center justify-between gap-2 min-h-[40px]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-primary">{alt.label}</p>
                        <p className="text-xs text-muted-foreground">{alt.recipe.title}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                    </button>
                  );
                })()}

                {/* Suggested Pairings */}
                {displayedRecipe.suggestedSides && displayedRecipe.suggestedSides.length > 0 && (
                  <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/50">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-700 dark:text-amber-300">Pairs Well With</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {displayedRecipe.suggestedSides.map((side, index) => {
                        const match = findPairingByName(side.name);
                        return match ? (
                          <button
                            key={index}
                            onClick={() => {
                              if (match.type === "recipe") handleNavigateToRecipe(match.data);
                              else setSelectedLinkedDrink(match.data);
                            }}
                            className="p-2.5 rounded-lg bg-background/60 border border-border/50 text-left hover:border-primary/50 hover:bg-primary/5 transition-all group"
                          >
                            <p className="text-sm font-medium flex items-center gap-1.5 group-hover:text-primary transition-colors">
                              {side.name}
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{side.description}</p>
                          </button>
                        ) : (
                          <div key={index} className="p-2.5 rounded-lg bg-background/60 border border-border/50">
                            <p className="text-sm font-medium">{side.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{side.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* Seasonal Badge */}
                {displayedRecipe.season && (
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      "text-xs px-3 py-1 rounded-full",
                      displayedRecipe.season === "summer" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                      displayedRecipe.season === "fall" && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                      displayedRecipe.season === "winter" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                      displayedRecipe.season === "spring" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    )}>
                      {displayedRecipe.season === "summer" && <Sun className="h-3 w-3 mr-1" />}
                      {displayedRecipe.season === "fall" && <CloudSun className="h-3 w-3 mr-1" />}
                      {displayedRecipe.season === "winter" && "❄️ "}
                      {displayedRecipe.season === "spring" && "🌸 "}
                      {displayedRecipe.season.charAt(0).toUpperCase() + displayedRecipe.season.slice(1)} Favorite
                    </Badge>
                  </div>
                )}

                {/* Instructions Preview */}
                <Card className="p-3 sm:p-4 bg-muted/30 border-border/50">
                  <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4 flex items-center gap-2">
                    <ChefHat className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    Instructions ({displayedRecipe.instructions.length} steps)
                  </h3>
                  <ol className="space-y-3">
                    {displayedRecipe.instructions.map((step, i) => (
                      <li 
                        key={i}
                        className="flex gap-3 group cursor-pointer"
                        onClick={() => toggleStepComplete(i)}
                      >
                        <span className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                          completedSteps.includes(i)
                            ? "bg-secondary text-secondary-foreground"
                            : "gradient-warm text-primary-foreground"
                        )}>
                          {completedSteps.includes(i) ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            i + 1
                          )}
                        </span>
                        <span className={cn(
                          "text-sm leading-relaxed pt-0.5 transition-all",
                          completedSteps.includes(i) 
                            ? "text-muted-foreground line-through" 
                            : "text-foreground"
                        )}>
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </>
            ) : (
              /* Step-by-Step Cooking Mode */
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                    Step {currentStep + 1} of {displayedRecipe.instructions.length}
                    </span>
                    <span className="font-medium text-primary">
                      {Math.round(((completedSteps.length) / displayedRecipe.instructions.length) * 100)}% complete
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-warm transition-all duration-500"
                      style={{ width: `${(completedSteps.length / displayedRecipe.instructions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center gap-2">
                  {displayedRecipe.instructions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        i === currentStep 
                          ? "w-8 gradient-warm" 
                          : completedSteps.includes(i)
                            ? "bg-secondary"
                            : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>

                {/* Current step */}
                <Card className={cn(
                  "p-6 border-2 transition-all duration-300",
                  completedSteps.includes(currentStep) 
                    ? "border-secondary/50 bg-secondary/5" 
                    : "border-primary/30 bg-primary/5"
                )}>
                  <div className="flex items-start gap-4">
                    <span className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold",
                      completedSteps.includes(currentStep)
                        ? "bg-secondary text-secondary-foreground"
                        : "gradient-warm text-primary-foreground"
                    )}>
                      {completedSteps.includes(currentStep) ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        currentStep + 1
                      )}
                    </span>
                    <p className={cn(
                      "text-lg leading-relaxed pt-2",
                      completedSteps.includes(currentStep) && "line-through text-muted-foreground"
                    )}>
                      {displayedRecipe.instructions[currentStep]}
                    </p>
                  </div>
                </Card>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep === displayedRecipe.instructions.length - 1 ? (
                    <Button
                      variant="warm"
                      onClick={handleNextStep}
                      className="flex-1"
                      disabled={allStepsComplete}
                    >
                      {allStepsComplete ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          All Done!
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Complete
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="warm"
                      onClick={handleNextStep}
                      className="flex-1"
                    >
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t bg-muted/30 flex flex-col gap-2 sm:gap-3">
          {!isCooking ? (
            <>
              {/* Mobile-optimized Cooking Mode button */}
              <Button
                variant="warm"
                className="w-full h-10 sm:hidden text-sm"
                onClick={() => setIsFullCookingMode(true)}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Start Cooking Mode
              </Button>
              
              <div className="flex gap-3">
                {displayedRecipe.id === "sourdough-bread" && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowSourdoughTimer(true)}
                  >
                    <Timer className="h-4 w-4" />
                    <span className="hidden sm:inline">Set Timers</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onAddToCalendar(selectedSides)}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add to Meal Plan{selectedSides.length > 0 ? ` + ${selectedSides.length} side${selectedSides.length > 1 ? 's' : ''}` : ''}</span>
                  <span className="sm:hidden">Meal Plan</span>
                </Button>
                <Button
                  variant="warm"
                  className="flex-1 hidden sm:flex"
                  onClick={handleStartCooking}
                >
                  <ChefHat className="h-4 w-4 mr-2" />
                  Start Cooking
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsCooking(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Linked Drink Dialog */}
    {selectedLinkedDrink && (
      <DrinkDetailDialog
        drink={selectedLinkedDrink}
        open={!!selectedLinkedDrink}
        onOpenChange={(open) => !open && setSelectedLinkedDrink(null)}
        isSaved={false}
        onSave={() => {}}
      />
    )}

    {/* Sourdough Timer Dialog */}
    <SourdoughTimerDialog
      open={showSourdoughTimer}
      onOpenChange={setShowSourdoughTimer}
    />
    </>
  );
}