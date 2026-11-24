import { Link } from "react-router-dom";
import { recipePath } from "@/lib/recipeSlug";

const groups: { label: string; items: string[] }[] = [
  { label: "Main", items: ["Herb Butter Roast Turkey", "Cranberry Glazed Holiday Ham"] },
  {
    label: "Sides",
    items: [
      "Classic Green Bean Casserole",
      "Sweet Potato Casserole with Pecan Streusel",
      "Cornbread Sausage Stuffing",
      "Classic Herb Stuffing",
      "Maple Bacon Roasted Brussels Sprouts",
      "Fresh Cranberry Orange Sauce",
      "Pan Drippings Turkey Gravy",
      "Soft Butter Dinner Rolls",
    ],
  },
  { label: "Appetizers", items: ["Baked Brie with Cranberries & Pecans", "Cranberry Brie Puff Pastry Bites", "Classic Deviled Eggs"] },
  { label: "Desserts", items: ["Classic Pumpkin Pie", "Classic Pecan Pie", "Dutch Apple Crumb Pie"] },
  { label: "Day After", items: ["Leftover Turkey Cranberry Sandwich"] },
];

export function ThanksgivingMenu() {
  return (
    <details aria-labelledby="thanksgiving-heading" className="group rounded-2xl border border-border/50 bg-card p-4 shadow-soft lg:col-span-2">
      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3">
        <span>
          <h2 id="thanksgiving-heading" className="font-serif text-xl font-semibold text-foreground">🦃 Thanksgiving Menu</h2>
          <span className="block text-sm text-muted-foreground mt-1">Everything for the big day, from turkey to pie.</span>
        </span>
        <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground group-open:hidden">See menu</span>
        <span className="hidden shrink-0 text-sm font-medium text-muted-foreground group-open:inline">Hide</span>
      </summary>
      <div className="mt-3 space-y-3">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{g.label}</p>
            <div className="flex flex-wrap gap-2">
              {g.items.map((title) => (
                <Link
                  key={title}
                  to={recipePath({ title })}
                  className="inline-flex min-h-10 items-center rounded-full border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
