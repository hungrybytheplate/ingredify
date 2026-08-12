import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Calendar, CalendarPlus, CalendarCheck, FileText } from "lucide-react";
import { useState, DragEvent } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/data/recipes";
import { RecipeDetailDialog } from "@/components/RecipeDetailDialog";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences, type MealTimes } from "@/hooks/useUserPreferences";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportMealPlanDialog } from "@/components/ExportMealPlanDialog";
import { formatIngredientLabel } from "@/components/CustomIngredientInput";
export interface MealPlanEntry {
  date: string;
  recipe: Recipe;
}

interface MealCalendarProps {
  mealPlan: MealPlanEntry[];
  onRemove: (date: string, recipeId: string) => void;
  onMoveMeal?: (fromDate: string, toDate: string, recipeId: string) => void;
  onAddToShopping?: (ingredientId: string) => void;
  savedRecipes?: string[];
  onSaveRecipe?: (recipeId: string) => void;
  onAddToCalendar?: (recipe: Recipe) => void;
  shoppingList?: { variant: string; checked: boolean }[];
}

const CALENDAR_PREFERENCE_KEY = 'preferred-calendar-provider';

type CalendarProvider = 'google' | 'outlook' | 'apple' | 'samsung' | 'yahoo';

const calendarProviders: { id: CalendarProvider; name: string; icon: string }[] = [
  { id: 'google', name: 'Google Calendar', icon: '📅' },
  { id: 'outlook', name: 'Outlook', icon: '📧' },
  { id: 'apple', name: 'Apple Calendar', icon: '🍎' },
  { id: 'samsung', name: 'Samsung Calendar', icon: '📱' },
  { id: 'yahoo', name: 'Yahoo Calendar', icon: '📆' },
];

