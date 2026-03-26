import { cn } from "@/lib/utils";
import { LetterTile } from "./LetterTile";
import type { AttemptResult } from "@/domain/types";

interface RowProps {
  result?: AttemptResult;
  currentInput?: string;
  isShaking?: boolean;
  isWinningRow?: boolean;
  /** Ligne de révélation : affiche les lettres du mot secret sans feedback */
  secretLetters?: string;
}

export function Row({
  result,
  currentInput,
  isShaking,
  isWinningRow,
  secretLetters,
}: RowProps) {
  return (
    <div className={cn("flex gap-1.5", isShaking && "tile-shake")}>
      {Array.from({ length: 5 }, (_, i) => {
        if (secretLetters !== undefined) {
          return (
            <LetterTile
              key={i}
              letter={secretLetters[i]}
              isSecret
            />
          );
        }
        if (result) {
          return (
            <LetterTile
              key={i}
              letter={result[i].letter}
              feedback={result[i].feedback}
              flipDelay={i * 100}
              isWinning={isWinningRow}
            />
          );
        }
        return (
          <LetterTile
            key={i}
            letter={currentInput?.[i]}
            isCurrent={currentInput !== undefined}
          />
        );
      })}
    </div>
  );
}
