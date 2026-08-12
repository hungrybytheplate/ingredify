import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Timer, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addHours, addMinutes, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SourdoughTimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimerStep {
  id: string;
  label: string;
  emoji: string;
  description: string;
  offsetHours: number; // hours from start time
  durationMin: number; // event duration in minutes
}

const sourdoughSteps: TimerStep[] = [
  {
    id: "mix-dough",
    label: "Mix Dough + Autolyse",
    emoji: "🥣",
    description: "Combine starter, water, flour, salt. Rest 30-45 min.",
    offsetHours: 0,
    durationMin: 45,
  },
  {
    id: "stretch-fold-1",
    label: "Stretch & Fold #1",
    emoji: "🙌",
    description: "First set of stretch and folds (4 sides).",
    offsetHours: 0.75,
    durationMin: 5,
  },
  {
    id: "stretch-fold-2",
    label: "Stretch & Fold #2",
    emoji: "🙌",
    description: "Second set of stretch and folds.",
    offsetHours: 1.25,
    durationMin: 5,
  },
  {
    id: "stretch-fold-3",
    label: "Stretch & Fold #3",
    emoji: "🙌",
    description: "Third set of stretch and folds.",
    offsetHours: 1.75,
    durationMin: 5,
  },
  {
    id: "stretch-fold-4",
    label: "Stretch & Fold #4",
    emoji: "🙌",
    description: "Final set of stretch and folds.",
    offsetHours: 2.25,
    durationMin: 5,
  },
  {
    id: "bulk-ferment",
    label: "Check Bulk Fermentation",
    emoji: "⏳",
    description: "Dough should be 50-75% larger, puffy with bubbles.",
    offsetHours: 5,
    durationMin: 15,
  },
  {
    id: "shape",
    label: "Shape the Dough",
    emoji: "🍞",
    description: "Shape into boule/batard, place in banneton seam-side up.",
    offsetHours: 6,
    durationMin: 20,
  },
  {
    id: "cold-proof",
    label: "Start Cold Proof",
    emoji: "❄️",
    description: "Cover and refrigerate 8-16 hours.",
    offsetHours: 6.5,
    durationMin: 15,
  },
  {
    id: "preheat-oven",
    label: "Preheat Oven + Dutch Oven",
    emoji: "🔥",
    description: "Preheat to 500°F with Dutch oven inside for 45-60 min.",
    offsetHours: 20,
    durationMin: 60,
  },
  {
    id: "bake",
    label: "Score & Bake",
    emoji: "🎯",
    description: "Score dough, bake covered 20 min at 500°F, then uncovered 20-25 min at 450°F.",
    offsetHours: 21,
    durationMin: 45,
  },
  {
    id: "cool",
    label: "Cool Completely",
    emoji: "✨",
    description: "Cool on wire rack at least 1 hour before slicing.",
    offsetHours: 21.75,
    durationMin: 90,
  },
];

// Separate starter feeding reminders (for daily maintenance)
const starterFeedSteps: TimerStep[] = [
  {
    id: "feed-starter",
    label: "Feed Sourdough Starter",
    emoji: "🧫",
    description: "Discard half, add ½ cup flour + ¼ cup water. Mix well.",
    offsetHours: 0,
    durationMin: 10,
  },
];

type CalendarProvider = 'google' | 'apple';

const CALENDAR_PREFERENCE_KEY = 'preferred-calendar-provider';

