import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChefHat, 
  Refrigerator, 
  Sparkles, 
  Calendar, 
  Heart, 
  ShoppingCart,
  ArrowRight,
  X,
  Wine,
  Activity,
  Package,
  Star,
  Link,
  Utensils,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TourStep {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight: string;
}

const steps: TourStep[] = [
  {
    icon: ChefHat,
    title: "Welcome to Ingredify!",
    description: "Your personal meal planning assistant. Let's take a quick tour to help you get started.",
    highlight: "Let's cook something delicious together",
  },
  {
    icon: Refrigerator,
    title: "Select Your Ingredients",
    description: "Start by checking off ingredients you have in your fridge, pantry, and spice cabinet.",
    highlight: "The more you select, the more recipes you'll discover",
  },
  {
    icon: Sparkles,
    title: "Discover Recipes",
    description: "Click 'Find Recipes' and we'll show you delicious ideas that match your ingredients.",
    highlight: "Missing an ingredient? Add it to your shopping list!",
  },
  {
    icon: Wine,
    title: "Mix Drinks Too!",
    description: "Switch to Drink mode to discover cocktails, mocktails, smoothies and wellness drinks.",
    highlight: "From margaritas to matcha lattes",
  },
  {
    icon: Calendar,
    title: "Plan Your Week",
    description: "Add recipes to your meal calendar. Drag and drop to rearrange, and sync with your calendar app.",
    highlight: "Meal prep made simple",
  },
  {
    icon: Activity,
    title: "Track Your Nutrition",
    description: "See your weekly nutrition summary with calories, protein, carbs, fat, and more.",
    highlight: "Stay on top of your health goals",
  },
  {
    icon: Package,
    title: "Manage Your Pantry",
    description: "Visit My Pantry to manage your ingredients with bulk actions and category controls.",
    highlight: "Keep your kitchen organized",
  },
  {
    icon: Heart,
    title: "Save & Rate Favorites",
    description: "Save recipes and drinks you love. Rate them with stars and add personal notes.",
    highlight: "Build your personal cookbook",
  },
  {
    icon: Link,
    title: "Import Recipes from the Web",
    description: "Paste a URL from any recipe website and AI will extract the title, ingredients, instructions, and nutrition info automatically.",
    highlight: "Works with AllRecipes, Food Network, and more",
  },
  {
    icon: Utensils,
    title: "Pairs Well With",
    description: "Every recipe and drink has curated pairing suggestions. Tap any pairing to jump straight to it.",
    highlight: "Discover perfect food & drink combos",
  },
  {
    icon: Star,
    title: "Smart Suggestions",
    description: "Get personalized recipe recommendations based on your saved favorites and preferences.",
    highlight: "Discover new dishes you'll love",
  },
  {
    icon: ShoppingCart,
    title: "Build Your Shopping List",
    description: "Missing ingredients get added automatically. Choose specific variants and check them off!",
    highlight: "You're all set to start cooking!",
  },
];

export function WelcomeTour({ onComplete, onSkip }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const step = steps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [isLastStep, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSkip();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onSkip]);

  if (!mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-4">
      {/* Simple overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onSkip}
      />

      {/* Centered card */}
      <Card 
        className="relative w-full max-w-md shadow-2xl border-border/50 overflow-hidden bg-card mb-safe-area-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 gradient-warm" />
        
        {/* Skip button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 h-9 w-9 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground z-10"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          aria-label="Skip tour"
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="p-4 sm:p-5 pt-8 sm:pt-10">
          {/* Progress dots */}
          <div className="flex justify-center gap-1 mb-4 sm:mb-5 flex-wrap" role="tablist" aria-label="Tour progress">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentStep(index);
                }}
                aria-label={`Go to step ${index + 1} of ${steps.length}`}
                role="tab"
                aria-selected={index === currentStep}
                className={cn(
                  "relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300",
                    index === currentStep 
                      ? "w-5 gradient-warm" 
                      : index < currentStep 
                        ? "w-2 bg-primary/60" 
                        : "w-2 bg-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <div className="absolute inset-0 gradient-warm blur-xl opacity-40" />
              <div className="relative p-2.5 sm:p-3 rounded-xl gradient-warm shadow-warm">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-4 sm:mb-5" key={currentStep}>
            <h2 className="font-serif text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">{step.title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">{step.description}</p>
            <Badge variant="secondary" className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">
              {step.highlight}
            </Badge>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={currentStep === 0}
              className="text-muted-foreground"
            >
              Back
            </Button>
            
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </span>

            <Button
              variant="warm"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="min-w-[80px]"
            >
              {isLastStep ? "Get Started" : "Next"}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(content, document.body);
}
