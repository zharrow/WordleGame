import { Row } from "./Row";
import type { AttemptResult, GameState } from "@/domain/types";

interface GameBoardProps {
  attempts: AttemptResult[];
  currentInput: string;
  gameStatus: GameState["status"];
  isShaking: boolean;
  secretWord: string | null;
}

export function GameBoard({
  attempts,
  currentInput,
  gameStatus,
  isShaking,
  secretWord,
}: GameBoardProps) {
  const MAX_ATTEMPTS = 6;
  const winningRowIndex = gameStatus === "WON" ? attempts.length - 1 : -1;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Compteur d'essais */}
      <div className="flex items-center gap-1.5 self-end">
        {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
          <span
            key={i}
            className={
              i < attempts.length
                ? "h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-400"
                : "h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"
            }
          />
        ))}
        <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
          {attempts.length}/{MAX_ATTEMPTS}
        </span>
      </div>

      {/* Grille */}
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
          if (rowIndex < attempts.length) {
            return (
              <Row
                key={rowIndex}
                result={attempts[rowIndex]}
                isWinningRow={rowIndex === winningRowIndex}
              />
            );
          }
          if (rowIndex === attempts.length && gameStatus === "IN_PROGRESS") {
            return (
              <Row
                key={rowIndex}
                currentInput={currentInput}
                isShaking={isShaking}
              />
            );
          }
          return <Row key={rowIndex} />;
        })}

        {/* Ligne révélation du mot secret après défaite */}
        {gameStatus === "LOST" && secretWord && (
          <Row secretLetters={secretWord} />
        )}
      </div>

      {/* Indicateur de lettres saisies (ligne active) */}
      {gameStatus === "IN_PROGRESS" && (
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={
                i < currentInput.length
                  ? "h-1.5 w-1.5 rounded-full bg-zinc-500 dark:bg-zinc-400 transition-colors"
                  : "h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 transition-colors"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
