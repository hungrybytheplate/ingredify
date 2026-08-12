import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Trash2, ChefHat, ArrowRight, Search, Wine, StickyNote, Star, Lightbulb, BookOpen, Sparkles, Plus, FolderPlus, Pencil, Users } from "lucide-react";
import { sampleRecipes, Recipe } from "@/data/recipes";
import { sampleDrinks, Drink } from "@/data/drinks";
import { cn } from "@/lib/utils";
import { RecipeNotesDialog } from "@/components/RecipeNotesDialog";
import { EditSavedRecipeDialog } from "@/components/EditSavedRecipeDialog";
import { RecipeDetailDialog } from "@/components/RecipeDetailDialog";
import { DrinkDetailDialog } from "@/components/DrinkDetailDialog";
import { StarRating } from "@/components/StarRating";
import { QuickTooltip } from "@/components/Tooltip";
import { RecipeCollections, AddToCollectionDialog } from "@/components/RecipeCollections";
import { useRecipeCollections } from "@/hooks/useRecipeCollections";
import { toast } from "@/hooks/use-toast";
import type { Ratings, RecipeOverrides } from "@/hooks/useUserData";

export interface RecipeNotes {
  [recipeId: string]: string;
}

interface SavedRecipesProps {
  savedRecipeIds: string[];
  savedDrinkIds: string[];
  onRemoveRecipe: (id: string) => void;
  onRemoveDrink: (id: string) => void;
  recipeNotes: RecipeNotes;
  onSaveNote: (recipeId: string, note: string) => void;
  onAddToCalendar?: (recipe: Recipe) => void;
  ratings?: Ratings;
  onRate?: (itemId: string, itemType: 'recipe' | 'drink', rating: number) => void;
  recipeOverrides?: RecipeOverrides;
  onUpdateOverride?: (recipeId: string, override: { servings?: number | null }) => Promise<void> | void;
}

