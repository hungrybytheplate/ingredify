import { ChefHat, Clock, Heart, Calendar, ShoppingCart, Sparkles, Wine, GlassWater, Citrus, Martini } from "lucide-react";

interface SEOContentProps {
  /** Which mode to surface popular searches for. Defaults to "cook". */
  mode?: "cook" | "drink";
}

/**
 * SEO-focused content section with semantic HTML for search engines
 * This provides crawlable, keyword-rich content that improves rankings
 */
export function SEOContent({ mode = "cook" }: SEOContentProps = {}) {
  const popularSearches = mode === "drink"
    ? [
        "cocktail",
        "mocktail",
        "smoothie",
        "green smoothie",
        "iced coffee",
        "matcha",
        "wellness",
        "detox",
        "immune",
        "hot toddy",
        "margarita",
        "non-alcoholic",
      ]
    : [
        "chicken",
        "pasta",
        "easy",
        "vegetarian",
        "vegan",
        "keto",
        "gluten-free",
        "breakfast",
        "dessert",
        "soup",
        "salad",
        "copycat",
      ];

  const sectionTitle = mode === "drink"
    ? "Popular Drink Searches"
    : "Popular Recipe Searches";

  const heading = mode === "drink"
    ? "Your Personal Drink Mixer & Beverage Planner"
    : "Your Personal Recipe Finder & Meal Planner";

  const features = mode === "drink"
    ? [
        {
          Icon: Martini,
          title: "What Can I Mix With What I Have?",
          body:
            "Stop guessing what to pour. Select the spirits, mixers, juices, and garnishes you have on hand, and instantly discover cocktails, mocktails, and smoothies you can make right now — no extra trip to the liquor store needed.",
        },
        {
          Icon: Clock,
          title: "Quick Cocktails & Easy Mocktails",
          body:
            "Find 5-minute drink ideas for happy hour, brunch, or a quiet night in. From two-ingredient highballs to refreshing alcohol-free spritzes, there is something for every mood and skill level.",
        },
        {
          Icon: GlassWater,
          title: "Smoothies, Coffee & Wellness Drinks",
          body:
            "Blend up green smoothies, protein shakes, iced lattes, matcha, and immune-boosting tonics. Filter by detox, energy, gut health, and more to match your daily wellness goals.",
        },
        {
          Icon: ShoppingCart,
          title: "Smart Bar & Beverage Shopping List",
          body:
            "Auto-generate a shopping list of every spirit, mixer, fruit, and garnish you need to stock your home bar. Check items off as you shop and keep your bar cart guest-ready.",
        },
        {
          Icon: Heart,
          title: "Save Your Signature Drinks",
          body:
            "Build your personal cocktail menu by saving the recipes you love. Rate them, jot down your own twists, and quickly share your signature pours with friends.",
        },
        {
          Icon: Sparkles,
          title: "Cocktails, Mocktails & More",
          body:
            "Explore drinks for every occasion: classic cocktails, zero-proof mocktails, holiday punches, hot toddies, frozen blends, and seasonal sippers. New drink recipes added regularly.",
        },
      ]
    : [
        {
          Icon: ChefHat,
          title: "What Can I Make With What I Have?",
          body:
            "Stop wondering what to cook for dinner. Select ingredients from your pantry, fridge, and spice cabinet, and instantly discover recipes you can make right now. Perfect for using up leftovers and reducing food waste.",
        },
        {
          Icon: Clock,
          title: "Quick & Easy Dinner Ideas",
          body:
            "Find 30-minute meals for busy weeknights. Our collection includes easy recipes for beginners, one-pot dinners, and simple family-friendly dishes that anyone can make with basic cooking skills.",
        },
        {
          Icon: Calendar,
          title: "Weekly Meal Prep & Planning",
          body:
            "Plan your breakfast, lunch, and dinner for the entire week. Drag and drop recipes onto your calendar, track nutritional goals, and streamline your cooking routine with organized meal prep.",
        },
        {
          Icon: ShoppingCart,
          title: "Smart Grocery Shopping List",
          body:
            "Automatically generate shopping lists from your meal plan. Check off items as you shop, and never forget an ingredient again. Perfect for budget-friendly meal planning and reducing grocery store trips.",
        },
        {
          Icon: Heart,
          title: "Save Your Favorite Recipes",
          body:
            "Build your personal cookbook by saving recipes you love. Rate dishes, add personal notes, and quickly access your go-to meals. Share recipe links with family and friends.",
        },
        {
          Icon: Sparkles,
          title: "Diverse Recipe Collection",
          body:
            "Explore recipes for every occasion: healthy meals, comfort food, vegetarian options, keto-friendly dishes, international cuisines, and copycat restaurant favorites. New recipes added regularly.",
        },
      ];

  const faqs = mode === "drink"
    ? [
        {
          q: "How does Ingredify find drinks based on my ingredients?",
          a: "Select the spirits, mixers, juices, and garnishes you have on hand from our organized bar checklist. Our smart matching engine instantly shows cocktails, mocktails, and smoothies you can make with what you already own — Perfect Matches first.",
        },
        {
          q: "Is Ingredify free to use for drink recipes?",
          a: "Yes! Browsing cocktails, mocktails, smoothies, and coffee drinks is completely free. Save your favorites, build shopping lists, and plan a tasting menu with no subscription required.",
        },
        {
          q: "Can I find non-alcoholic and zero-proof drinks?",
          a: "Absolutely. Filter by mocktail or non-alcoholic to discover refreshing alcohol-free spritzes, sparkling sodas, smoothies, lattes, and wellness tonics — perfect for sober-curious nights and family gatherings.",
        },
      ]
    : [
        {
          q: "How does Ingredify find recipes based on my ingredients?",
          a: "Simply select the ingredients you have available from our organized checklist. Our smart matching algorithm instantly shows you recipes where you have most or all of the required ingredients, prioritizing \"Perfect Matches\" at the top.",
        },
        {
          q: "Is Ingredify free to use?",
          a: "Yes! Ingredify is completely free. Browse recipes, plan meals, create shopping lists, and save your favorites without any subscription or payment required.",
        },
        {
          q: "Can I access Ingredify on my phone?",
          a: "Absolutely! Ingredify works on any device and can be installed as an app on your phone for quick access. Use it in the kitchen while cooking with our hands-free cooking mode.",
        },
      ];

  return (
    <section 
      className="mt-16 border-t border-border/50 pt-12"
      aria-labelledby="seo-heading"
    >
      {/* Hidden but crawlable heading for SEO */}
      <h2 
        id="seo-heading" 
        className="font-serif text-2xl font-bold text-center mb-8 text-foreground"
      >
        {heading}
      </h2>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
        {features.map(({ Icon, title, body }) => (
          <article key={title} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          </article>
        ))}
      </div>

      {/* Popular Searches - Keyword-rich content */}
      <div className="mt-12 text-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          {sectionTitle}
        </h3>
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto px-4">
          {popularSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("popular-search", { detail: { term, mode } }),
                );
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Search ${mode === "drink" ? "drinks" : "recipes"} for ${term}`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Schema-friendly FAQ content */}
      <div className="mt-12 max-w-3xl mx-auto px-4">
        <h3 className="font-semibold text-center mb-6 text-foreground">
          Frequently Asked Questions
        </h3>
        <dl className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-medium text-foreground">{q}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
