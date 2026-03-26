"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!message) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onDismiss, 2400);
    return () => clearTimeout(timerRef.current);
  }, [message, onDismiss]);

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-zinc-800 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 shadow-xl pointer-events-none",
        "transition-opacity duration-300",
        message ? "opacity-100" : "opacity-0",
      )}
    >
      {message}
    </div>
  );
}
