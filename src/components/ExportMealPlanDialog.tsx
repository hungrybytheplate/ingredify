import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { format, addDays } from "date-fns";
import type { MealPlanEntry } from "@/components/MealCalendar";
import { formatIngredientLabel } from "@/components/CustomIngredientInput";

function escapeHtml(str: string | number): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ExportMealPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealPlan: MealPlanEntry[];
  weekStart: Date;
  shoppingList?: { variant: string; checked: boolean }[];
}

export function ExportMealPlanDialog({ open, onOpenChange, mealPlan, weekStart, shoppingList = [] }: ExportMealPlanDialogProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getMealsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return mealPlan.filter(entry => entry.date === dateStr);
  };

  const mealTypeOrder = ["breakfast", "lunch", "dinner", "sides", "dessert"];

  const handlePrint = () => {
    const weekEnd = addDays(weekStart, 6);
    const title = `Meal Plan: ${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    const safeTitle = escapeHtml(title);

    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${safeTitle}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 24px; margin-bottom: 4px; }
  .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
  .day { margin-bottom: 20px; page-break-inside: avoid; }
  .day-header { font-size: 16px; font-weight: 600; border-bottom: 2px solid #2d6a4f; padding-bottom: 4px; margin-bottom: 8px; color: #2d6a4f; }
  .meal { padding: 6px 0; display: flex; gap: 12px; }
  .meal-type { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; min-width: 70px; padding-top: 2px; }
  .meal-title { font-size: 14px; }
  .meal-meta { font-size: 12px; color: #666; }
  .empty { font-style: italic; color: #aaa; font-size: 13px; padding: 4px 0; }
  .shopping { margin-top: 32px; page-break-before: always; }
  .shopping h2 { font-size: 20px; margin-bottom: 12px; color: #2d6a4f; border-bottom: 2px solid #2d6a4f; padding-bottom: 4px; }
  .shopping-item { font-size: 14px; padding: 3px 0; display: flex; align-items: center; gap: 8px; }
  .checkbox { width: 14px; height: 14px; border: 1.5px solid #999; border-radius: 2px; display: inline-block; }
  .checked { text-decoration: line-through; color: #999; }
  @media print { body { padding: 20px; } }
</style></head><body>`;

    html += `<h1>${safeTitle}</h1>`;
    html += `<div class="subtitle">Generated from Ingredify</div>`;

    for (const day of days) {
      const meals = getMealsForDay(day);
      const sortedMeals = [...meals].sort((a, b) => 
        mealTypeOrder.indexOf(a.recipe.mealType) - mealTypeOrder.indexOf(b.recipe.mealType)
      );
      
      html += `<div class="day">`;
      html += `<div class="day-header">${escapeHtml(format(day, "EEEE, MMMM d"))}</div>`;
      
      if (sortedMeals.length === 0) {
        html += `<div class="empty">No meals planned</div>`;
      } else {
        for (const entry of sortedMeals) {
          html += `<div class="meal">`;
          html += `<span class="meal-type">${escapeHtml(entry.recipe.mealType)}</span>`;
          html += `<div><div class="meal-title">${escapeHtml(entry.recipe.title)}</div>`;
          html += `<div class="meal-meta">${escapeHtml(entry.recipe.cookTime)} · ${escapeHtml(entry.recipe.servings)} servings</div>`;
          html += `</div></div>`;
        }
      }
      html += `</div>`;
    }

    // Shopping list
    const unchecked = shoppingList.filter(i => !i.checked);
    if (unchecked.length > 0) {
      html += `<div class="shopping"><h2>Shopping List (${unchecked.length} items)</h2>`;
      for (const item of unchecked) {
        html += `<div class="shopping-item"><span class="checkbox"></span> ${escapeHtml(formatIngredientLabel(item.variant))}</div>`;
      }
      html += `</div>`;
    }

    html += `</body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Export Meal Plan
          </DialogTitle>
          <DialogDescription>
            Print your weekly meal plan with your shopping list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <div className="text-sm text-muted-foreground">
            <strong>{format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d, yyyy")}</strong>
            <p className="mt-1">
              {mealPlan.filter(e => {
                const d = new Date(e.date);
                return d >= weekStart && d <= addDays(weekStart, 6);
              }).length} meals planned
              {shoppingList.filter(i => !i.checked).length > 0 && 
                ` · ${shoppingList.filter(i => !i.checked).length} shopping items`}
            </p>
          </div>

          <Button onClick={handlePrint} className="w-full gap-2">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Use your browser's "Save as PDF" option in the print dialog to download.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
