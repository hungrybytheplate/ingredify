import { HelpCircle, LogIn, LogOut, User, Settings2, Package, Shield } from "lucide-react";
import logoAsset from "@/assets/ingredify-mark.png.asset.json";
const logo = logoAsset.url;
import taglineIcon from "@/assets/tagline-icon-sm.webp";
import { Button } from "@/components/ui/button";
import { QuickTooltip } from "@/components/Tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserPreferencesDialog } from "@/components/UserPreferencesDialog";
import { SyncIndicator } from "@/components/SyncIndicator";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface HeaderProps {
  onShowTour?: () => void;
}

export function Header({ onShowTour }: HeaderProps) {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <>
      {/* Skip navigation link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>
        <motion.header 
        className="py-2 sm:py-5 px-3 sm:px-4 border-b border-border/30 glass sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        role="banner"
      >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        <motion.div 
          className="flex items-center gap-2 sm:gap-4 min-w-0"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <motion.div 
            className="relative shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={logo} 
              alt="Ingredify Logo" 
              width={80}
              height={80}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-10 w-10 sm:h-20 sm:w-20 rounded-xl sm:rounded-3xl object-cover shadow-lg ring-2 ring-primary/20"
            />
          </motion.div>
          <div className="min-w-0 hidden sm:block">
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight truncate">
              Ingredify
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              See what's possible
            </p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {user && <SyncIndicator />}
          <ThemeToggle />
          
          {user && (
            <>
              <QuickTooltip content="My Pantry" side="bottom">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/pantry')}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9"
                  aria-label="My Pantry"
                  data-tour="pantry-link"
                >
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </QuickTooltip>
              <UserPreferencesDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9"
                    aria-label="Preferences"
                  >
                    <Settings2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                }
              />
            </>
          )}

          <QuickTooltip content="Privacy Policy" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/privacy')}
              className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Privacy Policy"
            >
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </QuickTooltip>
          
          {onShowTour && (
            <QuickTooltip content="Take a tour" side="bottom">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onShowTour}
                className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9"
                aria-label="Take a tour"
              >
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </QuickTooltip>
          )}
          
          {!loading && (
            <>
              {user ? (
                <QuickTooltip content={`Signed in as ${user.email}`} side="bottom">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2"
                    aria-label="Sign out"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                    <LogOut className="h-4 w-4 sm:hidden" />
                  </Button>
                </QuickTooltip>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
            </>
          )}
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-accent-foreground/10">
            <img src={taglineIcon} alt="" width={20} height={20} loading="lazy" className="h-5 w-5 object-contain" />
            <span className="text-sm font-medium text-accent-foreground">Fresh & Simple</span>
          </div>
        </div>
      </div>
    </motion.header>
    </>
  );
}
