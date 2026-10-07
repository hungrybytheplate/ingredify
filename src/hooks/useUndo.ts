import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface UndoAction<T = unknown> {
  id: string;
  description: string;
  data: T;
  undo: () => Promise<void>;
}

const UNDO_TIMEOUT = 5000; // 5 seconds

export function useUndo() {
  const [pendingAction, setPendingAction] = useState<UndoAction | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      globalThis.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const addUndoAction = useCallback(<T = unknown>(action: UndoAction<T>) => {
    clearTimeout();
    setPendingAction(action as UndoAction);
    
    // Auto-clear after timeout
    timeoutRef.current = globalThis.setTimeout(() => {
      setPendingAction(null);
    }, UNDO_TIMEOUT);
  }, [clearTimeout]);

  const executeUndo = useCallback(async () => {
    if (!pendingAction) return;
    
    clearTimeout();
    
    try {
      await pendingAction.undo();
      toast({
        title: "Undone!",
        description: pendingAction.description,
      });
    } catch (error) {
      toast({
        title: "Undo failed",
        description: "Could not undo the action.",
        variant: "destructive",
      });
    }
    
    setPendingAction(null);
  }, [pendingAction, clearTimeout]);

  const dismissUndo = useCallback(() => {
    clearTimeout();
    setPendingAction(null);
  }, [clearTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeout();
  }, [clearTimeout]);

  return {
    pendingAction,
    addUndoAction,
    executeUndo,
    dismissUndo,
    hasUndo: !!pendingAction,
  };
}
