import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSchema } from "@/components/PageSchema";
import { SEOHead } from "@/components/SEOHead";

export default function Privacy() {
  const lastUpdated = "April 30, 2026";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy - Ingredify"
        description="How Ingredify collects, stores, and protects your data. We don't sell your data, run ads, or share with data brokers."
        canonicalPath="/privacy"
        type="article"
      />
      <PageSchema
        id="schema-privacy"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy",
          description:
            "How Ingredify collects, stores, and protects your data. We do not sell your data, do not use it for advertising, and do not share it with data brokers.",
          url: "https://ingredify.org/privacy",
          inLanguage: "en",
          isPartOf: {
            "@type": "WebSite",
            name: "Ingredify",
            url: "https://ingredify.org/",
          },
          dateModified: "2026-04-30",
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://ingredify.org/" },
              { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://ingredify.org/privacy" },
            ],
          },
        }}
      />
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">
              Ingredify ("we", "our", "us") is a meal planning and recipe discovery app. We respect your privacy and only collect the data needed to make the app work for you. We do not sell your data, do not use it for advertising, and do not share it with data brokers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">Data we collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Account info:</strong> email address and a unique user ID, used to sign you in and sync your data across devices.</li>
              <li><strong>Your content:</strong> saved recipes, meal plans, shopping lists, recipe notes, ratings, pantry selections, and dietary preferences.</li>
              <li><strong>Imported recipes:</strong> if you use "Import from URL", the link you paste is sent to our recipe parser so we can extract the ingredients and steps for you.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">How we use your data</h2>
            <p className="text-muted-foreground">
              Your data is used solely to provide app functionality: signing you in, syncing your saved recipes and meal plans, generating shopping lists, and personalizing recipe suggestions based on your pantry and preferences.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">How your data is stored</h2>
            <p className="text-muted-foreground">
              Data is stored on our managed backend (Supabase) and protected by Row Level Security policies, meaning only you can read or modify your own records. Connections are encrypted in transit using HTTPS/TLS.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">Tracking & analytics</h2>
            <p className="text-muted-foreground">
              Ingredify does not include third-party advertising SDKs, cross-app tracking, or analytics that profile individual users.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">Third-party content</h2>
            <p className="text-muted-foreground">
              When you import a recipe from a URL, the original recipe content remains the property of its publisher. Imported recipes are stored privately in your account for your personal use only.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">Your rights</h2>
            <p className="text-muted-foreground">
              You can edit or delete any of your saved recipes, meal plans, notes, and shopping items at any time from within the app. To delete your account and all associated data, contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">Children</h2>
            <p className="text-muted-foreground">
              Ingredify is not directed to children under 13 and we do not knowingly collect personal data from them.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">Changes to this policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. The "Last updated" date above will reflect the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">Contact</h2>
            <p className="text-muted-foreground">
              Questions about this policy? Reach us on Instagram <a href="https://instagram.com/ingredify.app" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">@ingredify.app</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
