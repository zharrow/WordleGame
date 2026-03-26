import type { IDictionary } from "./IDictionary";
import type { Word, AttemptResult, GameState } from "./types";
import { evaluateGuess } from "./feedback";
import {
  InvalidWordError,
  InvalidLengthError,
  GameAlreadyOverError,
} from "./errors";

export class WordleGame {
  private readonly secret: Word;
  private readonly dictionary: IDictionary;
  private attempts: AttemptResult[] = [];

  constructor(secret: Word, dictionary: IDictionary) {
    this.secret = secret;
    this.dictionary = dictionary;
  }

  /**
   * Soumet une tentative.
   * @throws {GameAlreadyOverError} si la partie est terminée
   * @throws {InvalidLengthError} si le mot ne fait pas 5 lettres
   * @throws {InvalidWordError} si le mot n'est pas dans le dictionnaire
   */
  guess(word: string): AttemptResult {
    if (this.getState().status !== "IN_PROGRESS") {
      throw new GameAlreadyOverError();
    }

    const normalized = word.toUpperCase();

    if (normalized.length !== 5) {
      throw new InvalidLengthError(word);
    }

    if (!this.dictionary.isValid(normalized)) {
      throw new InvalidWordError(word);
    }

    const result = evaluateGuess(normalized as Word, this.secret);
    this.attempts.push(result);
    return result;
  }

  getState(): GameState {
    const lastAttempt = this.attempts[this.attempts.length - 1];
    const won =
      lastAttempt !== undefined &&
      lastAttempt.every((r) => r.feedback === "CORRECT");

    const status = won
      ? "WON"
      : this.attempts.length >= 6
        ? "LOST"
        : "IN_PROGRESS";

    return {
      attempts: this.attempts,
      status,
      maxAttempts: 6,
    };
  }
}
