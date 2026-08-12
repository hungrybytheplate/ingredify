import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Download, Share, Plus, MoreVertical, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center p-4">
      <SEOHead
        title="Install Ingredify - Add to Home Screen"
        description="Install Ingredify on your phone or desktop for one-tap access to recipes, meal plans, and shopping lists — works offline."
        canonicalPath="/install"
      />
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 rounded-2xl gradient-warm shadow-warm w-fit">
            <UtensilsCrossed className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="font-serif text-2xl">Install Ingredify</CardTitle>
          <CardDescription>
            Add Ingredify to your home screen for quick access and an app-like experience
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Ingredify is already installed on your device!
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                Open App
              </Button>
            </div>
          ) : deferredPrompt ? (
            <div className="space-y-4">
              <Button onClick={handleInstall} className="w-full gap-2" size="lg">
                <Download className="h-5 w-5" />
                Install Now
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Works offline and loads instantly
              </p>
            </div>
          ) : isIOS ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center mb-4">
                To install on your iPhone or iPad:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Share className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm">Tap the <strong>Share</strong> button in Safari</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm">Scroll down and tap <strong>Add to Home Screen</strong></p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm">Tap <strong>Add</strong> to confirm</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center mb-4">
                To install on your Android device:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MoreVertical className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm">Tap the <strong>menu</strong> (three dots) in your browser</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm">Tap <strong>Install app</strong> or <strong>Add to Home Screen</strong></p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm">Confirm by tapping <strong>Install</strong></p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border/50">
            <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
              Continue in browser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
