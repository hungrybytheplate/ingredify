import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm mt-12">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Questions or concerns? Reach out to us!
          </p>
          <a
            href="https://www.instagram.com/ingredify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="h-5 w-5" />
            <span>@ingredify.app</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
