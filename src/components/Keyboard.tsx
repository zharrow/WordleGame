import { cn } from "@/lib/utils";
import type { LetterFeedback } from "@/domain/types";
import type { LetterStates } from "@/hooks/useWordle";

interface KeyboardProps {
  letterStates: LetterStates;
  onKey: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const ROWS = [
  ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
  ["ENTER", "W", "X", "C", "V", "B", "N", "←"],
];

const feedbackStyles: Record<LetterFeedback, string> = {
  CORRECT:   "bg-green-600  border-green-600  text-white",
  MISPLACED: "bg-yellow-500 border-yellow-500 text-white",
  ABSENT:    "bg-zinc-500   border-zinc-500   text-zinc-300",
};

export function Keyboard({
  letterStates,
  onKey,
  onEnter,
  onBackspace,
  disabled,
}: KeyboardProps) {
  function handleKey(key: string) {
    if (disabled) return;
    if (key === "ENTER") onEnter();
    else if (key === "←") onBackspace();
    else onKey(key);
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((key) => {
            const feedback = key.length === 1 ? letterStates[key] : undefined;
            const isAction = key === "ENTER" || key === "←";

            return (
              <button
                key={key}
                onClick={() => handleKey(key)}
                disabled={disabled}
                className={cn(
                  "flex h-12 items-center justify-center rounded border font-bold uppercase transition-colors sm:h-14",
                  // Largeur : touches action plus larges
                  isAction
                    ? "min-w-[3rem] px-2 text-xs sm:min-w-[3.5rem] sm:text-sm"
                    : "min-w-[2.2rem] text-sm sm:min-w-[2.5rem] sm:text-base",
                  // Touche ENTER mise en avant
                  key === "ENTER" && !feedback
                    ? "border-zinc-400 bg-zinc-500 text-white dark:border-zinc-500 dark:bg-zinc-500 hover:bg-zinc-400 dark:hover:bg-zinc-400"
                    : // Touche retour
                      key === "←" && !feedback
                      ? "border-zinc-300 bg-zinc-200 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                      : // Lettre avec feedback
                        feedback
                        ? feedbackStyles[feedback]
                        : // Lettre neutre
                          "border-zinc-300 bg-zinc-200 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
