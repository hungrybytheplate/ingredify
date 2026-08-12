import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { Recipe } from "@/data/recipes";
import { Calendar as CalendarIcon, ExternalLink, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences, type MealTimes } from "@/hooks/useUserPreferences";
import { formatIngredientLabel } from "@/components/CustomIngredientInput";
interface AddToCalendarDialogProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: Date) => void;
}

type CalendarProvider = 'google' | 'outlook' | 'apple' | 'samsung' | 'yahoo';

const CALENDAR_PREFERENCE_KEY = 'preferred-calendar-provider';

// Detect if user is on mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Detect specific platforms
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isAndroid = () => /Android/i.test(navigator.userAgent);
const isSamsung = () => /Samsung/i.test(navigator.userAgent);

function formatTimeFrom24(time24: string): { time: string; hour: number; minute: number } {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const time = `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  return { time, hour: hours, minute: minutes };
}

function getMealTypeTime(mealType: string, mealTimes: MealTimes): { time: string; hour: number; minute: number } {
  const time24 = mealTimes[mealType as keyof MealTimes] || '18:00';
  return formatTimeFrom24(time24);
}

function formatMealType(mealType: string): string {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

function formatNutrition(recipe: Recipe): string {
  if (!recipe.nutrition) return '';
  const n = recipe.nutrition;
  const parts = [
    `Calories: ${n.calories}`,
    `Protein: ${n.protein}g`,
    `Carbs: ${n.carbs}g`,
    `Fat: ${n.fat}g`,
  ];
  if (n.fiber) parts.push(`Fiber: ${n.fiber}g`);
  if (n.sodium) parts.push(`Sodium: ${n.sodium}mg`);
  if (n.cholesterol) parts.push(`Cholesterol: ${n.cholesterol}mg`);
  return parts.join(' | ');
}

function formatIngredientsList(recipe: Recipe): string {
  if (recipe.ingredientAmounts && recipe.ingredientAmounts.length > 0) {
    return recipe.ingredientAmounts
      .map(ing => `• ${ing.amount} ${ing.unit} ${formatIngredientLabel(ing.id)}`)
      .join('\n');
  }
  return recipe.ingredients.map(ing => `• ${formatIngredientLabel(ing)}`).join('\n');
}

function parseCookTimeMinutes(cookTime: string): number {
  const hourMatch = cookTime.match(/(\d+)\s*h/i);
  const minMatch = cookTime.match(/(\d+)\s*m/i);
  let total = 0;
  if (hourMatch) total += parseInt(hourMatch[1]) * 60;
  if (minMatch) total += parseInt(minMatch[1]);
  if (total === 0) {
    const numOnly = cookTime.match(/(\d+)/);
    if (numOnly) total = parseInt(numOnly[1]);
  }
  return total || 60; // Default 60 min
}

function formatInstructions(recipe: Recipe): string {
  return recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n');
}

function generateCalendarLinks(recipe: Recipe, date: Date, mealTimes: MealTimes) {
  const mealInfo = getMealTypeTime(recipe.mealType, mealTimes);
  const mealTypeLabel = formatMealType(recipe.mealType);
  const nutritionInfo = formatNutrition(recipe);
  const ingredientsList = formatIngredientsList(recipe);
  const cookMinutes = parseCookTimeMinutes(recipe.cookTime);
  const instructionsText = formatInstructions(recipe);
  
  // Build comprehensive description
  const descriptionParts = [
    `🍽️ ${mealTypeLabel} at ${mealInfo.time}`,
    `⏱️ Cook Time: ${recipe.cookTime}`,
    `👥 Servings: ${recipe.servings}`,
    '',
    '📝 INGREDIENTS:',
    ingredientsList,
    '',
    '📋 INSTRUCTIONS:',
    instructionsText,
  ];
  
  if (nutritionInfo) {
    descriptionParts.push('', '📊 NUTRITION (per serving):', nutritionInfo);
  }
  
  if (recipe.difficulty) {
    descriptionParts.push('', `📈 Difficulty: ${recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}`);
  }
  
  if (recipe.dietaryTags && recipe.dietaryTags.length > 0) {
    descriptionParts.push('', `🏷️ Tags: ${recipe.dietaryTags.join(', ')}`);
  }
  
  descriptionParts.push('', '🔗 Made with The Kitchen - ingredify.org');
  
  const fullDescription = descriptionParts.join('\n');
  
  const title = encodeURIComponent(`🍳 ${recipe.title} (${mealTypeLabel})`);
  const description = encodeURIComponent(fullDescription);
  const startDate = format(date, "yyyyMMdd");
  const uid = `${recipe.id}-${startDate}@thekitchen.app`;
  const now = format(new Date(), "yyyyMMdd'T'HHmmss");
  
  // Calculate end time based on cook time duration
  const startTotalMinutes = mealInfo.hour * 60 + mealInfo.minute;
  const endTotalMinutes = startTotalMinutes + cookMinutes;
  const endHour = Math.floor(endTotalMinutes / 60);
  const endMinute = endTotalMinutes % 60;
  
  const startDateTime = `${startDate}T${String(mealInfo.hour).padStart(2, '0')}${String(mealInfo.minute).padStart(2, '0')}00`;
  const endDateTime = `${startDate}T${String(endHour).padStart(2, '0')}${String(endMinute).padStart(2, '0')}00`;

  // Google Calendar
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${description}`;

  // Outlook Calendar
  const outlookStartTime = `${format(date, "yyyy-MM-dd")}T${String(mealInfo.hour).padStart(2, '0')}:${String(mealInfo.minute).padStart(2, '0')}:00`;
  const outlookEndTime = `${format(date, "yyyy-MM-dd")}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
  const outlookUrl = `https://outlook.live.com/calendar/0/action/compose?subject=${title}&startdt=${outlookStartTime}&enddt=${outlookEndTime}&body=${description}`;

  // Yahoo Calendar
  const durationHH = String(Math.floor(cookMinutes / 60)).padStart(2, '0');
  const durationMM = String(cookMinutes % 60).padStart(2, '0');
  const yahooUrl = `https://calendar.yahoo.com/?v=60&title=${title}&st=${startDateTime}&dur=${durationHH}${durationMM}&desc=${description}`;

  // Samsung Calendar
  const samsungUrl = googleUrl;

  // Enhanced ICS for Apple Calendar
  const escapedDesc = fullDescription.replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Kitchen//Meal Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${startDateTime}
DTEND:${endDateTime}
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
  const appleUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  return { googleUrl, outlookUrl, appleUrl, yahooUrl, samsungUrl };
}

