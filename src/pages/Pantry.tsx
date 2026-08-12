import { Package, Trash2, Plus, ArrowLeft, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { usePantry } from "@/hooks/usePantry";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { fridgeItems, pantryItems, spiceItems, type Ingredient, type IngredientCategory } from "@/data/ingredients";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PageSchema } from "@/components/PageSchema";
import { SEOHead } from "@/components/SEOHead";

const allCategories: IngredientCategory[] = [...fridgeItems, ...pantryItems, ...spiceItems];

function getIngredientById(id: string): Ingredient | undefined {
  for (const category of allCategories) {
    const found = category.items.find(item => item.id === id);
    if (found) return found;
  }
  return undefined;
}

function getCategoryById(id: string): IngredientCategory | undefined {
  for (const category of allCategories) {
    if (category.items.some(item => item.id === id)) {
      return category;
    }
  }
  return undefined;
}

export default function Pantry() {
  const { user, loading: authLoading } = useAuth();
  const { pantryItems: userPantryItems, loading: pantryLoading, togglePantryItem, refetch } = usePantry();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Group pantry items by category
  const groupedPantryItems = useMemo(() => {
    const groups: Record<string, { category: IngredientCategory; items: Ingredient[] }> = {};
    
    for (const itemId of userPantryItems) {
      const ingredient = getIngredientById(itemId);
      const category = getCategoryById(itemId);
      
      if (ingredient && category) {
        if (!groups[category.id]) {
          groups[category.id] = { category, items: [] };
        }
        groups[category.id].items.push(ingredient);
      }
    }
    
    return Object.values(groups).sort((a, b) => a.category.name.localeCompare(b.category.name));
  }, [userPantryItems]);

  // Filter pantry items by search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedPantryItems;
    
    const query = searchQuery.toLowerCase();
    return groupedPantryItems
      .map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.name.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.items.length > 0);
  }, [groupedPantryItems, searchQuery]);

  // Filter available ingredients for adding (exclude already in pantry)
  const availableIngredients = useMemo(() => {
    const query = addSearchQuery.toLowerCase();
    return allCategories.map(category => ({
      ...category,
      items: category.items.filter(item => 
        !userPantryItems.includes(item.id) &&
        (query ? item.name.toLowerCase().includes(query) : true)
      )
    })).filter(category => category.items.length > 0);
  }, [userPantryItems, addSearchQuery]);

  // Toggle selection of an item
  const handleToggleSelect = (itemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Toggle selection of all items in a category
  const handleSelectCategory = (categoryId: string) => {
    const group = filteredGroups.find(g => g.category.id === categoryId);
    if (!group) return;
    
    const categoryItemIds = group.items.map(i => i.id);
    const allSelected = categoryItemIds.every(id => selectedItems.has(id));
    
    setSelectedItems(prev => {
      const next = new Set(prev);
      categoryItemIds.forEach(id => {
        if (allSelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      });
      return next;
    });
  };

  // Select all visible items
  const handleSelectAll = () => {
    const allVisibleIds = filteredGroups.flatMap(g => g.items.map(i => i.id));
    const allSelected = allVisibleIds.every(id => selectedItems.has(id));
    
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allVisibleIds));
    }
  };

  // Remove selected items
  const handleRemoveSelected = async () => {
    if (!user || selectedItems.size === 0) return;

    try {
      const { error } = await supabase
        .from('user_pantry')
        .delete()
        .eq('user_id', user.id)
        .in('ingredient_id', Array.from(selectedItems));

      if (error) throw error;

      toast({
        title: "Items removed",
        description: `Removed ${selectedItems.size} item${selectedItems.size > 1 ? 's' : ''} from pantry.`,
      });

      setSelectedItems(new Set());
      setSelectionMode(false);
      refetch();
    } catch (error) {
      console.error('Error removing items:', error);
      toast({
        title: "Error",
        description: "Failed to remove items. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Clear entire category
  const handleClearCategory = async (categoryId: string) => {
    if (!user) return;

    const group = groupedPantryItems.find(g => g.category.id === categoryId);
    if (!group) return;

    const categoryItemIds = group.items.map(i => i.id);

    try {
      const { error } = await supabase
        .from('user_pantry')
        .delete()
        .eq('user_id', user.id)
        .in('ingredient_id', categoryItemIds);

      if (error) throw error;

      toast({
        title: "Category cleared",
        description: `Removed all ${categoryItemIds.length} items from ${group.category.name}.`,
      });

      refetch();
    } catch (error) {
      console.error('Error clearing category:', error);
      toast({
        title: "Error",
        description: "Failed to clear category. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cancel selection mode
  const cancelSelection = () => {
    setSelectedItems(new Set());
    setSelectionMode(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <Package className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-serif font-bold">Sign in to manage your pantry</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Save ingredients you always have on hand so they're automatically selected when you browse recipes.
        </p>
        <Button onClick={() => navigate('/auth')} className="mt-4">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="My Pantry - Ingredify"
        description="Save your baseline pantry, fridge, and spice ingredients so Ingredify pre-selects them every time you look for a recipe."
        canonicalPath="/pantry"
      />
      <PageSchema
        id="schema-pantry"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "My Pantry",
          description:
            "Save your baseline pantry, fridge, and spice ingredients so Ingredify can pre-select them every time you look for a recipe.",
          url: "https://ingredify.org/pantry",
          inLanguage: "en",
          isPartOf: {
            "@type": "WebSite",
            name: "Ingredify",
            url: "https://ingredify.org/",
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://ingredify.org/" },
              { "@type": "ListItem", position: 2, name: "Pantry", item: "https://ingredify.org/pantry" },
            ],
          },
        }}
      />
      {/* Header */}
      <motion.header 
        className="py-4 px-4 border-b border-border/30 glass sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold">My Pantry</h1>
                <p className="text-xs text-muted-foreground">
                  {userPantryItems.length} staple{userPantryItems.length !== 1 ? 's' : ''} saved
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectionMode ? (
              <>
                <Button variant="ghost" size="sm" onClick={cancelSelection} className="gap-1.5">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={selectedItems.size === 0}
                      className="gap-1.5"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove ({selectedItems.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove selected items?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} from your pantry. 
                        They won't be auto-selected when browsing recipes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRemoveSelected}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                {userPantryItems.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectionMode(true)}
                    className="gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Select</span>
                  </Button>
                )}
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Items</span>
                    </Button>
                  </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Add to Pantry</DialogTitle>
              </DialogHeader>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ingredients..."
                  value={addSearchQuery}
                  onChange={(e) => setAddSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Tabs defaultValue="fridge" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="fridge">Fridge</TabsTrigger>
                  <TabsTrigger value="pantry">Pantry</TabsTrigger>
                  <TabsTrigger value="spices">Spices</TabsTrigger>
                </TabsList>
                
                {[
                  { key: "fridge", items: fridgeItems },
                  { key: "pantry", items: pantryItems },
                  { key: "spices", items: spiceItems }
                ].map(({ key, items }) => (
                  <TabsContent key={key} value={key} className="mt-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {items
                          .map(category => ({
                            ...category,
                            items: category.items.filter(item => 
                              !userPantryItems.includes(item.id) &&
                              (addSearchQuery ? item.name.toLowerCase().includes(addSearchQuery.toLowerCase()) : true)
                            )
                          }))
                          .filter(category => category.items.length > 0)
                          .map(category => (
                            <div key={category.id}>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                {category.name}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {category.items.map(item => (
                                  <motion.button
                                    key={item.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      togglePantryItem(item.id);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 text-sm transition-colors"
                                  >
                                    <span>{item.emoji}</span>
                                    <span>{item.name}</span>
                                    <Plus className="h-3 w-3 text-muted-foreground" />
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </DialogContent>
          </Dialog>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        {/* Search and Select All */}
        {userPantryItems.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your pantry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {selectionMode && filteredGroups.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
                className="shrink-0"
              >
                {filteredGroups.every(g => g.items.every(i => selectedItems.has(i.id))) 
                  ? 'Deselect All' 
                  : 'Select All'}
              </Button>
            )}
          </div>
        )}

        {/* Empty State */}
        {pantryLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading your pantry...</div>
          </div>
        ) : userPantryItems.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
              <Package className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-serif font-bold mb-2">Your pantry is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add ingredients you always have on hand. They'll be automatically selected when you browse recipes!
            </p>
            <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Items
            </Button>
          </motion.div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items match your search.</p>
          </div>
        ) : (
          /* Pantry Items Grid */
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredGroups.map(({ category, items }) => (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-xl border border-border/50 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {selectionMode && (
                        <Checkbox
                          checked={items.every(i => selectedItems.has(i.id))}
                          onCheckedChange={() => handleSelectCategory(category.id)}
                        />
                      )}
                      <h2 className="font-medium text-foreground">{category.name}</h2>
                      <Badge variant="secondary" className="text-xs">
                        {items.length} item{items.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {!selectionMode && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-muted-foreground hover:text-destructive gap-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Clear
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear {category.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove all {items.length} item{items.length > 1 ? 's' : ''} from {category.name}. 
                              They won't be auto-selected when browsing recipes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleClearCategory(category.id)}>
                              Clear Category
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence mode="popLayout">
                      {items.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => selectionMode && handleToggleSelect(item.id)}
                          className={`group inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                            selectionMode 
                              ? selectedItems.has(item.id)
                                ? 'bg-destructive/10 border-destructive/30 border cursor-pointer'
                                : 'bg-secondary/50 border border-border/50 hover:border-muted-foreground cursor-pointer'
                              : 'bg-amber-500/10 border border-amber-500/20'
                          }`}
                        >
                          {selectionMode && (
                            <Checkbox
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={() => handleToggleSelect(item.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <span>{item.emoji}</span>
                          <span className="font-medium">{item.name}</span>
                          {!selectionMode && (
                            <button
                              onClick={() => togglePantryItem(item.id)}
                              className="ml-1 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                              aria-label={`Remove ${item.name} from pantry`}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Tip */}
        {userPantryItems.length > 0 && (
          <motion.div 
            className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">💡 Tip:</strong> Your pantry items are automatically selected when you browse recipes, helping you find dishes you can make right now.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
