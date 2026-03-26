import { LetterTile } from "./LetterTile";
import type { AttemptResult } from "@/domain/types";

interface RowProps {
  /** Résultat d'une tentative soumise */
  result?: AttemptResult;
  /** Saisie en cours (ligne active non soumise) */
  currentInput?: string;
}

export function Row({ result, currentInput }: RowProps) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: 5 }, (_, i) => {
        if (result) {
          return (
            <LetterTile
              key={i}
              letter={result[i].letter}
              feedback={result[i].feedback}
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