export function MealCalendar({ 
  mealPlan, 
  onRemove,
  onMoveMeal,
  onAddToShopping,
  savedRecipes = [],
  onSaveRecipe,
  onAddToCalendar,
  shoppingList = []
}: MealCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const { toast } = useToast();
  const { preferences } = useUserPreferences();

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Get meals for the current week only
  const weekMeals = mealPlan.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekEnd = addDays(weekStart, 6);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, entry: MealPlanEntry) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ date: entry.date, recipeId: entry.recipe.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(dateStr);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, toDateStr: string) => {
    e.preventDefault();
    setDragOverDate(null);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { date: fromDate, recipeId } = data;
      
      if (fromDate !== toDateStr && onMoveMeal) {
        onMoveMeal(fromDate, toDateStr, recipeId);
        toast({
          title: "Meal moved",
          description: `Moved to ${format(new Date(toDateStr), "EEEE, MMM d")}`,
        });
      }
    } catch (err) {
      console.error('Failed to parse drag data:', err);
    }
  };

  // Bulk sync all meals for the week
  const handleSyncAllWeek = () => {
    const savedPreference = localStorage.getItem(CALENDAR_PREFERENCE_KEY) as CalendarProvider | null;
    
    if (!savedPreference) {
      toast({
        title: "Set a default calendar first",
        description: "Sync a single meal first and choose 'Remember my choice'",
        variant: "destructive",
      });
      return;
    }
    
    if (weekMeals.length === 0) {
      toast({
        title: "No meals to sync",
        description: "Add some meals to your week first",
      });
      return;
    }
    
    setIsSyncingAll(true);
    
    // Sync each meal with a small delay to avoid popup blockers
    weekMeals.forEach((entry, index) => {
      setTimeout(() => {
        handleCalendarSync(entry, savedPreference);
        
        if (index === weekMeals.length - 1) {
          setIsSyncingAll(false);
          toast({
            title: "Week synced!",
            description: `${weekMeals.length} meal${weekMeals.length === 1 ? '' : 's'} added to your calendar`,
          });
        }
      }, index * 300);
    });
  };

  const getMealsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return mealPlan.filter((entry) => entry.date === dateStr);
  };

  const mealTypeIcons: Record<string, string> = {
    breakfast: "🌅",
    lunch: "☀️",
    snack: "🍎",
    dinner: "🌙",
    happyHour: "🍸",
    dessert: "🍰",
    sides: "🥐",
  };

  const isEmpty = mealPlan.length === 0;

  const parseCookTimeMinutes = (cookTime: string): number => {
    const hourMatch = cookTime.match(/(\d+)\s*h/i);
    const minMatch = cookTime.match(/(\d+)\s*m/i);
    let total = 0;
    if (hourMatch) total += parseInt(hourMatch[1]) * 60;
    if (minMatch) total += parseInt(minMatch[1]);
    if (total === 0) {
      const numOnly = cookTime.match(/(\d+)/);
      if (numOnly) total = parseInt(numOnly[1]);
    }
    return total || 60;
  };

  const generateCalendarLink = (entry: MealPlanEntry, type: CalendarProvider) => {
    const startDate = new Date(entry.date);
    const endDate = new Date(entry.date);
    const recipe = entry.recipe;
    
    // Use user's preferred meal times
    const userMealTimes = preferences.mealTimes;
    const time24 = userMealTimes[recipe.mealType as keyof MealTimes] || '12:00';
    const [startHour, startMin] = time24.split(':').map(Number);
    const cookMinutes = parseCookTimeMinutes(recipe.cookTime);
    
    startDate.setHours(startHour, startMin, 0);
    const endTotalMin = startHour * 60 + startMin + cookMinutes;
    endDate.setHours(Math.floor(endTotalMin / 60), endTotalMin % 60, 0);
    
    // Build full recipe description
    const ingredientsList = recipe.ingredientAmounts && recipe.ingredientAmounts.length > 0
      ? recipe.ingredientAmounts.map(ing => `• ${ing.amount} ${ing.unit} ${formatIngredientLabel(ing.id)}`).join('\n')
      : recipe.ingredients.map(ing => `• ${formatIngredientLabel(ing)}`).join('\n');
    
    const instructionsText = recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n');
    
    const descParts = [
      `⏱️ Cook Time: ${recipe.cookTime}`,
      `👥 Servings: ${recipe.servings}`,
      '',
      '📝 INGREDIENTS:',
      ingredientsList,
      '',
      '📋 INSTRUCTIONS:',
      instructionsText,
    ];
    
    if (recipe.nutrition) {
      const n = recipe.nutrition;
      descParts.push('', `📊 NUTRITION: ${n.calories} cal | ${n.protein}g protein | ${n.carbs}g carbs | ${n.fat}g fat`);
    }
    
    if (recipe.dietaryTags && recipe.dietaryTags.length > 0) {
      descParts.push('', `🏷️ ${recipe.dietaryTags.join(', ')}`);
    }
    
    descParts.push('', '🔗 Made with Ingredify');
    const fullDesc = descParts.join('\n');
    
    const mealTypeLabel = recipe.mealType.charAt(0).toUpperCase() + recipe.mealType.slice(1);
    const title = encodeURIComponent(`🍳 ${recipe.title} (${mealTypeLabel})`);
    const details = encodeURIComponent(fullDesc);
    
    if (type === 'google' || type === 'samsung') {
      const start = format(startDate, "yyyyMMdd'T'HHmmss");
      const end = format(endDate, "yyyyMMdd'T'HHmmss");
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
    }
    
    if (type === 'outlook') {
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${start}&enddt=${end}&body=${details}`;
    }

    if (type === 'yahoo') {
      const start = format(startDate, "yyyyMMdd'T'HHmmss");
      const durationHH = String(Math.floor(cookMinutes / 60)).padStart(2, '0');
      const durationMM = String(cookMinutes % 60).padStart(2, '0');
      return `https://calendar.yahoo.com/?v=60&title=${title}&st=${start}&dur=${durationHH}${durationMM}&desc=${details}`;
    }
    
    // Apple Calendar / ICS
    const start = format(startDate, "yyyyMMdd'T'HHmmss");
    const end = format(endDate, "yyyyMMdd'T'HHmmss");
    const uid = `${recipe.id}-${entry.date}@ingredify.org`;
    const now = format(new Date(), "yyyyMMdd'T'HHmmss");
    const escapedDesc = fullDesc.replace(/,/g, '\\,').replace(/\n/g, '\\n');
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ingredify//Meal Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:🍳 ${recipe.title} (${mealTypeLabel})
DESCRIPTION:${escapedDesc}
CATEGORIES:Meal Prep,Cooking,${mealTypeLabel}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:⏰ Start prepping ${recipe.title}! Cook time: ${recipe.cookTime}
END:VALARM
BEGIN:VALARM
TRIGGER:PT0M
ACTION:DISPLAY
DESCRIPTION:🍳 Time to cook ${recipe.title}!
END:VALARM
END:VEVENT
END:VCALENDAR`;
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  };

  const handleCalendarSync = (entry: MealPlanEntry, provider: CalendarProvider) => {
    const url = generateCalendarLink(entry, provider);
    
    if (provider === 'apple') {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${entry.recipe.title.replace(/\s+/g, '-')}.ics`;
      link.click();
    } else {
      window.open(url, '_blank');
    }
    
    const providerName = calendarProviders.find(p => p.id === provider)?.name || 'Calendar';
    toast({
      title: "Added to calendar!",
      description: `"${entry.recipe.title}" synced to ${providerName}`,
    });
  };

  const handleQuickCalendarSync = (entry: MealPlanEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const savedPreference = localStorage.getItem(CALENDAR_PREFERENCE_KEY) as CalendarProvider | null;
    
    if (savedPreference) {
      handleCalendarSync(entry, savedPreference);
    }
    // If no preference, the dropdown will show options
  };

  const savedPreference = localStorage.getItem(CALENDAR_PREFERENCE_KEY) as CalendarProvider | null;

  return (
    <>
      <Card className="shadow-elevated border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 gradient-sage z-10" />
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                Meal Plan
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {isEmpty ? "Plan your meals for the week ahead" : `${mealPlan.length} meal${mealPlan.length === 1 ? '' : 's'} planned`}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2">
              {weekMeals.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExport(true)}
                    className="mr-0.5 sm:mr-1 h-8 w-8 sm:h-auto sm:w-auto p-1.5 sm:px-3"
                  >
                    <FileText className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSyncAllWeek}
                    disabled={isSyncingAll}
                    className="mr-1 sm:mr-2 bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary h-8 w-8 sm:h-auto sm:w-auto p-1.5 sm:px-3"
                  >
                    <CalendarCheck className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">{isSyncingAll ? "Syncing..." : "Sync Week"}</span>
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setWeekStart(addDays(weekStart, -7))}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <span className="text-xs sm:text-sm font-medium min-w-[100px] sm:min-w-[140px] text-center">
                {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setWeekStart(addDays(weekStart, 7))}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {/* Mobile: Vertical stacked view */}
          <div className="flex flex-col gap-2 sm:hidden">
            {days.map((day) => {
              const meals = getMealsForDay(day);
              const isToday = isSameDay(day, new Date());
              const dateStr = format(day, "yyyy-MM-dd");

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "rounded-xl p-2.5 transition-all duration-200",
                    isToday ? "bg-primary/10 ring-2 ring-primary/20" : "bg-muted/30"
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-2 mb-1.5 pb-1.5 border-b border-border/50",
                    isToday && "text-primary font-semibold"
                  )}>
                    <div className="text-base font-medium min-w-[24px]">
                      {format(day, "d")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(day, "EEE")}
                    </div>
                    {isToday && (
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full ml-auto">Today</span>
                    )}
                  </div>
                  {meals.length > 0 ? (
                    <div className="space-y-1.5">
                      {meals.map((entry) => (
                        <div
                          key={entry.recipe.id}
                          className="group relative bg-card rounded-lg p-1.5 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors min-h-[40px]"
                          onClick={() => setSelectedRecipe(entry.recipe)}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{mealTypeIcons[entry.recipe.mealType] || "🍽️"}</span>
                            <span className="font-medium flex-1 text-xs truncate">
                              {entry.recipe.title}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(entry.date, entry.recipe.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No meals planned</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop: Grid view */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {days.map((day) => {
              const meals = getMealsForDay(day);
              const isToday = isSameDay(day, new Date());
              const dateStr = format(day, "yyyy-MM-dd");
              const isDragOver = dragOverDate === dateStr;

              return (
                <div
                  key={day.toISOString()}
                  onDragOver={(e) => handleDragOver(e, dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, dateStr)}
                  className={cn(
                    "min-h-[120px] rounded-xl p-2 transition-all duration-200",
                    isToday ? "bg-primary/10 ring-2 ring-primary/20" : "bg-muted/30",
                    isDragOver && "ring-2 ring-primary bg-primary/5 scale-[1.02]"
                  )}
                >
                  <div className={cn(
                    "flex flex-col text-center items-stretch gap-0 mb-2 pb-2 border-b border-border/50",
                    isToday && "text-primary font-semibold"
                  )}>
                    <div className="text-xs text-muted-foreground uppercase">
                      {format(day, "EEE")}
                    </div>
                    <div className="text-lg font-medium">
                      {format(day, "d")}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {meals.map((entry) => (
                      <div
                        key={entry.recipe.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, entry)}
                        className="group relative bg-card rounded-lg p-1.5 shadow-sm text-xs cursor-grab active:cursor-grabbing hover:bg-accent/50 transition-colors hover:shadow-md"
                        onClick={() => setSelectedRecipe(entry.recipe)}
                      >
                        <div className="flex items-start gap-1">
                          <span>{mealTypeIcons[entry.recipe.mealType] || "🍽️"}</span>
                          <span className="line-clamp-2 leading-tight font-medium flex-1">
                            {entry.recipe.title}
                          </span>
                        </div>
                        
                        {/* Quick calendar sync button */}
                        <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {savedPreference ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 px-1.5 text-[10px] bg-primary/10 hover:bg-primary/20 text-primary"
                              onClick={(e) => handleQuickCalendarSync(entry, e)}
                            >
                              <CalendarPlus className="h-3 w-3 mr-0.5" />
                              Sync
                            </Button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 px-1.5 text-[10px] bg-primary/10 hover:bg-primary/20 text-primary"
                                >
                                  <CalendarPlus className="h-3 w-3 mr-0.5" />
                                  Sync
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="start" 
                                className="w-40 bg-popover z-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {calendarProviders.map((provider) => (
                                  <DropdownMenuItem
                                    key={provider.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCalendarSync(entry, provider.id);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <span className="mr-2">{provider.icon}</span>
                                    {provider.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(entry.date, entry.recipe.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedRecipe && (
        <RecipeDetailDialog
          recipe={selectedRecipe}
          open={!!selectedRecipe}
          onOpenChange={(open) => !open && setSelectedRecipe(null)}
          onAddToShopping={onAddToShopping || (() => {})}
          isSaved={savedRecipes.includes(selectedRecipe.id)}
          onSave={onSaveRecipe ? () => onSaveRecipe(selectedRecipe.id) : () => {}}
          onAddToCalendar={onAddToCalendar ? () => onAddToCalendar(selectedRecipe) : () => {}}
        />
      )}

      <ExportMealPlanDialog
        open={showExport}
        onOpenChange={setShowExport}
        mealPlan={mealPlan}
        weekStart={weekStart}
        shoppingList={shoppingList}
      />
    </>
  );
}
