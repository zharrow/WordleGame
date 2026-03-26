import { cn } from "@/lib/utils";
import type { LetterFeedback } from "@/domain/types";

interface LetterTileProps {
  letter?: string;
  feedback?: LetterFeedback;
  /** Tuile de la ligne courante (pas encore soumise) */
  isCurrent?: boolean;
}

const feedbackStyles: Record<LetterFeedback, string> = {
  CORRECT: "bg-green-600 border-green-600 text-white",
  MISPLACED: "bg-yellow-500 border-yellow-500 text-white",
  ABSENT: "bg-zinc-600 border-zinc-600 text-white",
};

export function LetterTile({ letter, feedback, isCurrent }: LetterTileProps) {
  return (
    <div
      className={cn(
        "flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase transition-colors duration-300",
        feedback
          ? feedbackStyles[feedback]
          : isCurrent && letter
            ? "border-zinc-400 text-zinc-100"
            : "border-zinc-700 text-zinc-100",
      )}
    >
      {letter ?? ""}
    </div>
  );
}
