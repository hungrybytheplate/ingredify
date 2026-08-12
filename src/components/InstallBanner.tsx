import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Share, Plus, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already installed or dismissed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isDismissed = localStorage.getItem("install-banner-dismissed");
    
    if (isStandalone || isDismissed) {
      return;
    }

    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Show banner after a short delay
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000);

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("install-banner-dismissed", "true");
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      navigate("/install");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-md mx-auto bg-card border border-border/50 rounded-2xl shadow-elevated overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl gradient-warm shrink-0">
              <Download className="h-5 w-5 text-primary-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">Install Ingredify</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Add to your home screen for quick access
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 -mt-1 -mr-1 h-8 w-8"
              onClick={handleDismiss}
              aria-label="Dismiss install banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {deferredPrompt ? (
            <div className="mt-3 flex gap-2">
              <Button onClick={handleInstall} size="sm" className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Install Now
              </Button>
              <Button variant="outline" size="sm" onClick={handleDismiss}>
                Not Now
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full justify-between text-muted-foreground"
                onClick={() => setExpanded(!expanded)}
              >
                <span>How to install</span>
                <span className="text-xs">{expanded ? "Hide" : "Show"}</span>
              </Button>

              {expanded && (
                <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                  {isIOS ? (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Share className="h-4 w-4 text-primary" />
                        </div>
                        <span>Tap <strong>Share</strong> in Safari</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Plus className="h-4 w-4 text-primary" />
                        </div>
                        <span>Tap <strong>Add to Home Screen</strong></span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <MoreVertical className="h-4 w-4 text-primary" />
                        </div>
                        <span>Tap <strong>menu</strong> (⋮) in browser</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Download className="h-4 w-4 text-primary" />
                        </div>
                        <span>Tap <strong>Install app</strong></span>
                      </div>
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => navigate("/install")}
                  >
                    Full instructions
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
