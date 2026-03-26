import { cn } from "@/lib/utils";
import type { LetterFeedback } from "@/domain/types";

interface LetterTileProps {
  letter?: string;
  feedback?: LetterFeedback;
  isCurrent?: boolean;
  flipDelay?: number;
  /** Tuile de la ligne gagnante — animation bounce après le flip */
  isWinning?: boolean;
  /** Tuile de la ligne révélation du mot secret (défaite) */
  isSecret?: boolean;
}

const feedbackStyles: Record<LetterFeedback, string> = {
  CORRECT:   "bg-green-600  border-green-600  text-white",
  MISPLACED: "bg-yellow-500 border-yellow-500 text-white",
  ABSENT:    "bg-zinc-500   border-zinc-500   text-white",
};

export function LetterTile({
  letter,
  feedback,
  isCurrent,
  flipDelay = 0,
  isWinning = false,
  isSecret = false,
}: LetterTileProps) {
  // Animation inline pour combiner flip + bounce staggeré sur la ligne gagnante
  const winStyle = isWinning
    ? {
        animation: `tile-flip 0.5s ease ${flipDelay}ms forwards, tile-bounce 0.6s ease ${900 + flipDelay}ms forwards`,
      }
    : feedback
      ? { animationDelay: `${flipDelay}ms` }
      : undefined;

  return (
    <div
      className={cn(
        // Taille responsive
        "flex h-12 w-12 items-center justify-center border-2 text-xl font-bold uppercase sm:h-14 sm:w-14 sm:text-2xl",
        // Feedback soumis
        feedback && !isWinning
          ? [feedbackStyles[feedback], "tile-flip"]
          : feedback && isWinning
            ? feedbackStyles[feedback]
            : // Ligne révélation (défaite)
              isSecret
              ? "border-amber-600/60 bg-amber-900/20 text-amber-200 dark:border-amber-500/50 dark:bg-amber-900/20 dark:text-amber-200"
              : // Ligne courante avec lettre tapée
                isCurrent && letter
                ? "border-zinc-500 text-zinc-900 dark:border-zinc-400 dark:text-zinc-100 tile-pop"
                : // Ligne vide
                  "border-zinc-300 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100",
      )}
      style={winStyle}
    >
      {letter ?? ""}
    </div>
  );
}