const calendarProviders = [
  {
    id: 'google' as CalendarProvider,
    name: 'Google Calendar',
    gradient: 'from-blue-500 via-green-500 to-yellow-500',
    urlKey: 'googleUrl' as const,
    mobileNote: 'Opens Google Calendar app on Android',
  },
  {
    id: 'outlook' as CalendarProvider,
    name: 'Outlook Calendar',
    bg: 'bg-[#0078D4]',
    urlKey: 'outlookUrl' as const,
    mobileNote: 'Opens Outlook app if installed',
  },
  {
    id: 'apple' as CalendarProvider,
    name: 'Apple Calendar',
    gradient: 'from-red-400 to-red-600',
    urlKey: 'appleUrl' as const,
    isDownload: true,
    mobileNote: 'Downloads .ics file for iOS Calendar',
  },
  {
    id: 'samsung' as CalendarProvider,
    name: 'Samsung Calendar',
    bg: 'bg-[#1428A0]',
    urlKey: 'samsungUrl' as const,
    mobileNote: 'For Samsung Galaxy devices',
  },
  {
    id: 'yahoo' as CalendarProvider,
    name: 'Yahoo Calendar',
    bg: 'bg-[#6001D2]',
    urlKey: 'yahooUrl' as const,
    mobileNote: 'Opens Yahoo Calendar',
  },
];

