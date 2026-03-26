/** Un mot valide garanti de 5 lettres (branded type) */
export type Word = string & { readonly _brand: "Word" };

/** Feedback retourné pour chaque lettre d'une tentative */
export type LetterFeedback = "CORRECT" | "MISPLACED" | "ABSENT";

/** Résultat d'une tentative : une évaluation par lettre */
export type AttemptResult = {
  letter: string;
  feedback: LetterFeedback;
}[];

/** Statut courant de la partie */
export type GameStatus = "IN_PROGRESS" | "WON" | "LOST";

/** État complet de la partie à un instant T */
export interface GameState {
  attempts: AttemptResult[];
  status: GameStatus;
  maxAttempts: 6;
}