export function SavedRecipes({ 
  savedRecipeIds, 
  savedDrinkIds, 
  onRemoveRecipe, 
  onRemoveDrink, 
  recipeNotes, 
  onSaveNote,
  onAddToCalendar,
  ratings = {},
  onRate,
  recipeOverrides = {},
  onUpdateOverride,
}: SavedRecipesProps) {
  const [search, setSearch] = useState("");
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedRecipeForNotes, setSelectedRecipeForNotes] = useState<{ id: string; title: string } | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [addToCollectionRecipeId, setAddToCollectionRecipeId] = useState<string | null>(null);
  
  const {
    collections,
    selectedCollectionId,
    setSelectedCollectionId,
    createCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    getFilteredRecipeIds,
  } = useRecipeCollections();
  
  const allSavedRecipes = sampleRecipes.filter((r) => savedRecipeIds.includes(r.id));
  const allSavedDrinks = sampleDrinks.filter((d) => savedDrinkIds.includes(d.id));
  
  // Apply collection filter then search filter
  const collectionFilteredIds = getFilteredRecipeIds(allSavedRecipes.map(r => r.id));
  const savedRecipes = allSavedRecipes
    .filter((r) => collectionFilteredIds.includes(r.id))
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
  const savedDrinks = allSavedDrinks.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  // Get favorites (items with rating >= 4)
  const favoriteRecipes = savedRecipes.filter((r) => (ratings[`recipe-${r.id}`] || 0) >= 4);
  const favoriteDrinks = savedDrinks.filter((d) => (ratings[`drink-${d.id}`] || 0) >= 4);
  const totalFavorites = favoriteRecipes.length + favoriteDrinks.length;

  const totalSaved = allSavedRecipes.length + allSavedDrinks.length;

  const handleRate = (itemId: string, itemType: 'recipe' | 'drink', rating: number) => {
    if (onRate) {
      onRate(itemId, itemType, rating);
      if (rating >= 4) {
        toast({
          title: "Added to favorites!",
          description: `${rating === 5 ? "⭐⭐⭐⭐⭐" : "⭐⭐⭐⭐"} Great choice!`,
        });
      }
    }
  };

  const handleOpenNotes = (recipeId: string, recipeTitle: string) => {
    setSelectedRecipeForNotes({ id: recipeId, title: recipeTitle });
    setNotesDialogOpen(true);
  };

  if (totalSaved === 0) {
    return (
      <Card className="shadow-elevated border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 gradient-sunset" />
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 gradient-sunset blur-2xl opacity-30 animate-pulse-soft" />
            <div className="relative p-4 rounded-2xl gradient-sunset shadow-warm">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-semibold mb-3">
            Your Recipe Collection
          </h3>
          <p className="text-muted-foreground max-w-sm leading-relaxed mb-6">
            Build your personal cookbook! Save recipes and drinks you love by clicking the heart icon on any recipe card.
          </p>
          
          {/* Helpful tips */}
          <div className="grid gap-3 max-w-md w-full mb-6">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-left">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Find recipes in the Cook tab</p>
                <p className="text-xs text-muted-foreground">Select ingredients to discover matching recipes</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-left">
              <div className="p-1.5 rounded-md bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Add notes to saved recipes</p>
                <p className="text-xs text-muted-foreground">Track your modifications and favorites</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-left">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Rate your favorites</p>
                <p className="text-xs text-muted-foreground">4+ star recipes appear in your favorites</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <ChefHat className="h-4 w-4" />
            <span>Head to the Cook tab to get started</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const mealTypeColors: Record<string, string> = {
    breakfast: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    lunch: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    dinner: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    dessert: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    sides: "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  };

  const drinkTypeColors = {
    smoothie: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    wellness: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    mocktail: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    cocktail: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <Card className="shadow-elevated border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 gradient-sunset" />
      <CardHeader>
        <div>
        <CardTitle className="font-serif text-lg sm:text-2xl flex items-center gap-2">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary fill-primary" />
            Saved Collection
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {allSavedRecipes.length} recipe{allSavedRecipes.length === 1 ? '' : 's'} · {allSavedDrinks.length} drink{allSavedDrinks.length === 1 ? '' : 's'} · {totalFavorites} favorite{totalFavorites === 1 ? '' : 's'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-10 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="favorites" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 fill-amber-400 text-amber-400" />
              <span className="hidden sm:inline">Favorites</span>
              <span className="text-xs">({totalFavorites})</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2">
              <ChefHat className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">Recipes</span>
              <span className="text-xs">({savedRecipes.length})</span>
            </TabsTrigger>
            <TabsTrigger value="drinks" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2">
              <Wine className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">Drinks</span>
              <span className="text-xs">({savedDrinks.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="mt-4">
            <div className="space-y-4">
              {totalFavorites > 0 ? (
                <>
                  {favoriteRecipes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <ChefHat className="h-4 w-4" />
                        Favorite Recipes
                      </h4>
                      {favoriteRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                          onClick={() => setSelectedRecipe(recipe)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Badge className={cn("text-xs shrink-0", mealTypeColors[recipe.mealType])}>
                              {recipe.mealType}
                            </Badge>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium truncate">{recipe.title}</span>
                              <div onClick={(e) => e.stopPropagation()}>
                                <StarRating
                                  rating={ratings[`recipe-${recipe.id}`]}
                                  onRate={(r) => handleRate(recipe.id, 'recipe', r)}
                                  size="sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {favoriteDrinks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Wine className="h-4 w-4" />
                        Favorite Drinks
                      </h4>
                      {favoriteDrinks.map((drink) => (
                        <div
                          key={drink.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                          onClick={() => setSelectedDrink(drink)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Badge className={cn("text-xs shrink-0", drinkTypeColors[drink.drinkType])}>
                              {drink.drinkType}
                            </Badge>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium truncate">{drink.title}</span>
                              <div onClick={(e) => e.stopPropagation()}>
                                <StarRating
                                  rating={ratings[`drink-${drink.id}`]}
                                  onRate={(r) => handleRate(drink.id, 'drink', r)}
                                  size="sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No favorites yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Rate recipes and drinks with 4+ stars to add them here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="mt-4">
            <RecipeCollections
              collections={collections}
              onCreateCollection={createCollection}
              onDeleteCollection={deleteCollection}
              onSelectCollection={setSelectedCollectionId}
              selectedCollectionId={selectedCollectionId}
              onAddToCollection={addToCollection}
              onRemoveFromCollection={removeFromCollection}
            />
            <div className="space-y-2">
              {savedRecipes.length > 0 ? (
                savedRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                     className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer min-h-[44px]"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <Badge className={cn("text-[10px] sm:text-xs shrink-0 px-1.5 sm:px-2", mealTypeColors[recipe.mealType])}>
                        {recipe.mealType}
                      </Badge>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate">{recipe.title}</span>
                        <div className="flex items-center gap-2">
                          <div onClick={(e) => e.stopPropagation()}>
                            <StarRating
                              rating={ratings[`recipe-${recipe.id}`]}
                              onRate={(r) => handleRate(recipe.id, 'recipe', r)}
                              size="sm"
                            />
                          </div>
                          {recipeNotes[recipe.id] && (
                            <span className="text-xs text-muted-foreground">📝</span>
                          )}
                          {recipeOverrides[recipe.id]?.servings && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                              <Users className="h-3 w-3" />
                              {recipeOverrides[recipe.id]?.servings}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1" onClick={(e) => e.stopPropagation()}>
                      {onUpdateOverride && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingRecipe(recipe)}
                          className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                          aria-label="Edit servings and notes"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAddToCollectionRecipeId(recipe.id)}
                        className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                      >
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenNotes(recipe.id, recipe.title)}
                        className={cn(
                          "transition-opacity text-muted-foreground hover:text-primary h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100",
                          recipeNotes[recipe.id] ? "opacity-100" : "sm:opacity-0"
                        )}
                      >
                        <StickyNote className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveRecipe(recipe.id)}
                        className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  {search ? `No recipes match "${search}"` : "No recipes saved yet"}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="drinks" className="mt-4">
            <div className="space-y-2">
              {savedDrinks.length > 0 ? (
                savedDrinks.map((drink) => (
                  <div
                    key={drink.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedDrink(drink)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Badge className={cn("text-xs shrink-0", drinkTypeColors[drink.drinkType])}>
                        {drink.drinkType}
                      </Badge>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{drink.title}</span>
                        <div onClick={(e) => e.stopPropagation()}>
                          <StarRating
                            rating={ratings[`drink-${drink.id}`]}
                            onRate={(r) => handleRate(drink.id, 'drink', r)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveDrink(drink.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  {search ? `No drinks match "${search}"` : "No drinks saved yet"}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>


        {selectedRecipeForNotes && (
          <RecipeNotesDialog
            open={notesDialogOpen}
            onOpenChange={setNotesDialogOpen}
            recipeTitle={selectedRecipeForNotes.title}
            recipeId={selectedRecipeForNotes.id}
            currentNote={recipeNotes[selectedRecipeForNotes.id] || ""}
            onSaveNote={onSaveNote}
          />
        )}

        {editingRecipe && onUpdateOverride && (
          <EditSavedRecipeDialog
            open={!!editingRecipe}
            onOpenChange={(open) => !open && setEditingRecipe(null)}
            recipeId={editingRecipe.id}
            recipeTitle={editingRecipe.title}
            defaultServings={editingRecipe.servings ?? 4}
            currentServings={recipeOverrides[editingRecipe.id]?.servings}
            currentNote={recipeNotes[editingRecipe.id] || ""}
            onSave={async ({ servings, note }) => {
              await Promise.all([
                onUpdateOverride(editingRecipe.id, { servings }),
                onSaveNote(editingRecipe.id, note),
              ]);
            }}
          />
        )}

        {selectedRecipe && (
          <RecipeDetailDialog
            recipe={selectedRecipe}
            open={!!selectedRecipe}
            onOpenChange={(open) => !open && setSelectedRecipe(null)}
            isSaved={savedRecipeIds.includes(selectedRecipe.id)}
            onSave={() => onRemoveRecipe(selectedRecipe.id)}
            onAddToCalendar={() => onAddToCalendar?.(selectedRecipe)}
          />
        )}

        {selectedDrink && (
          <DrinkDetailDialog
            drink={selectedDrink}
            open={!!selectedDrink}
            onOpenChange={(open) => !open && setSelectedDrink(null)}
            isSaved={savedDrinkIds.includes(selectedDrink.id)}
            onSave={() => onRemoveDrink(selectedDrink.id)}
          />
        )}

        {addToCollectionRecipeId && (
          <AddToCollectionDialog
            open={!!addToCollectionRecipeId}
            onOpenChange={(open) => !open && setAddToCollectionRecipeId(null)}
            collections={collections}
            recipeId={addToCollectionRecipeId}
            onAdd={addToCollection}
            onRemove={removeFromCollection}
          />
        )}
      </CardContent>
    </Card>
  );
}
