import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo-sm.webp";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.img 
          src={logo} 
          alt="Ingredify Logo" 
          className="h-24 w-24 mx-auto mb-6 rounded-2xl shadow-warm"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        />
        
        <h1 className="font-serif text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
          Recipe Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          Looks like this dish isn't on the menu. Let's get you back to Ingredify.
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Ingredify
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
