import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChefHat,
  Utensils,
  Clock,
  Flame,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/data/recipes";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface CookingModeProps {
  recipe: Recipe;
  open: boolean;
  onClose: () => void;
  servingMultiplier?: number;
}

interface ExtractedTimer {
  minutes: number;
  label: string;
  stepIndex: number;
}

// Extract timers from instruction text
function extractTimersFromInstructions(instructions: string[]): ExtractedTimer[] {
  const timers: ExtractedTimer[] = [];
  const timePattern = /(\d+)[-–]?(\d+)?\s*(minutes?|mins?|hours?|hrs?|seconds?|secs?)/gi;
  
  instructions.forEach((instruction, index) => {
    let match;
    while ((match = timePattern.exec(instruction)) !== null) {
      const minTime = parseInt(match[1]);
      const maxTime = match[2] ? parseInt(match[2]) : minTime;
      const unit = match[3].toLowerCase();
      
      let minutes = maxTime; // Use max time for safety
      if (unit.startsWith('hour') || unit.startsWith('hr')) {
        minutes = maxTime * 60;
      } else if (unit.startsWith('sec')) {
        minutes = Math.ceil(maxTime / 60);
      }
      
      // Only add meaningful timers (1+ minutes)
      if (minutes >= 1) {
        // Create a short label from the instruction
        const labelMatch = instruction.match(/(\w+\s+){0,3}(\d+[-–]?\d*\s*(minutes?|mins?|hours?|hrs?|seconds?|secs?))/i);
        const label = labelMatch ? `Step ${index + 1}: ${minutes} min` : `${minutes} min`;
        
        timers.push({ minutes, label, stepIndex: index });
      }
    }
  });
  
  return timers;
}

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function CookingMode({ recipe, open, onClose, servingMultiplier = 1 }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeTimer, setActiveTimer] = useState<{ seconds: number; isRunning: boolean; label: string } | null>(null);
  const [showIngredients, setShowIngredients] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const extractedTimers = extractTimersFromInstructions(recipe.instructions);
  const currentStepTimers = extractedTimers.filter(t => t.stepIndex === currentStep);
  
  const progress = ((completedSteps.length) / recipe.instructions.length) * 100;
  const allStepsComplete = completedSteps.length === recipe.instructions.length;

  // Request wake lock to keep screen on
  useEffect(() => {
    if (open && 'wakeLock' in navigator) {
      let wakeLock: WakeLockSentinel | null = null;
      
      const requestWakeLock = async () => {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.log('Wake lock request failed:', err);
        }
      };
      
      requestWakeLock();
      
      return () => {
        if (wakeLock) {
          wakeLock.release();
        }
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Timer countdown logic
  useEffect(() => {
    if (activeTimer?.isRunning && activeTimer.seconds > 0) {
      timerRef.current = setInterval(() => {
        setActiveTimer(prev => {
          if (!prev) return null;
          const newSeconds = prev.seconds - 1;
          if (newSeconds <= 0) {
            // Play alarm sound
            playAlarm();
            return { ...prev, seconds: 0, isRunning: false };
          }
          return { ...prev, seconds: newSeconds };
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeTimer?.isRunning]);

  const playAlarm = useCallback(() => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.5;
    
    oscillator.start();
    
    // Beep pattern
    setTimeout(() => oscillator.stop(), 200);
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      osc2.connect(gainNode);
      osc2.frequency.value = 800;
      osc2.start();
      setTimeout(() => osc2.stop(), 200);
    }, 400);
    setTimeout(() => {
      const osc3 = audioContext.createOscillator();
      osc3.connect(gainNode);
      osc3.frequency.value = 1000;
      osc3.start();
      setTimeout(() => osc3.stop(), 400);
    }, 800);
  }, []);

  const startTimer = (minutes: number, label: string) => {
    setActiveTimer({
      seconds: minutes * 60,
      isRunning: true,
      label
    });
  };

  const toggleTimer = () => {
    if (activeTimer) {
      setActiveTimer(prev => prev ? { ...prev, isRunning: !prev.isRunning } : null);
    }
  };

  const resetTimer = () => {
    setActiveTimer(null);
  };

  const handleNextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(prev => prev + 1);
    } else if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleStepComplete = () => {
    setCompletedSteps(prev => 
      prev.includes(currentStep) 
        ? prev.filter(i => i !== currentStep)
        : [...prev, currentStep]
    );
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentStep > 0) {
      handlePrevStep();
    } else if (info.offset.x < -threshold && currentStep < recipe.instructions.length - 1) {
      handleNextStep();
    }
  };

  const scaleAmount = (amount: string): string => {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    const scaled = num * servingMultiplier;
    if (scaled === Math.floor(scaled)) return scaled.toString();
    return scaled.toFixed(2).replace(/\.?0+$/, '');
  };

  const handleClose = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setActiveTimer(null);
    setShowIngredients(false);
    onClose();
  };

  if (!open) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card/95 backdrop-blur-sm safe-area-top">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-10 w-10 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 text-center">
          <h1 className="font-serif text-lg font-semibold line-clamp-1 px-2">
            {recipe.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {recipe.instructions.length}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowIngredients(!showIngredients)}
          className={cn(
            "h-10 w-10 rounded-full",
            showIngredients && "bg-primary/10 text-primary"
          )}
        >
          <Utensils className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-muted/30">
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-sm font-medium text-primary min-w-[45px]">
            {Math.round(progress)}%
          </span>
        </div>
        
        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {recipe.instructions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentStep 
                  ? "w-6 bg-primary" 
                  : completedSteps.includes(i)
                    ? "w-2 bg-secondary"
                    : "w-2 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Ingredients Panel (Slide-out) */}
      <AnimatePresence>
        {showIngredients && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b bg-card"
          >
            <div className="p-4 max-h-48 overflow-y-auto">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" />
                Ingredients
                {servingMultiplier !== 1 && (
                  <Badge variant="outline" className="text-xs ml-auto">
                    ×{servingMultiplier}
                  </Badge>
                )}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, i) => {
                  const ingredientAmount = recipe.ingredientAmounts?.find(a => a.id === ing);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50"
                    >
                      <span className="capitalize">{ing.replace("-", " ")}</span>
                      {ingredientAmount && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {scaleAmount(ingredientAmount.amount)} {ingredientAmount.unit}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Current Step */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="flex-1 p-4 overflow-y-auto"
        >
            <Card 
            className={cn(
              "p-4 sm:p-6 min-h-[160px] sm:min-h-[200px] border-2 transition-all",
              completedSteps.includes(currentStep) 
                ? "border-secondary/50 bg-secondary/5" 
                : "border-primary/20 bg-card"
            )}
          >
            {/* Step Number */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <button
                onClick={toggleStepComplete}
                className={cn(
                  "flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold transition-all",
                  completedSteps.includes(currentStep)
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {completedSteps.includes(currentStep) ? (
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7" />
                ) : (
                  currentStep + 1
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    Step {currentStep + 1}
                  </Badge>
                  {completedSteps.includes(currentStep) && (
                    <Badge className="text-xs bg-secondary text-secondary-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
                {currentStepTimers.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Timer available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Instruction Text */}
            <p className={cn(
              "text-base sm:text-lg leading-relaxed",
              completedSteps.includes(currentStep) && "text-muted-foreground line-through"
            )}>
              {recipe.instructions[currentStep]}
            </p>

            {/* Timer buttons for this step */}
            {currentStepTimers.length > 0 && !activeTimer && (
              <div className="mt-6 flex flex-wrap gap-2">
                {currentStepTimers.map((timer, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => startTimer(timer.minutes, timer.label)}
                    className="gap-2"
                  >
                    <Timer className="h-4 w-4" />
                    Set {timer.minutes} min timer
                  </Button>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Active Timer Display */}
        <AnimatePresence>
          {activeTimer && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="px-4 pb-2"
            >
              <Card className={cn(
                "p-4 border-2",
                activeTimer.seconds === 0 
                  ? "border-destructive bg-destructive/10 animate-pulse" 
                  : activeTimer.isRunning 
                    ? "border-primary bg-primary/5"
                    : "border-muted bg-muted/30"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    activeTimer.seconds === 0 
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-primary/10"
                  )}>
                    {activeTimer.seconds === 0 ? (
                      <AlertCircle className="h-6 w-6" />
                    ) : (
                      <Timer className={cn(
                        "h-6 w-6",
                        activeTimer.isRunning && "animate-pulse text-primary"
                      )} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{activeTimer.label}</p>
                    <p className={cn(
                      "text-3xl font-mono font-bold",
                      activeTimer.seconds === 0 && "text-destructive"
                    )}>
                      {formatTime(activeTimer.seconds)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleTimer}
                      className="h-10 w-10 rounded-full"
                      disabled={activeTimer.seconds === 0}
                    >
                      {activeTimer.isRunning ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetTimer}
                      className="h-10 w-10 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 border-t bg-card/95 backdrop-blur-sm safe-area-bottom">
        {allStepsComplete ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-3 sm:py-4"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary/20 mb-2 sm:mb-3">
              <ChefHat className="h-7 w-7 sm:h-8 sm:w-8 text-secondary" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1">All Done!</h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
              Enjoy your {recipe.title}!
            </p>
            <Button variant="warm" onClick={handleClose} className="w-full h-11 sm:h-auto">
              Close Cooking Mode
            </Button>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="flex-1 h-11 sm:h-12"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
            
            <Button
              variant="warm"
              onClick={handleNextStep}
              className="flex-1 h-11 sm:h-12"
            >
              {currentStep === recipe.instructions.length - 1 ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-5 w-5 ml-1" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