function generateICSEvents(steps: TimerStep[], startDate: Date): string {
  const now = format(new Date(), "yyyyMMdd'T'HHmmss");
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ingredify//Sourdough Timer//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH\n`;

  for (const step of steps) {
    const start = addMinutes(addHours(startDate, Math.floor(step.offsetHours)), (step.offsetHours % 1) * 60);
    const end = addMinutes(start, step.durationMin);
    const uid = `sourdough-${step.id}-${format(startDate, "yyyyMMdd")}@ingredify.org`;
    
    ics += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${format(start, "yyyyMMdd'T'HHmmss")}
DTEND:${format(end, "yyyyMMdd'T'HHmmss")}
SUMMARY:${step.emoji} ${step.label}
DESCRIPTION:${step.description.replace(/,/g, '\\,')}
CATEGORIES:Sourdough,Baking
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT5M
ACTION:DISPLAY
DESCRIPTION:${step.emoji} Time for: ${step.label}
END:VALARM
END:VEVENT\n`;
  }

  ics += `END:VCALENDAR`;
  return ics;
}

function generateGoogleLink(step: TimerStep, startDate: Date): string {
  const start = addMinutes(addHours(startDate, Math.floor(step.offsetHours)), (step.offsetHours % 1) * 60);
  const end = addMinutes(start, step.durationMin);
  const title = encodeURIComponent(`${step.emoji} ${step.label}`);
  const details = encodeURIComponent(step.description);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${format(start, "yyyyMMdd'T'HHmmss")}/${format(end, "yyyyMMdd'T'HHmmss")}&details=${details}`;
}

export function SourdoughTimerDialog({ open, onOpenChange }: SourdoughTimerDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [startHour, setStartHour] = useState(18); // 6 PM default (evening mix)
  const [mode, setMode] = useState<"bake" | "feed">("bake");
  const [synced, setSynced] = useState(false);

  const savedPreference = (typeof window !== 'undefined' ? localStorage.getItem(CALENDAR_PREFERENCE_KEY) : null) as CalendarProvider | null;

  const steps = mode === "bake" ? sourdoughSteps : starterFeedSteps;

  const handleSyncAll = (provider: CalendarProvider) => {
    if (!startDate) return;
    
    const baseDate = new Date(startDate);
    baseDate.setHours(startHour, 0, 0, 0);

    if (provider === 'apple') {
      const ics = generateICSEvents(steps, baseDate);
      const blob = new Blob([ics], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sourdough-${mode}-timers.ics`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Google — open first event, rest need manual
      steps.forEach((step, i) => {
        setTimeout(() => {
          window.open(generateGoogleLink(step, baseDate), '_blank');
        }, i * 500);
      });
    }

    setSynced(true);
    toast({
      title: "Sourdough timers synced!",
      description: `${steps.length} reminders added to your calendar.`,
    });
  };

  const getStepTime = (step: TimerStep): string => {
    if (!startDate) return "";
    const baseDate = new Date(startDate);
    baseDate.setHours(startHour, 0, 0, 0);
    const time = addMinutes(addHours(baseDate, Math.floor(step.offsetHours)), (step.offsetHours % 1) * 60);
    return format(time, "EEE h:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSynced(false); }}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Sourdough Timer
          </DialogTitle>
          <DialogDescription>
            Set your start time and we'll create calendar reminders for each step.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Mode toggle */}
          <div className="flex gap-2">
            <Button
              variant={mode === "bake" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("bake")}
              className="flex-1"
            >
              🍞 Bake Day
            </Button>
            <Button
              variant={mode === "feed" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("feed")}
              className="flex-1"
            >
              🧫 Starter Feed
            </Button>
          </div>

          {/* Date picker */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              className="rounded-xl border shadow-sm"
            />
          </div>

          {/* Start time */}
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Start time:</span>
            <select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="text-sm rounded-md border bg-background px-2 py-1"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                </option>
              ))}
            </select>
          </div>

          {/* Timeline preview */}
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto rounded-lg bg-muted/30 p-3">
            {steps.map(step => (
              <div key={step.id} className="flex items-center gap-2 text-sm">
                <span className="text-base">{step.emoji}</span>
                <span className="font-medium flex-1 truncate">{step.label}</span>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {getStepTime(step)}
                </Badge>
              </div>
            ))}
          </div>

          {/* Sync buttons */}
          {synced ? (
            <div className="flex items-center justify-center gap-2 text-sm text-primary py-2">
              <Check className="h-4 w-4" />
              Timers synced to your calendar!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleSyncAll('google')}
                disabled={!startDate}
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSyncAll('apple')}
                disabled={!startDate}
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                Apple / ICS
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
