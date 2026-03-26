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
  CORRECT: "bg-green-600 text-white border-green-600",
  MISPLACED: "bg-yellow-500 text-white border-yellow-500",
  ABSENT: "bg-zinc-600 text-zinc-400 border-zinc-600",
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
        <div key={rowIndex} className="flex gap-1.5">
          {row.map((key) => {
            const feedback = key.length === 1 ? letterStates[key] : undefined;
            return (
              <button
                key={key}
                onClick={() => handleKey(key)}
                disabled={disabled}
                className={cn(
                  "flex h-14 min-w-[2.5rem] items-center justify-center rounded border px-2 text-sm font-bold uppercase transition-colors",
                  key.length > 1 ? "min-w-[3.5rem] text-xs" : "",
                  feedback
                    ? feedbackStyles[feedback]
                    : "border-zinc-600 bg-zinc-700 text-zinc-100 hover:bg-zinc-600",
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
