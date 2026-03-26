import { Row } from "./Row";
import type { AttemptResult, GameState } from "@/domain/types";

interface GameBoardProps {
  attempts: AttemptResult[];
  currentInput: string;
  gameStatus: GameState["status"];
}

export function GameBoard({ attempts, currentInput, gameStatus }: GameBoardProps) {
  const MAX_ATTEMPTS = 6;

  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
        if (rowIndex < attempts.length) {
          // Ligne soumise
          return <Row key={rowIndex} result={attempts[rowIndex]} />;
        }
        if (rowIndex === attempts.length && gameStatus === "IN_PROGRESS") {
          // Ligne active
          return <Row key={rowIndex} currentInput={currentInput} />;
        }
        // Ligne vide future
        return <Row key={rowIndex} />;
      })}
    </div>
  );
}
