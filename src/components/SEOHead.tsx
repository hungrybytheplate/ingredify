import { useEffect } from "react";
import { sampleRecipes } from "@/data/recipes";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  type?: "website" | "article";
}

/**
 * Dynamic SEO component that updates document head and injects structured data
 * for better search engine visibility and rich snippets
 */
export function SEOHead({
  title = "The Kitchen — Recipes From Ingredients You Have",
  description = "Find recipes from ingredients you already have. Free meal planner, weekly dinner ideas, and a smart shopping list — all in one app.",
  canonicalPath = "/",
  type = "website"
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", `https://ingredify.org${canonicalPath}`);
    }
    
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", description);
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("href", `https://ingredify.org${canonicalPath}`);
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", title);
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute("content", description);
  }, [title, description, canonicalPath, type]);
  
  return null;
}

/**
 * Generate Recipe structured data for rich snippets in search results
 */
export function generateRecipeSchema(recipe: {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: number;
  mealType: string;
  difficulty?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}) {
  // Parse cookTime string (e.g., "30 min" or "1 hr 15 min")
  const parseCookTime = (time: string): string => {
    const hourMatch = time.match(/(\d+)\s*hr/);
    const minMatch = time.match(/(\d+)\s*min/);
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;
    return `PT${hours > 0 ? `${hours}H` : ""}${minutes > 0 ? `${minutes}M` : ""}`;
  };

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.title,
    "description": recipe.description || `Delicious ${recipe.title} recipe`,
    "author": {
      "@type": "Organization",
      "name": "The Kitchen"
    },
    "datePublished": "2025-01-01",
    "image": `https://ingredify.org/og-image.png`,
    "recipeCategory": recipe.mealType,
    "recipeCuisine": "American",
    "prepTime": "PT10M",
    "cookTime": parseCookTime(recipe.cookTime),
    "totalTime": parseCookTime(recipe.cookTime),
    "recipeYield": `${recipe.servings} servings`,
    "recipeIngredient": recipe.ingredients.map(ing => ing.replace(/-/g, " ")),
    "recipeInstructions": recipe.instructions.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    })),
    ...(recipe.nutrition && {
      "nutrition": {
        "@type": "NutritionInformation",
        ...(recipe.nutrition.calories && { "calories": `${recipe.nutrition.calories} calories` }),
        ...(recipe.nutrition.protein && { "proteinContent": `${recipe.nutrition.protein}g` }),
        ...(recipe.nutrition.carbs && { "carbohydrateContent": `${recipe.nutrition.carbs}g` }),
        ...(recipe.nutrition.fat && { "fatContent": `${recipe.nutrition.fat}g` })
      }
    }),
    "keywords": [
      recipe.mealType,
      recipe.difficulty || "easy",
      "homemade",
      ...recipe.ingredients.slice(0, 5).map(ing => ing.replace(/-/g, " "))
    ].join(", ")
  };
}

/**
 * Generate ItemList schema for recipe collections (carousel in search)
 */
export function generateRecipeCollectionSchema() {
  const featuredRecipes = sampleRecipes.slice(0, 10);
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popular Recipes on The Kitchen",
    "description": "Top rated recipes you can make with common ingredients",
    "numberOfItems": featuredRecipes.length,
    "itemListElement": featuredRecipes.map((recipe, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Recipe",
        "name": recipe.title,
        "url": `https://ingredify.org/?recipe=${recipe.id}`,
        "image": "https://ingredify.org/og-image.png",
        "author": {
          "@type": "Organization",
          "name": "The Kitchen"
        }
      }
    }))
  };
}

/**
 * Generate HowTo schema for the meal planning feature
 */
export function generateMealPlanningGuideSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Plan Your Weekly Meals with The Kitchen App",
    "description": "Step-by-step guide to planning a week of meals using ingredients you already have at home",
    "totalTime": "PT10M",
    "tool": [
      {
        "@type": "HowToTool",
        "name": "The Kitchen App"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Select Your Ingredients",
        "text": "Browse through your pantry, fridge, and spice cabinet. Check off all the ingredients you currently have available."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Find Matching Recipes",
        "text": "Click 'Find Recipes' to discover breakfast, lunch, and dinner options that match your available ingredients."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Add to Meal Calendar",
        "text": "For each recipe you like, click the calendar icon to add it to your weekly meal plan on your preferred day."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Generate Shopping List",
        "text": "Review your meal plan and automatically generate a shopping list for any missing ingredients."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Start Cooking",
        "text": "Follow the step-by-step instructions for each recipe. Use cooking mode for hands-free guidance."
      }
    ]
  };
}

/**
 * Inject structured data script into document head
 */
export function injectStructuredData(schema: object, id: string) {
  // Remove existing script with same id
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