export function AddToCalendarDialog({ recipe, open, onOpenChange, onConfirm }: AddToCalendarDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [savedPreference, setSavedPreference] = useState<CalendarProvider | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const { toast } = useToast();
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const saved = localStorage.getItem(CALENDAR_PREFERENCE_KEY) as CalendarProvider | null;
    if (saved) {
      setSavedPreference(saved);
      setAutoSyncEnabled(true);
    }
  }, []);

  if (!recipe) return null;

  const handleAddToMealPlan = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
      
      // If auto-sync is enabled and we have a saved preference, sync immediately
      if (autoSyncEnabled && savedPreference) {
        handleCalendarSelect(savedPreference, true);
      } else {
        setShowCalendarOptions(true);
      }
    }
  };

  const calendarLinks = selectedDate ? generateCalendarLinks(recipe, selectedDate, preferences.mealTimes) : null;

  // Get recommended providers based on device
  const getRecommendedProviders = () => {
    const providers = [...calendarProviders];
    
    if (isIOS()) {
      // Move Apple to top for iOS
      const appleIndex = providers.findIndex(p => p.id === 'apple');
      if (appleIndex > 0) {
        const [apple] = providers.splice(appleIndex, 1);
        providers.unshift(apple);
      }
    } else if (isSamsung()) {
      // Move Samsung to top for Samsung devices
      const samsungIndex = providers.findIndex(p => p.id === 'samsung');
      if (samsungIndex > 0) {
        const [samsung] = providers.splice(samsungIndex, 1);
        providers.unshift(samsung);
      }
    } else if (isAndroid()) {
      // Google is already first, which is good for Android
    }
    
    return providers;
  };

  const handleCalendarSelect = (provider: CalendarProvider, isAutoSync = false) => {
    if (rememberChoice || isAutoSync) {
      localStorage.setItem(CALENDAR_PREFERENCE_KEY, provider);
      setSavedPreference(provider);
      setAutoSyncEnabled(true);
    }
    
    const providerConfig = calendarProviders.find(p => p.id === provider);
    if (providerConfig && calendarLinks) {
      const url = calendarLinks[providerConfig.urlKey];
      if (providerConfig.isDownload) {
        // For Apple/ICS, trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${recipe.title.replace(/\s+/g, "-")}.ics`;
        link.click();
      } else {
        window.open(url, "_blank");
      }
      
      // Show confirmation toast with mobile-friendly message
      const mobileMsg = isMobile() && providerConfig.mobileNote 
        ? ` ${providerConfig.mobileNote}` 
        : '';
      toast({
        title: isAutoSync ? "Auto-synced to calendar!" : "Added to calendar!",
        description: `"${recipe.title}" synced to ${providerConfig.name}.${mobileMsg}`,
      });
    }
    handleDone();
  };

  const handleDone = () => {
    setShowCalendarOptions(false);
    setRememberChoice(false);
    onOpenChange(false);
  };

  const clearPreference = () => {
    localStorage.removeItem(CALENDAR_PREFERENCE_KEY);
    setSavedPreference(null);
    setAutoSyncEnabled(false);
  };

  const sortedProviders = getRecommendedProviders();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setShowCalendarOptions(false);
        setRememberChoice(false);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {showCalendarOptions ? "Sync to Your Calendar" : "Add to Meal Plan"}
          </DialogTitle>
          <DialogDescription>
            {showCalendarOptions 
              ? `"${recipe.title}" has been added to your meal plan!`
              : `Choose a date for "${recipe.title}"`}
          </DialogDescription>
        </DialogHeader>

        {!showCalendarOptions ? (
          <>
            <div className="flex justify-center py-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-xl border shadow-sm pointer-events-auto"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="warm"
                onClick={handleAddToMealPlan}
                disabled={!selectedDate}
              >
                Add to {selectedDate ? format(selectedDate, "MMM d") : "Calendar"}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4 py-2">
            {/* Prominent sync prompt */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-4 border border-primary/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Never miss a meal!</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isMobile() 
                      ? "Sync to your phone's calendar for reminders" 
                      : "Sync to your calendar for automatic reminders"}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile device detection hint */}
            {isMobile() && (
              <div className="text-xs text-center text-muted-foreground bg-muted/30 rounded-lg py-2 px-3">
                📱 Recommended for your device shown first
              </div>
            )}

            {/* Calendar provider buttons */}
            <div className="grid gap-2">
              {sortedProviders.map((provider, index) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className={cn(
                    "w-full justify-start gap-3 h-14 transition-all hover:scale-[1.02] hover:shadow-md",
                    savedPreference === provider.id && "ring-2 ring-primary ring-offset-2",
                    index === 0 && isMobile() && !savedPreference && "ring-2 ring-secondary ring-offset-1"
                  )}
                  onClick={() => handleCalendarSelect(provider.id)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    provider.gradient ? `bg-gradient-to-br ${provider.gradient}` : provider.bg
                  )}>
                    <CalendarIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium">{provider.name}</span>
                    {savedPreference === provider.id && (
                      <span className="ml-2 text-xs text-primary">(Auto-sync enabled)</span>
                    )}
                    {index === 0 && isMobile() && !savedPreference && (
                      <span className="ml-2 text-xs text-secondary">(Recommended)</span>
                    )}
                  </div>
                  {savedPreference === provider.id ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              ))}
            </div>

            {/* Remember choice checkbox */}
            <div className="flex items-center space-x-3 px-1 py-2 rounded-lg bg-muted/50">
              <Checkbox 
                id="remember-choice" 
                checked={rememberChoice}
                onCheckedChange={(checked) => setRememberChoice(checked === true)}
              />
              <label 
                htmlFor="remember-choice" 
                className="text-sm text-muted-foreground cursor-pointer select-none flex-1"
              >
                <span>Enable one-tap auto-sync</span>
                <span className="block text-xs opacity-70">
                  Future meals will sync automatically to your chosen calendar
                </span>
              </label>
            </div>

            {savedPreference && (
              <button 
                onClick={clearPreference}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Disable auto-sync & clear preference
              </button>
            )}

            <div className="flex justify-end pt-2 border-t">
              <Button variant="ghost" onClick={handleDone}>
                Skip for now
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
