export type Word = string & { readonly _brand: "Word" };

export type LetterFeedback = "CORRECT" | "MISPLACED" | "ABSENT";

export type AttemptResult = {
  letter: string;
  feedback: LetterFeedback;
}[];

export type GameStatus = "IN_PROGRESS" | "WON" | "LOST";

export interface GameState {
  attempts: AttemptResult[];
  status: GameStatus;
  maxAttempts: 6;
}
